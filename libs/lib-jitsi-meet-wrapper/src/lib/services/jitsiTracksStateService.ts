import { EMPTY, from, merge, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';
import { scanState, typeOf } from '../models/events/action';
import {
  JitsiConferenceEvents,
  JitsiConferenceEventTypes
} from '../models/events/conference';
import { JitsiConnectionEventTypes } from '../models/events/connection';
import { JitsiTrack } from '../models/JitsiTrack';
import { AudioMixerEffect } from './effects/audioMixerEffect';
import { JitsiMeetService } from './jitsiMeetService';
import {
  AddTrack,
  RemoveTrack,
  TracksStateActions
} from './reducers/tracksActions';
import {
  tracksInitialState,
  tracksReducer,
  TracksState
} from './reducers/tracksReducer';

@scoped(Lifecycle.ContainerScoped)
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
        withLatestFrom(this.state$),
        switchMap(([track, tracksState]) => {
          if (track.getType() === 'video') {
            return from(track.dispose());
          }

          if (track.getType() === 'audio') {
            return this.mixAudio(track, tracksState);
          }

          return EMPTY;
        }),
        catchError(err =>
          err.name === 'gum.screensharing_user_canceled'
            ? EMPTY
            : throwError(() => new Error(err.name))
        )
      )
      .subscribe();
  }

  private mixAudio(track: JitsiTrack, tracksState: TracksState) {
    const localAudioTrack = tracksState.localTracks.find(
      t => t.getType() === 'audio'
    );
    if (localAudioTrack) {
      const effect = new AudioMixerEffect(
        track,
        this.jitsiService.createAudioMixer()
      );

      return localAudioTrack.setEffect(effect);
    }
    return EMPTY;
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
