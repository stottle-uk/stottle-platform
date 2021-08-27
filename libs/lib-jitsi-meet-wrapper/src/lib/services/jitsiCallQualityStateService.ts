import { merge, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { scanState, typeOf } from '../models/events/action';
import {
  JitsiCallQualityEvents,
  JitsiCallQualityEventTypes
} from '../models/events/callQuality';
import { JitsiMeetService } from './jitsiMeetService';
import {
  CallQualityStateActions,
  LocalStatsUpdated,
  RemoteStatsUpdated
} from './reducers/callQualityActions';
import {
  callQualityInitialState,
  callQualityReducer
} from './reducers/callQualityReducer';

export class JitsiCallQualityStateService {
  private events$ = this.jitsiService.connectionQualityEvents$.pipe(
    tap(console.log),
    typeOf(
      JitsiCallQualityEventTypes.RemoteStatsUpdated,
      JitsiCallQualityEventTypes.LocalStatsUpdated
    ),
    tap(event => this.handleEvents(event))
  );

  private stateInner$ = new Subject<CallQualityStateActions>();
  state$ = this.stateInner$.pipe(
    scanState(callQualityReducer, callQualityInitialState)
  );

  constructor(private jitsiService: JitsiMeetService) {}

  init() {
    return merge(this.events$, this.state$);
  }

  private handleEvents(event: JitsiCallQualityEvents) {
    console.log(event);

    switch (event.type) {
      case JitsiCallQualityEventTypes.LocalStatsUpdated:
        this.stateInner$.next(new LocalStatsUpdated(event.payload));
        break;
      case JitsiCallQualityEventTypes.RemoteStatsUpdated:
        this.stateInner$.next(
          new RemoteStatsUpdated({
            userId: event.payload[0],
            stats: event.payload[1]
          })
        );
        break;
    }
  }
}
