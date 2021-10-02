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

const { JitsiMeetJS } = window;
JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.INFO);
JitsiMeetJS.init();

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
