import { merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';
import { scanState, typeOf } from '../models/events/action';
import {
  JitsiConferenceEvents,
  JitsiConferenceEventTypes
} from '../models/events/conference';
import { JitsiMeetService } from './jitsiMeetService';
import {
  StatsStateActions,
  UpdateUserAudioLevel
} from './reducers/statsActions';
import { statsInitialState, statsReducer } from './reducers/statsReducer';

@scoped(Lifecycle.ContainerScoped)
export class JitsiStatsStateService {
  private events$ = this.jitsiService.conferenceEvents$.pipe(
    typeOf(JitsiConferenceEventTypes.AudioLevelsChanged),
    tap(event => this.handleEvents(event))
  );

  private stateInner$ = new Subject<StatsStateActions>();
  state$ = this.stateInner$.pipe(scanState(statsReducer, statsInitialState));

  constructor(private jitsiService: JitsiMeetService) {}

  init() {
    return merge(this.events$, this.state$);
  }

  private handleEvents(event: JitsiConferenceEvents) {
    switch (event.type) {
      case JitsiConferenceEventTypes.AudioLevelsChanged: {
        const [userId, level] = event.payload;
        this.stateInner$.next(new UpdateUserAudioLevel({ userId, level }));
        break;
      }
    }
  }
}
