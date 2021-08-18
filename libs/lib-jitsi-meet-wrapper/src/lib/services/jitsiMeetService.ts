import {
  from,
  fromEvent,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject,
  throwError
} from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Action } from '../models/events/action';
import { JitsiCallQualityEvents } from '../models/events/callQuality';
import {
  ConferenceJoined,
  JitsiConferenceEvents,
  JitsiConferenceEventTypes
} from '../models/events/conference';
import {
  JitsiConference,
  JitsiConferenceOptions
} from '../models/JitsiConference';
import {
  JitsiConnection,
  JitsiConnectionOptions
} from '../models/JitsiConnection';
import { JitsiMeetJS } from '../models/JitsiMeetJS';
import { CreateTracksOptions, JitsiTrack } from '../models/JitsiTrack';
import {
  JitsiCommandValues,
  JitsiEventEmitter,
  TrackType
} from '../models/utils';

const defaultTracksOptions = {
  devices: ['audio', 'video'],
  constraints: {
    video: {
      height: {
        ideal: 720,
        max: 720,
        min: 240
      }
    }
  }
};

export class JitsiMeetService {
  private destroy$ = new Subject();
  private connInner$ = new ReplaySubject<JitsiConnection>(1);
  private confInner$ = new ReplaySubject<JitsiConference>(1);

  constructor(private jitsiMeet: JitsiMeetJS) {}

  connectionEvents$ = this.connInner$.pipe(
    mergeMap(conn =>
      merge(
        ...Object.values({
          ...this.jitsiMeet.events.connection,
          ...this.jitsiMeet.errors.connection
        }).map(e => this.createListener(conn, e))
      )
    ),
    // tap(d => console.log('connectionEvents', d)),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  conferenceEvents$ = this.confInner$.pipe(
    mergeMap(conf =>
      merge(
        ...Object.values({
          ...this.jitsiMeet.events.conference,
          ...this.jitsiMeet.errors.conference
        })
          .filter(e => e !== 'conference.endpoint_message_received')
          .map(e => this.createListener(conf, e))
      ).pipe(map(e => this.mapJoinedEvent(conf, e)))
    ),
    // tap(d => console.log('conferenceEvents', d)),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  connectionQualityEvents$ = this.confInner$.pipe(
    mergeMap(conf =>
      merge<JitsiCallQualityEvents[]>(
        ...Object.values({
          ...this.jitsiMeet.events.connectionQuality
        }).map(e => this.createListener(conf, e))
      )
    ),
    // tap(d => console.log('connectionQualityEvents', d)),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  mediaDevicesEvents$ = merge(
    ...Object.values({
      ...this.jitsiMeet.events.mediaDevices
    }).map(e => this.createListener(this.jitsiMeet.mediaDevices, e))
  ).pipe(shareReplay(1), takeUntil(this.destroy$));

  devices$ = new Observable<MediaDeviceInfo[]>(observer =>
    this.jitsiMeet.mediaDevices.enumerateDevices(info => {
      observer.next(info);
      observer.complete();
    })
  );

  connect(
    appId: string | null,
    token: string | null,
    connOptions: JitsiConnectionOptions
  ) {
    const conn = new this.jitsiMeet.JitsiConnection(appId, token, connOptions);
    conn.connect();
    this.connInner$.next(conn);
  }

  disconnect() {
    return this.connInner$.pipe(
      take(1),
      tap(conn => conn.disconnect())
    );
  }

  initConference(roomname: string, confOptions: JitsiConferenceOptions) {
    return this.connInner$.pipe(
      take(1),
      map(conn => conn.initJitsiConference(roomname, confOptions)),
      tap(conf => this.confInner$.next(conf))
    );
  }

  dispose() {
    this.destroy$.next(undefined);
  }

  joinConference(username: string, password?: string) {
    return this.confInner$.pipe(
      take(1),
      tap(conf => conf.setDisplayName(username)),
      tap(conf => conf.join(password))
    );
  }

  leaveConference() {
    return this.confInner$.pipe(
      take(1),
      switchMap(conf => conf.leave())
    );
  }

  addTrack(track: JitsiTrack) {
    return this.confInner$.pipe(
      take(1),
      switchMap(conf => conf.addTrack(track))
    );
  }

  createLocalTracks(options: CreateTracksOptions = defaultTracksOptions) {
    return from(this.jitsiMeet.createLocalTracks(options)).pipe(
      switchMap(tracks => tracks)
    );
  }

  replaceTrack(oldTrack: JitsiTrack, options: CreateTracksOptions) {
    return this.confInner$.pipe(
      take(1),
      switchMap(conf =>
        from(this.jitsiMeet.createLocalTracks(options)).pipe(
          switchMap(newTracks => newTracks),
          tap(newTrack => conf.replaceTrack(oldTrack, newTrack)),
          catchError(err =>
            err.name === 'gum.screensharing_user_canceled'
              ? of(oldTrack)
              : throwError(() => new Error(err.name))
          )
        )
      )
    );
  }

  getAudioOutputDevice() {
    return this.jitsiMeet.mediaDevices.getAudioOutputDevice();
  }

  setAudioOutputDevice(deviceId: string) {
    return this.jitsiMeet.mediaDevices.setAudioOutputDevice(deviceId);
  }

  getParticipants() {
    return this.confInner$.pipe(
      take(1),
      switchMap(conf => conf.getParticipants())
    );
  }

  getRemoteTracks() {
    return this.getParticipants().pipe(switchMap(p => p.getTracks()));
  }

  lockRoom(password: string) {
    return this.confInner$.pipe(
      take(1),
      switchMap(conf => conf.lock(password))
    );
  }

  kickParticipant(userId: string, reason = 'userKicked') {
    return this.confInner$.pipe(
      take(1),
      tap(conf => conf.kickParticipant(userId, reason))
    );
  }

  muteParticipant(userId: string, mediaType: TrackType) {
    return this.confInner$.pipe(
      take(1),
      tap(conf => conf.muteParticipant(userId, mediaType))
    );
  }

  sendCommandOnce(name: string, values: JitsiCommandValues) {
    return this.confInner$.pipe(
      take(1),
      tap(conf => conf.sendCommandOnce(name, values))
    );
  }

  addCommandListener(commandType: string) {
    return this.confInner$.pipe(
      take(1),
      switchMap(
        conf =>
          new Observable<JitsiCommandValues>(observer => {
            conf.addCommandListener(commandType, values =>
              observer.next(values)
            );
            return () => conf.removeCommandListener(commandType);
          })
      )
    );
  }

  private mapJoinedEvent(
    conf: JitsiConference,
    e: JitsiConferenceEvents
  ): JitsiConferenceEvents {
    return e.type === JitsiConferenceEventTypes.Joined
      ? new ConferenceJoined({
          role: conf.getRole(),
          myUserId: conf.myUserId(),
          isHidden: conf.isHidden(),
          roomname: conf.getName()
        })
      : e;
  }

  private createListener<T extends Action>(
    target: JitsiEventEmitter<T>,
    type: string
  ) {
    return fromEvent<T>(target, type).pipe(
      map(
        payload =>
          ({
            type,
            payload
          } as T)
      )
    );
  }
}
