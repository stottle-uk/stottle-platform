import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JitsiTrack } from '@stottle-platform/lib-jitsi-meet';
import React from 'react';
import { useMutedSate } from '../../../hooks/useMutedState';
import Speaking from './Speaking';

interface OwnProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string;
  username: string;
  video: JitsiTrack;
  audio: JitsiTrack;
}

const GridFooter: React.FC<OwnProps> = ({
  userId,
  username,
  video,
  audio,
  ...props
}) => {
  const isMuted = useMutedSate(audio, video);

  return (
    <div {...props}>
      <p>
        {username} <Speaking userId={userId} />
        {isMuted.audio && (
          <FontAwesomeIcon icon={'microphone-slash'} color="red" />
        )}
        {isMuted.video && <FontAwesomeIcon icon={'video-slash'} color="red" />}
      </p>
    </div>
  );
};

export default GridFooter;
