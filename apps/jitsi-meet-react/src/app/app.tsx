import React, { useEffect } from 'react';
import { useJitsiConnection } from './conference/hooks/useJitsiConnection';
import { JITSI_SERVICE_URL } from './environment/environment';
import ConferenceContainer from './layout/components/conference/ConferenceContainer';

const connectionOptions = {
  hosts: {
    domain: JITSI_SERVICE_URL,
    muc: 'conference.meet.jit.si',
  },
  serviceUrl: `https://${JITSI_SERVICE_URL}/http-bind`,
  clientNode: 'http://jitsi.org/jitsimeet',
};

const conferenceOptions = {
  enableLayerSuspension: true,
  p2p: {
    enabled: false,
  },
};

const App: React.FC = () => {
  const { isConnected, isConnecting, connect, disconnect } = useJitsiConnection(
    {
      sessionId: `myTestRoomNameStuart1234`.toLowerCase(),
      connectionOptions,
      conferenceOptions,
      // jwtToken: session.jitsi_jwt,
    }
  );

  useEffect(() => () => disconnect(), [disconnect]);

  return (
    <ConferenceContainer
      isConnected={isConnected}
      isConnecting={isConnecting}
      connect={connect}
    />
  );
};

export default App;
