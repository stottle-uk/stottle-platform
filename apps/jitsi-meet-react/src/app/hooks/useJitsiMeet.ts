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
import { useEffect } from 'react';
import { merge } from 'rxjs';
import { container, InjectionToken } from 'tsyringe';

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

const useResolve = <T>(token: InjectionToken<T>) => container.resolve(token);

const { JitsiMeetJS } = window;
JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
JitsiMeetJS.init(config);

export const useJitsiMeet = () => useResolve(JitsiMeetService);
export const useJitsiConnection = () => useResolve(JitsiConnectionStateService);
export const useJitsiConferenceState = () =>
  useResolve(JitsiConferenceStateService);
export const useJitsiUsersState = () => useResolve(JitsiUsersStateService);
export const useJitsiDevicesState = () => useResolve(JitsiDevicesStateService);
export const useJitsiTracksState = () => useResolve(JitsiTracksStateService);
export const useJitsiChatState = () => useResolve(JitsiChatStateService);
export const useJitsiStatsState = () => useResolve(JitsiStatsStateService);
export const useJitsiPasswordState = () =>
  useResolve(JitsiPasswordStateService);
export const useJitsiCallQualityState = () =>
  useResolve(JitsiCallQualityStateService);

export const useJitsiConnectionState = () => {
  const jitsi = useJitsiMeet();
  const conn = useJitsiConnection();
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
