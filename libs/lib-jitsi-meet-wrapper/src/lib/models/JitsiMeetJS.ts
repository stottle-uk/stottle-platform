import * as jQuery from 'jquery';
import { InjectionToken } from 'tsyringe';
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

export const JITSI_MEET_SERVICE: InjectionToken =
  Symbol.for('JITSI_MEET_SERVICE');

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

export interface Recording {
  error: {
    BUSY: 'busy';
    ERROR: 'error';
    RESOURCE_CONSTRAINT: 'resource-constraint';
    SERVICE_UNAVAILABLE: 'service-unavailable';
  };
  mode: {
    FILE: 'file';
    STREAM: 'stream';
  };
  status: {
    OFF: 'off';
    ON: 'on';
    PENDING: 'pending';
  };
}

export interface JitsiEvents {
  conference: {
    AUDIO_INPUT_STATE_CHANGE: 'conference.audio_input_state_changed';
    AUTH_STATUS_CHANGED: 'conference.auth_status_changed';
    BEFORE_STATISTICS_DISPOSED: 'conference.beforeStatisticsDisposed';
    CONFERENCE_ERROR: 'conference.error';
    CONFERENCE_FAILED: 'conference.failed';
    CONFERENCE_JOINED: 'conference.joined';
    CONFERENCE_LEFT: 'conference.left';
    CONFERENCE_UNIQUE_ID_SET: 'conference.unique_id_set';
    CONNECTION_ESTABLISHED: 'conference.connectionEstablished';
    CONNECTION_INTERRUPTED: 'conference.connectionInterrupted';
    CONNECTION_RESTORED: 'conference.connectionRestored';
    DATA_CHANNEL_OPENED: 'conference.dataChannelOpened';
    DISPLAY_NAME_CHANGED: 'conference.displayNameChanged';
    DOMINANT_SPEAKER_CHANGED: 'conference.dominantSpeaker';
    CONFERENCE_CREATED_TIMESTAMP: 'conference.createdTimestamp';
    DTMF_SUPPORT_CHANGED: 'conference.dtmfSupportChanged';
    ENDPOINT_MESSAGE_RECEIVED: 'conference.endpoint_message_received';
    ENDPOINT_STATS_RECEIVED: 'conference.endpoint_stats_received';
    JVB121_STATUS: 'conference.jvb121Status';
    KICKED: 'conference.kicked';
    PARTICIPANT_KICKED: 'conference.participant_kicked';
    LAST_N_ENDPOINTS_CHANGED: 'conference.lastNEndpointsChanged';
    LOCK_STATE_CHANGED: 'conference.lock_state_changed';
    SERVER_REGION_CHANGED: 'conference.server_region_changed';
    _MEDIA_SESSION_STARTED: 'conference.media_session.started';
    _MEDIA_SESSION_ACTIVE_CHANGED: 'conference.media_session.active_changed';
    MEMBERS_ONLY_CHANGED: 'conference.membersOnlyChanged';
    MESSAGE_RECEIVED: 'conference.messageReceived';
    NO_AUDIO_INPUT: 'conference.no_audio_input';
    NOISY_MIC: 'conference.noisy_mic';
    PRIVATE_MESSAGE_RECEIVED: 'conference.privateMessageReceived';
    PARTICIPANT_CONN_STATUS_CHANGED: 'conference.participant_conn_status_changed';
    PARTCIPANT_FEATURES_CHANGED: 'conference.partcipant_features_changed';
    PARTICIPANT_PROPERTY_CHANGED: 'conference.participant_property_changed';
    P2P_STATUS: 'conference.p2pStatus';
    PHONE_NUMBER_CHANGED: 'conference.phoneNumberChanged';
    PROPERTIES_CHANGED: 'conference.propertiesChanged';
    RECORDER_STATE_CHANGED: 'conference.recorderStateChanged';
    VIDEO_SIP_GW_AVAILABILITY_CHANGED: 'conference.videoSIPGWAvailabilityChanged';
    VIDEO_SIP_GW_SESSION_STATE_CHANGED: 'conference.videoSIPGWSessionStateChanged';
    START_MUTED_POLICY_CHANGED: 'conference.start_muted_policy_changed';
    STARTED_MUTED: 'conference.started_muted';
    SUBJECT_CHANGED: 'conference.subjectChanged';
    SUSPEND_DETECTED: 'conference.suspendDetected';
    TALK_WHILE_MUTED: 'conference.talk_while_muted';
    TRACK_ADDED: 'conference.trackAdded';
    TRACK_AUDIO_LEVEL_CHANGED: 'conference.audioLevelsChanged';
    TRACK_MUTE_CHANGED: 'conference.trackMuteChanged';
    TRACK_REMOVED: 'conference.trackRemoved';
    TRANSCRIPTION_STATUS_CHANGED: 'conference.transcriptionStatusChanged';
    USER_JOINED: 'conference.userJoined';
    USER_LEFT: 'conference.userLeft';
    USER_ROLE_CHANGED: 'conference.roleChanged';
    USER_STATUS_CHANGED: 'conference.statusChanged';
    BOT_TYPE_CHANGED: 'conference.bot_type_changed';
    LOBBY_USER_JOINED: 'conference.lobby.userJoined';
    LOBBY_USER_UPDATED: 'conference.lobby.userUpdated';
    LOBBY_USER_LEFT: 'conference.lobby.userLeft';
    AV_MODERATION_APPROVED: 'conference.av_moderation.approved';
    AV_MODERATION_CHANGED: 'conference.av_moderation.changed';
    AV_MODERATION_PARTICIPANT_APPROVED: 'conference.av_moderation.participant.approved';
  };
  connection: {
    CONNECTION_DISCONNECTED: 'connection.connectionDisconnected';
    CONNECTION_ESTABLISHED: 'connection.connectionEstablished';
    CONNECTION_FAILED: 'connection.connectionFailed';
    WRONG_STATE: 'connection.wrongState';
    DISPLAY_NAME_REQUIRED: 'connection.display_name_required';
  };
  detection: {
    DETECTOR_STATE_CHANGE: 'detector_state_change';
    AUDIO_INPUT_STATE_CHANGE: 'audio_input_state_changed';
    NO_AUDIO_INPUT: 'no_audio_input_detected';
    VAD_NOISY_DEVICE: 'detection.vad_noise_device';
    VAD_REPORT_PUBLISHED: 'vad-report-published';
    VAD_SCORE_PUBLISHED: 'detection.vad_score_published';
    VAD_TALK_WHILE_MUTED: 'detection.vad_talk_while_muted';
  };
  track: {
    LOCAL_TRACK_STOPPED: 'track.stopped';
    TRACK_AUDIO_LEVEL_CHANGED: 'track.audioLevelsChanged';
    TRACK_AUDIO_OUTPUT_CHANGED: 'track.audioOutputChanged';
    TRACK_MUTE_CHANGED: 'track.trackMuteChanged';
    TRACK_VIDEOTYPE_CHANGED: 'track.videoTypeChanged';
    NO_DATA_FROM_SOURCE: 'track.no_data_from_source';
    NO_AUDIO_INPUT: 'track.no_audio_input';
  };
  mediaDevices: {
    DEVICE_LIST_CHANGED: 'mediaDevices.devicechange';
    PERMISSIONS_CHANGED: 'rtc.permissions_changed';
    PERMISSION_PROMPT_IS_SHOWN: 'mediaDevices.permissionPromptIsShown';
    SLOW_GET_USER_MEDIA: 'mediaDevices.slowGetUserMedia';
  };
  connectionQuality: {
    LOCAL_STATS_UPDATED: 'cq.local_stats_updated';
    REMOTE_STATS_UPDATED: 'cq.remote_stats_updated';
  };
  e2eping: {
    E2E_RTT_CHANGED: 'e2eping.e2e_rtt_changed';
  };
}

export interface JitsiEventsErrors {
  conference: {
    AUTHENTICATION_REQUIRED: 'conference.authenticationRequired';
    CHAT_ERROR: 'conference.chatError';
    CONFERENCE_DESTROYED: 'conference.destroyed';
    CONFERENCE_MAX_USERS: 'conference.max_users';
    CONNECTION_ERROR: 'conference.connectionError';
    CONFERENCE_RESTARTED: 'conference.restarted';
    NOT_ALLOWED_ERROR: 'conference.connectionError.notAllowed';
    MEMBERS_ONLY_ERROR: 'conference.connectionError.membersOnly';
    CONFERENCE_ACCESS_DENIED: 'conference.connectionError.accessDenied';
    FOCUS_DISCONNECTED: 'conference.focusDisconnected';
    FOCUS_LEFT: 'conference.focusLeft';
    GRACEFUL_SHUTDOWN: 'conference.gracefulShutdown';
    ICE_FAILED: 'conference.iceFailed';
    INCOMPATIBLE_SERVER_VERSIONS: 'conference.incompatible_server_versions';
    OFFER_ANSWER_FAILED: 'conference.offerAnswerFailed';
    PASSWORD_NOT_SUPPORTED: 'conference.passwordNotSupported';
    PASSWORD_REQUIRED: 'conference.passwordRequired';
    RESERVATION_ERROR: 'conference.reservationError';
    VIDEOBRIDGE_NOT_AVAILABLE: 'conference.videobridgeNotAvailable';
  };
  connection: {
    CONNECTION_DROPPED_ERROR: 'connection.droppedError';
    OTHER_ERROR: 'connection.otherError';
    PASSWORD_REQUIRED: 'connection.passwordRequired';
    SERVER_ERROR: 'connection.serverError';
  };
  track: {
    CONSTRAINT_FAILED: 'gum.constraint_failed';
    ELECTRON_DESKTOP_PICKER_ERROR: 'gum.electron_desktop_picker_error';
    ELECTRON_DESKTOP_PICKER_NOT_FOUND: 'gum.electron_desktop_picker_not_found';
    GENERAL: 'gum.general';
    NOT_FOUND: 'gum.not_found';
    PERMISSION_DENIED: 'gum.permission_denied';
    SCREENSHARING_GENERIC_ERROR: 'gum.screensharing_generic_error';
    SCREENSHARING_USER_CANCELED: 'gum.screensharing_user_canceled';
    TIMEOUT: 'gum.timeout';
    TRACK_IS_DISPOSED: 'track.track_is_disposed';
    TRACK_NO_STREAM_FOUND: 'track.no_stream_found';
    UNSUPPORTED_RESOLUTION: 'gum.unsupported_resolution';
  };
}

export interface JitsiAudioMixer {
  addMediaStream(stream: MediaStream): void;
  start(): MediaStream;
  reset(): void;
}

export interface JitsiMeetJS {
  version: string;
  conference: JitsiConference;
  JitsiConnection: JitsiConnectionCtr;
  ProxyConnectionService: unknown;
  constants: {
    participantConnectionStatus: unknown;
    recording: Recording;
    sipVideoGW: unknown;
    transcriptionStatus: unknown;
  };
  events: JitsiEvents;
  errors: JitsiEventsErrors;
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
  createAudioMixer: () => JitsiAudioMixer;
  getActiveAudioDevice: () => Promise<{
    deviceId: string;
    deviceLabel: string;
  }>;
  isDeviceListAvailable: () => Promise<boolean>;
  isDeviceChangeAvailable: (deviceType: string) => boolean;
  isMultipleAudioInputSupported: () => boolean;
  isCollectingLocalStats: () => boolean;
  enumerateDevices: (callback: () => void) => void;
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
