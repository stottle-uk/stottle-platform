import React from 'react';
import { useJitsiConference } from '../../hooks/useJitsiConference';
import Lobby from '../lobby/Lobby';
import ConferenceLayout from './ConferenceLayout';

const Conference: React.FC = () => {
  const { isJoined, joinConference } = useJitsiConference();

  // useEffect(() => () => leaveConference(), []);

  const join = (username: string, password?: string) =>
    joinConference(username, password);

  return isJoined ? (
    <ConferenceLayout />
  ) : (
    <Lobby style={{ maxWidth: '650px' }} joinConference={join} />
  );
};

export default Conference;
