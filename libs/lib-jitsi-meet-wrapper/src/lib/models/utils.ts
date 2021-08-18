export type LogLevels = {
  DEBUG: 'debug';
  ERROR: 'error';
  INFO: 'info';
  LOG: 'log';
  TRACE: 'trace';
  WARN: 'warn';
};

export type TrackType = 'audio' | 'video' | 'desktop';

export interface JitsiCommandValues {
  value: string;
  attributes: Record<string, string | number | boolean>;
  children?: JitsiCommandValues[];
}

export interface JitsiEventEmitter<E> {
  addEventListener(
    type: string,
    listener: (evt: E) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: (evt: E) => void,
    options?: EventListenerOptions | boolean
  ): void;
}

export const { TRACK_MUTE_CHANGED, LOCAL_TRACK_STOPPED } =
  window.JitsiMeetJS.events.track;
