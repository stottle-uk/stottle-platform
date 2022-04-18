import React, { useState } from 'react';
import { useJitsiActions } from '../../hooks/useJitsiActions';
import { useJitsiConference } from '../../hooks/useJitsiConference';
import { useJitsiPassword } from '../../hooks/useJitsiPassword';
import { useJitsiTracks } from '../../hooks/useJitsiTracks';
import Settings from '../settings/Settings';
import ToolbarInner from './ToolbarInner';

const Toolbar: React.FC = () => {
  const { muteParticipant } = useJitsiActions();
  // const { replaceDevice } = useJitsiDevices();
  const { leaveConference } = useJitsiConference();
  const { localTracks, allTracks, shareAudio } = useJitsiTracks('ME');
  const { lockRoom } = useJitsiPassword();

  const [settingsVisible, setSettingsVisible] = useState(false);

  const muteAll = () =>
    Object.keys(allTracks).forEach(userId => muteParticipant(userId, 'audio'));

  return localTracks.audio && localTracks.video ? (
    <>
      <ToolbarInner
        video={localTracks.video}
        audio={localTracks.audio}
        muteAll={muteAll}
        showSettings={() => setSettingsVisible(!settingsVisible)}
        leaveConference={leaveConference}
        replaceDevice={shareAudio}
      />
      <Settings
        isVisible={settingsVisible}
        subitPassword={p => lockRoom(p)}
        onClose={() => setSettingsVisible(!settingsVisible)}
      />
    </>
  ) : null;
};

export default Toolbar;
