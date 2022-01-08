import { merge, Subject } from 'rxjs';
import { filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { scanState, typeOf } from '../models/events/action';
import {
  JitsiConferenceEvents,
  JitsiConferenceEventTypes
} from '../models/events/conference';
import { JitsiConnectionEventTypes } from '../models/events/connection';
import { AudioMixerEffect } from './effects/audioMixerEffect';
import { JitsiMeetService } from './jitsiMeetService';
import {
  AddTrack,
  RemoveTrack,
  TracksStateActions
} from './reducers/tracksActions';
import { tracksInitialState, tracksReducer } from './reducers/tracksReducer';

export class JitsiTracksStateService {
  private createLocalTracks$ = this.jitsiService.connectionEvents$.pipe(
    typeOf(JitsiConnectionEventTypes.ConnectionEstablished),
    switchMap(() => this.jitsiService.createLocalTracks()),
    switchMap(track => this.jitsiService.addTrack(track))
  );
  private events$ = this.jitsiService.conferenceEvents$.pipe(
    typeOf(
      JitsiConferenceEventTypes.TrackAdded,
      JitsiConferenceEventTypes.TrackRemoved
    ),
    tap(event => this.handleEvents(event))
  );

  private stateInner$ = new Subject<TracksStateActions>();
  state$ = this.stateInner$.pipe(scanState(tracksReducer, tracksInitialState));

  constructor(private jitsiService: JitsiMeetService) {}

  init() {
    return merge(this.createLocalTracks$, this.events$, this.state$);
  }

  shareAudio() {
    this.jitsiService
      .createLocalTracks({
        devices: ['desktop']
      })
      .pipe(
        filter(track => track.getType() === 'audio'),
        withLatestFrom(this.state$),
        tap(([track, tracksState]) => {
          const localAudioTrack = tracksState.localTracks.find(
            t => t.getType() === 'audio'
          );

          if (localAudioTrack) {
            track.setEffect(new AudioMixerEffect(localAudioTrack));
          }
        })
      )
      .subscribe();
  }

  private handleEvents(event: JitsiConferenceEvents) {
    switch (event.type) {
      case JitsiConferenceEventTypes.TrackAdded:
        this.stateInner$.next(new AddTrack(event.payload));
        break;
      case JitsiConferenceEventTypes.TrackRemoved:
        this.stateInner$.next(new RemoveTrack(event.payload));
        break;
    }
  }
}
