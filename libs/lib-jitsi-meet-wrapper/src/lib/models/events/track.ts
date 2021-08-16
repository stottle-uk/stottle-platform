import { Action } from './action';

export enum JitsiTrackEventTypes {
  trackAudioOuputChanged = 'track.audioOutputChanged'
}

export class TrackAudioOutputChanged implements Action {
  readonly type = JitsiTrackEventTypes.trackAudioOuputChanged;
  constructor(public payload: string) {} // new device id
}

export type JitsiTrackEvents = TrackAudioOutputChanged;
