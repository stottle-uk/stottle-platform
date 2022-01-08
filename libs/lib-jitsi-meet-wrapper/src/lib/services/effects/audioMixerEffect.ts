import { JitsiAudioMixer } from '../../models/JitsiMeetJS';
import { JitsiTrack, JitsiTrackEffect } from '../../models/JitsiTrack';

export class AudioMixerEffect implements JitsiTrackEffect {
  private mixedMediaStream?: MediaStream = undefined;
  private mixedMediaTrack?: MediaStreamTrack = undefined;
  private originalStream?: MediaStream = undefined;
  private originalTrack?: MediaStreamTrack = undefined;
  private audioMixer?: JitsiAudioMixer = undefined;

  constructor(private mixAudio: JitsiTrack) {
    console.log(mixAudio);

    if (mixAudio.getType() !== 'audio') {
      throw new Error(
        'AudioMixerEffect only supports audio JitsiLocalTracks; effect will not work!'
      );
    }
  }

  isEnabled(sourceLocalTrack: JitsiTrack) {
    return sourceLocalTrack.isAudioTrack() && this.mixAudio.isAudioTrack();
  }

  startEffect(audioStream: MediaStream) {
    this.originalStream = audioStream;
    this.originalTrack = audioStream.getTracks()[0];

    this.audioMixer = window.JitsiMeetJS.createAudioMixer();
    this.audioMixer.addMediaStream(this.mixAudio.getOriginalStream());
    this.audioMixer.addMediaStream(this.originalStream);

    this.mixedMediaStream = this.audioMixer.start();
    this.mixedMediaTrack = this.mixedMediaStream.getTracks()[0];

    return this.mixedMediaStream;
  }

  stopEffect() {
    if (this.audioMixer) {
      this.audioMixer.reset();
    }
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
