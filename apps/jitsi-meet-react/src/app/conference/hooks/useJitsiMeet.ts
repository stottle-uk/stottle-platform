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
import $ from 'jquery';
import { createContext, useContext } from 'react';

window.$ = $;
const { JitsiMeetJS } = window;
JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
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

connectionStateService.init();
conferenceStateService.init();
usersStateService.init();
devicesStateService.init();
tracksStateService.init();
jitsiStatsStateService.init();
jitsiPasswordStateService.init();
jitsiCallQualityStateService.init();

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
export const useJitsiConnectionState = () => useContext(ConnectionStateContext);
export const useJitsiConferenceState = () => useContext(ConferenceStateContext);
export const useJitsiUsersState = () => useContext(UsersStateContext);
export const useJitsiDevicesState = () => useContext(DevicesStateContext);
export const useJitsiTracksState = () => useContext(TracksStateContext);
export const useJitsiChatState = () => useContext(ChatStateService);
export const useJitsiStatsState = () => useContext(StatsStateContext);
export const useJitsiPasswordState = () => useContext(PasswordStateContext);
export const useJitsiCallQualityState = () => useContext(CallQualityContext);
