/* eslint-disable @typescript-eslint/ban-types */
import { JitsiEventEmitter, TrackType } from './utils';

export interface CreateTracksOptions {
  devices?: string[];
  resolution?: unknown;
  constraints?: unknown;
  cameraDeviceId?: string;
  micDeviceId?: string;
  minFps?: number;
  maxFps?: number;
  facingMode?: 'user' | 'environment';
  firePermissionPromptIsShownEvent?: boolean;
  fireSlowPromiseEvent?: boolean;
  desktopSharingSourceDevice?: string;
  desktopSharingFrameRate?: {
    min: number;
    max: number;
  };
}

export interface JitsiTrack extends JitsiEventEmitter<JitsiTrack> {
  type: TrackType;
  addFeature: Function;
  removeFeature: Function;
  videoType: null | 'camera' | 'desktop';
  isLocal(): boolean;
  getType(): this['type'];
  mute(): Promise<void>;
  unmute(): Promise<void>;
  isMuted(): boolean;
  attach(container: HTMLElement): void;
  dettach(container: unknown): void;
  dispose(): Promise<unknown>;
  getId(): string;
  getParticipantId(): string;
  setAudioOutput(audioOutputDeviceId: string): void;
  getDeviceId(): string;
  isEnded(): boolean;
  setEffect(effect?: JitsiTrackEffect): Promise<void>;
  isAudioTrack(): boolean;
  getOriginalStream(): MediaStream;
}

export interface JitsiTrackEffect {
  startEffect(stream: MediaStream): MediaStream;
  stopEffect(): void;
  isEnabled(track: JitsiTrack): boolean;
}
