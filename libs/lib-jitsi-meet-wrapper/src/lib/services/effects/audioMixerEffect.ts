import { JitsiAudioMixer } from '../../models/JitsiMeetJS';
import { JitsiTrack, JitsiTrackEffect } from '../../models/JitsiTrack';

export class AudioMixerEffect implements JitsiTrackEffect {
  private originalTrack?: MediaStreamTrack = undefined;

  constructor(
    private mixAudio: JitsiTrack,
    private audioMixer: JitsiAudioMixer
  ) {}

  isEnabled(sourceLocalTrack: JitsiTrack) {
    return sourceLocalTrack.isAudioTrack() && this.mixAudio.isAudioTrack();
  }

  startEffect(audioStream: MediaStream) {
    this.originalTrack = audioStream.getTracks().find(Boolean);

    this.audioMixer.addMediaStream(this.mixAudio.getOriginalStream());
    this.audioMixer.addMediaStream(audioStream);

    return this.audioMixer.start();
  }

  stopEffect() {
    this.audioMixer.reset();
  }

  setMuted(muted: boolean) {
    if (this.originalTrack) {
      this.originalTrack.enabled = !muted;
    }
  }

  isMuted() {
    return this.originalTrack && !this.originalTrack.enabled;
  }
}
