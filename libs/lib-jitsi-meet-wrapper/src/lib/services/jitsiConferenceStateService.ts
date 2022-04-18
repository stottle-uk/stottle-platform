import { merge, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';
import { scanState, typeOf } from '../models/events/action';
import {
  JitsiConferenceEvents,
  JitsiConferenceEventTypes
} from '../models/events/conference';
import { JitsiMeetService } from './jitsiMeetService';
import {
  AuthStatusChanged,
  ConferenceStateActions,
  SetCreatedTimestamp,
  SetJoined,
  SetKicked,
  SetLeft
} from './reducers/conferenceActions';
import {
  conferenceInitialState,
  conferenceReducer
} from './reducers/conferenceReducer';

@scoped(Lifecycle.ContainerScoped)
export class JitsiConferenceStateService {
  private userLeft$ = this.jitsiService.conferenceEvents$.pipe(
    typeOf(JitsiConferenceEventTypes.Left, JitsiConferenceEventTypes.kicked),
    switchMap(() => this.jitsiService.disconnect())
  );
  private events$ = this.jitsiService.conferenceEvents$.pipe(
    typeOf(
      JitsiConferenceEventTypes.CreatedTimestamp,
      JitsiConferenceEventTypes.Joined,
      JitsiConferenceEventTypes.Left,
      JitsiConferenceEventTypes.kicked,
      JitsiConferenceEventTypes.AuthStatusChanged
    ),
    tap(event => this.handleEvents(event))
  );

  private stateInner$ = new Subject<ConferenceStateActions>();
  state$ = this.stateInner$.pipe(
    scanState(conferenceReducer, conferenceInitialState)
  );

  constructor(private jitsiService: JitsiMeetService) {}

  init() {
    return merge(this.userLeft$, this.events$, this.state$);
  }

  joinConference(username: string, password?: string) {
    this.jitsiService.joinConference(username, password).subscribe();
  }

  leaveConference() {
    this.jitsiService.leaveConference().subscribe();
  }

  private handleEvents(event: JitsiConferenceEvents) {
    switch (event.type) {
      case JitsiConferenceEventTypes.AuthStatusChanged:
        this.stateInner$.next(
          new AuthStatusChanged({
            authEnabled: event.payload[0],
            authIdentity: event.payload[1]
          })
        );
        break;
      case JitsiConferenceEventTypes.CreatedTimestamp:
        this.stateInner$.next(new SetCreatedTimestamp(event.payload));
        break;
      case JitsiConferenceEventTypes.Joined:
        this.stateInner$.next(new SetJoined(event.payload));
        break;
      case JitsiConferenceEventTypes.Left:
        this.stateInner$.next(new SetLeft());
        break;
      case JitsiConferenceEventTypes.kicked:
        this.stateInner$.next(new SetKicked());
        break;
    }
  }
}
