import { Action } from '../../models/events/action';
import { JitsiTrack } from '../../models/JitsiTrack';

export enum TracksStateActionTypes {
  AddTrack = 'AddTrack',
  RemoveTrack = 'RemoveTrack',
  RemoveAllTracks = 'RemoveAllTracks'
}

export class AddTrack implements Action {
  readonly type = TracksStateActionTypes.AddTrack;
  constructor(public payload: JitsiTrack) {}
}

export class RemoveTrack implements Action {
  readonly type = TracksStateActionTypes.RemoveTrack;
  constructor(public payload: JitsiTrack) {}
}

export class RemoveAllTracks implements Action {
  readonly type = TracksStateActionTypes.RemoveAllTracks;
  constructor(public payload = null) {}
}

export type TracksStateActions = AddTrack | RemoveTrack | RemoveAllTracks;
