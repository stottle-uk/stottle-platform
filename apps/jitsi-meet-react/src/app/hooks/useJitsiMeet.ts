import {
  JitsiCallQualityStateService,
  JitsiChatStateService,
  JitsiConferenceStateService,
  JitsiConnectionStateService,
  JitsiDevicesStateService,
  JitsiMeetService,
  JitsiPasswordStateService,
  JitsiStatsStateService,
  JitsiTracksStateService,
  JitsiUsersStateService
} from '@stottle-platform/lib-jitsi-meet';
import { createContext, useContext, useEffect } from 'react';
import { merge } from 'rxjs';

const config = {
  disableSimulcast: true,
  desktopSharingChromeMethod: 'webrtc',
  constraints: {
    video: {
      height: {
        ideal: 720,
        max: 720,
        min: 180
      },
      width: {
        ideal: 1280,
        max: 1280,
        min: 320
      }
    }
  },
  enableInsecureRoomNameWarning: true,
  enableP2P: false, // flag to control P2P connections
  // New P2P options
  p2p: {
    enabled: false,
    enableUnifiedOnChrome: true,
    preferredCodec: 'VP9',
    disableH264: true,
    useStunTurn: true // use XEP-0215 to fetch STUN and TURN servers for the P2P connection
  },
  useStunTurn: true, // use XEP-0215 to fetch TURN servers for the JVB connection
  useTurnUdp: false,
  enableLipSync: false,
  enableSaveLogs: false,
  disableRtx: false, // Enables RTX everywhere
  channelLastN: 25, // The default value of the channel attribute last-n.
  videoQuality: {
    preferredCodec: 'VP9',
    maxBitratesVideo: {
      VP8: {
        low: 200000,
        standard: 500000,
        high: 1500000
      },
      VP9: {
        low: 100000,
        standard: 300000,
        high: 1200000
      }
    }
  },
  useNewBandwidthAllocationStrategy: true,
  startBitrate: '800',
  disableAudioLevels: false,
  stereo: false,
  forceJVB121Ratio: -1,
  enableTalkWhileMuted: true,
  mouseMoveCallbackInterval: 1000,
  enableNoAudioDetection: true,
  enableNoisyMicDetection: true,
  enableClosePage: true,
  disableLocalVideoFlip: false,
  transcribingEnabled: false,
  liveStreamingEnabled: true,
  fileRecordingsEnabled: true,
  fileRecordingsServiceEnabled: false,
  fileRecordingsServiceSharingEnabled: false,
  requireDisplayName: false,
  enableWelcomePage: true,
  isBrand: false,
  startAudioMuted: 25,
  startVideoMuted: 25,
  enableUserRolesBasedOnToken: false,
  enableLayerSuspension: true,
  enableUnifiedOnChrome: true,
  enableForcedReload: true,
  feedbackPercentage: 0,
  prejoinPageEnabled: true,
  disableSpeakerStatsSearch: true,
  e2eping: {
    pingInterval: -1
  }
};

const { JitsiMeetJS } = window;
JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
JitsiMeetJS.init(config);

const jitsiMeetService = new JitsiMeetService(JitsiMeetJS);
const connectionStateService = new JitsiConnectionStateService(
  jitsiMeetService
);
const conferenceStateService = new JitsiConferenceStateService(
  jitsiMeetService
);
const usersStateService = new JitsiUsersStateService(jitsiMeetService);
const devicesStateService = new JitsiDevicesStateService(jitsiMeetService);
const tracksStateService = new JitsiTracksStateService(jitsiMeetService);
const chatStateService = new JitsiChatStateService(jitsiMeetService);
const jitsiStatsStateService = new JitsiStatsStateService(jitsiMeetService);
const jitsiPasswordStateService = new JitsiPasswordStateService(
  jitsiMeetService
);
const jitsiCallQualityStateService = new JitsiCallQualityStateService(
  jitsiMeetService
);

const JitsiContext = createContext(jitsiMeetService);
const ConnectionStateContext = createContext(connectionStateService);
const ConferenceStateContext = createContext(conferenceStateService);
const UsersStateContext = createContext(usersStateService);
const DevicesStateContext = createContext(devicesStateService);
const TracksStateContext = createContext(tracksStateService);
const ChatStateService = createContext(chatStateService);
const StatsStateContext = createContext(jitsiStatsStateService);
const PasswordStateContext = createContext(jitsiPasswordStateService);
const CallQualityContext = createContext(jitsiCallQualityStateService);

export const useJitsiMeet = () => useContext(JitsiContext);
export const useJitsiConferenceState = () => useContext(ConferenceStateContext);
export const useJitsiUsersState = () => useContext(UsersStateContext);
export const useJitsiDevicesState = () => useContext(DevicesStateContext);
export const useJitsiTracksState = () => useContext(TracksStateContext);
export const useJitsiChatState = () => useContext(ChatStateService);
export const useJitsiStatsState = () => useContext(StatsStateContext);
export const useJitsiPasswordState = () => useContext(PasswordStateContext);
export const useJitsiCallQualityState = () => useContext(CallQualityContext);

export const useJitsiConnectionState = () => {
  const jitsi = useJitsiMeet();
  const conn = useContext(ConnectionStateContext);
  const conf = useJitsiConferenceState();
  const users = useJitsiUsersState();
  const devices = useJitsiDevicesState();
  const tracks = useJitsiTracksState();
  const stats = useJitsiStatsState();
  const password = useJitsiPasswordState();
  const quality = useJitsiCallQualityState();

  useEffect(() => {
    const subs = merge(
      conn.init(),
      conf.init(),
      users.init(),
      devices.init(),
      tracks.init(),
      stats.init(),
      password.init(),
      quality.init()
    ).subscribe();

    return () => {
      subs.unsubscribe();
      jitsi.dispose();
    };
  }, [conn, conf, users, devices, tracks, stats, password, quality, jitsi]);

  return conn;
};
