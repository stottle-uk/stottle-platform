import { merge, Subject } from 'rxjs';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Lifecycle, scoped } from 'tsyringe';
import { scanState, typeOf } from '../models/events/action';
import {
  JitsiConnectionEvents,
  JitsiConnectionEventTypes
} from '../models/events/connection';
import { JitsiConferenceOptions } from '../models/JitsiConference';
import { JitsiConnectionOptions } from '../models/JitsiConnection';
import { JitsiMeetService } from './jitsiMeetService';
import {
  ConnectionStateActions,
  SetConnected,
  SetIsConnecting
} from './reducers/connectionActions';
import {
  connectionInitialState,
  connectionReducer
} from './reducers/connectionReducer';

@scoped(Lifecycle.ContainerScoped)
export class JitsiConnectionStateService {
  private confOptionsInner$ = new Subject<{
    roomname: string;
    confOptions: JitsiConferenceOptions;
  }>();
  private initConference$ = this.jitsiService.connectionEvents$.pipe(
    typeOf(JitsiConnectionEventTypes.ConnectionEstablished),
    withLatestFrom(this.confOptionsInner$),
    switchMap(([, { roomname, confOptions }]) =>
      this.jitsiService.initConference(roomname, confOptions)
    )
  );
  private events$ = this.jitsiService.connectionEvents$.pipe(
    typeOf(
      JitsiConnectionEventTypes.ConnectionEstablished,
      JitsiConnectionEventTypes.ConnectionDisconnected
    ),
    tap(event => this.handleEvents(event))
  );

  private stateInner$ = new Subject<ConnectionStateActions>();
  state$ = this.stateInner$.pipe(
    scanState(connectionReducer, connectionInitialState)
  );

  constructor(private jitsiService: JitsiMeetService) {}

  init() {
    return merge(this.events$, this.initConference$, this.state$);
  }

  connect(
    roomname: string,
    token: string | null,
    connOptions: JitsiConnectionOptions,
    confOptions: JitsiConferenceOptions
  ) {
    this.confOptionsInner$.next({
      roomname,
      confOptions
    });
    this.stateInner$.next(new SetIsConnecting(true));
    this.jitsiService.connect(null, token, {
      ...connOptions,
      serviceUrl: connOptions.serviceUrl
        ? `${connOptions.serviceUrl}?room=${roomname}`
        : undefined
    });
  }

  disconnect() {
    this.jitsiService.disconnect();
  }

  private handleEvents(event: JitsiConnectionEvents) {
    switch (event.type) {
      case JitsiConnectionEventTypes.ConnectionEstablished:
        this.stateInner$.next(new SetConnected(true));
        this.stateInner$.next(new SetIsConnecting(false));
        break;
      case JitsiConnectionEventTypes.ConnectionDisconnected:
        this.stateInner$.next(new SetConnected(false));
        break;
    }
  }
}
