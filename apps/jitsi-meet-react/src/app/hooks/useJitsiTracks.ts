import {
  JitsiTrack,
  tracksInitialState
} from '@stottle-platform/lib-jitsi-meet';
import { useObservableState } from 'observable-hooks';
import { useJitsiConference } from './useJitsiConference';
import { useJitsiTracksState } from './useJitsiMeet';
import { useJitsiUsers } from './useJitsiUsers';

export interface UserTrack {
  userId: string;
  username: string;
  role: string;
  isLocal: boolean;
  tracks: {
    audio?: JitsiTrack;
    video?: JitsiTrack;
  };
}

export const useJitsiTracks = (username: string) => {
  const tracks = useJitsiTracksState();
  const tracksState = useObservableState(tracks.state$, tracksInitialState);
  const { myUserId, role } = useJitsiConference();
  const { userIds, users } = useJitsiUsers();

  const reduceTracks = (tracks: JitsiTrack[]) =>
    tracks.reduce<UserTrack['tracks']>(
      (prev, curr) => ({ ...prev, [curr.getType()]: curr }),
      {}
    );

  const allTracks = userIds.reduce<UserTrack[]>(
    (tracks, userId) => [
      ...tracks,
      {
        userId: userId,
        username: users[userId].getDisplayName(),
        role: users[userId].getRole(),
        isLocal: false,
        tracks: reduceTracks(users[userId].getTracks())
      }
    ],
    [
      {
        userId: myUserId,
        username,
        role: role,
        isLocal: true,
        tracks: reduceTracks(tracksState.localTracks)
      }
    ]
  );

  return {
    localTracks: reduceTracks(tracksState.localTracks),
    allTracks,
    participantsLength: Object.keys(allTracks).length,
    shareAudio: () => tracks.shareAudio()
  };
};
