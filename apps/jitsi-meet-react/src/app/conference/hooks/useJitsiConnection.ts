import {
  connectionInitialState,
  JitsiConferenceOptions,
  JitsiConnectionOptions
} from '@stottle-platform/lib-jitsi-meet';
import { useObservableState } from 'observable-hooks';
import { useJitsiConnectionState } from './useJitsiMeet';

export interface JitsiProps {
  sessionId: string;
  connectionOptions: JitsiConnectionOptions;
  conferenceOptions: JitsiConferenceOptions;
  jwtToken?: string | null;
}

export const useJitsiConnection = ({
  sessionId,
  connectionOptions,
  conferenceOptions,
  jwtToken = null
}: JitsiProps) => {
  const connection = useJitsiConnectionState();
  const connectionState = useObservableState(
    connection.state$,
    connectionInitialState
  );

  const connect = () =>
    connection.connect(
      sessionId,
      jwtToken,
      connectionOptions,
      conferenceOptions
    );

  return {
    ...connectionState,
    connect,
    disconnect: () => connection.disconnect()
  };
};
