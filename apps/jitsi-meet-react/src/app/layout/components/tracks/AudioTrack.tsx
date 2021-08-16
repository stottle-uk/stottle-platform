import {
  JitsiTrack,
  TRACK_MUTE_CHANGED
} from '@stottle-platform/lib-jitsi-meet';
import React, { memo, useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';

interface OwnProps {
  track: JitsiTrack;
  dispose?: boolean;
  onMuteChange: (muted: JitsiTrack) => void;
}

const AudioTrack: React.FC<OwnProps> = ({ track, dispose, onMuteChange }) => {
  const audioEl = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioEl.current) return;

    if (track.isLocal()) {
      audioEl.current.muted = true;
    }

    track.attach(audioEl.current);

    return () => {
      track.isLocal() && dispose && track.dispose();
    };
  }, [audioEl, track, dispose]);

  useEffect(() => {
    const sub = fromEvent<JitsiTrack>(track, TRACK_MUTE_CHANGED).subscribe(t =>
      onMuteChange(t)
    );

    return () => {
      sub.unsubscribe();
    };
  }, [track, onMuteChange]);

  return <audio autoPlay={true} ref={audioEl} />;
};

export default memo(AudioTrack);
