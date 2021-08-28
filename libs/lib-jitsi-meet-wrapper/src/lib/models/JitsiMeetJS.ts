/* eslint-disable @typescript-eslint/ban-types */
import * as jQuery from 'jquery';
import { JitsiConference } from './JitsiConference';
import { JitsiConnectionCtr } from './JitsiConnection';
import { JitsiMediaDevices } from './JitsiMediaDevices';
import { CreateTracksOptions, JitsiTrack } from './JitsiTrack';
import { LogLevels } from './utils';

declare global {
  interface Window {
    $: typeof jQuery;
    JitsiMeetJS: JitsiMeetJS;
  }
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }
}

window.$ = jQuery;

export type JitsiInitOptions = {
  useIPv6?: boolean;
  disableAudioLevels?: boolean;
  disableSimulcast?: boolean;
  enableWindowOnErrorHandler?: boolean;
  disableThirdPartyRequests?: boolean;
  enableAnalyticsLogging?: boolean;
  externalStorage?: typeof window.localStorage;
  callStatsCustomScriptUrl?: string;
  disableRtx?: boolean;
  disabledCodec?: string;
  preferredCodec?: string;
};

export interface JitsiMeetJS {
  version: string;
  conference: JitsiConference;
  JitsiConnection: JitsiConnectionCtr;
  ProxyConnectionService: unknown;
  constants: {
    participantConnectionStatus: unknown;
    recording: unknown;
    sipVideoGW: unknown;
    transcriptionStatus: unknown;
  };
  events: {
    conference: Record<string, string>;
    connection: Record<string, string>;
    detection: Record<string, string>;
    track: Record<string, string>;
    mediaDevices: Record<string, string>;
    connectionQuality: Record<string, string>;
    e2eping: Record<string, string>;
  };
  errors: {
    conference: Record<string, string>;
    connection: Record<string, string>;
    track: Record<string, string>;
  };
  errorTypes: {
    JitsiTrackError: unknown;
  };
  logLevels: LogLevels;
  mediaDevices: JitsiMediaDevices;
  analytics: unknown;
  init: (options?: JitsiInitOptions) => void;
  isDesktopSharingEnabled: () => boolean;
  isWebRtcSupported: () => boolean;
  setLogLevel: (level: string) => void;
  setLogLevelById: (level: unknown, id: unknown) => void;
  addGlobalLogTransport: (globalTransport: unknown) => void;
  removeGlobalLogTransport: (globalTransport: unknown) => void;
  setGlobalLogOptions: (options: unknown) => void;
  createLocalTracks: (options?: CreateTracksOptions) => Promise<JitsiTrack[]>;
  createTrackVADEmitter: (
    localAudioDeviceId: unknown,
    sampleRate: unknown,
    vadProcessor: unknown
  ) => unknown;
  createAudioMixer: () => unknown;
  getActiveAudioDevice: () => Promise<{
    deviceId: string;
    deviceLabel: string;
  }>;
  isDeviceListAvailable: () => Promise<boolean>;
  isDeviceChangeAvailable: (deviceType: string) => boolean;
  isMultipleAudioInputSupported: () => boolean;
  isCollectingLocalStats: () => boolean;
  enumerateDevices: (callback: Function) => void;
  getGlobalOnErrorHandler: (
    message: unknown,
    source: unknown,
    lineno: unknown,
    colno: unknown,
    error: unknown
  ) => unknown;
  setNetworkInfo: (isOnline: boolean) => void;
  setVideoTrackContentHints: (track: unknown, hint: string) => void;
  precallTest: unknown;
  util: {
    AuthUtil: unknown;
    ScriptUtil: unknown;
    browser: unknown;
  };
}
