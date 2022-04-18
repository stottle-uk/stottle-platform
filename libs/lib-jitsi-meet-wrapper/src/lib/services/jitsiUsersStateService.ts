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
  AddUser,
  RemoveUser,
  UsersStateActions
} from './reducers/usersActions';
import { usersInitialState, usersReducer } from './reducers/usersReducer';

@scoped(Lifecycle.ContainerScoped)
export class JitsiUsersStateService {
  private events$ = this.jitsiService.conferenceEvents$.pipe(
    typeOf(
      JitsiConferenceEventTypes.UserLeft,
      JitsiConferenceEventTypes.UserJoined
    ),
    tap(event => this.handleEvents(event))
  );

  private stateInner$ = new Subject<UsersStateActions>();
  state$ = this.stateInner$.pipe(scanState(usersReducer, usersInitialState));

  constructor(private jitsiService: JitsiMeetService) {}

  init() {
    return merge(this.events$, this.state$);
  }

  private handleEvents(event: JitsiConferenceEvents) {
    switch (event.type) {
      case JitsiConferenceEventTypes.UserLeft:
        this.stateInner$.next(new RemoveUser(event.payload[0]));
        break;
      case JitsiConferenceEventTypes.UserJoined:
        this.stateInner$.next(
          new AddUser({ userId: event.payload[0], user: event.payload[1] })
        );
        break;
    }
  }
}
