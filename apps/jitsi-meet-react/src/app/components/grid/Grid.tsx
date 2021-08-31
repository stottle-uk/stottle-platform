import React, { useState } from 'react';
import { useJitsiTracks } from '../../hooks/useJitsiTracks';
import GridControls from './GridControls';
import GridFooter from './GridFooter';
import GridItem from './GridItem';

const Grid: React.FC = () => {
  const { allTracks, participantsLength } = useJitsiTracks('ME!');
  const [focusedUser, setFocusedUser] = useState<string>();

  const getItemStyle = (userId: string, i: number) =>
    focusedUser === userId ? 'boxFocused' : `box${i + 1}`;

  const getItemClass = (focusedUser: string | undefined, userId: string) =>
    `grid-item ${focusedUser && focusedUser !== userId ? 'hidden' : ''} ${
      focusedUser === userId ? 'vid-contain' : ''
    }`;

  const updateFocusedUser = (userId: string) =>
    setFocusedUser(id => (id === userId ? undefined : userId));

  const gridClass = `grid-container ${
    focusedUser ? 'grid-focused' : `grid-${participantsLength}`
  }`;

  return (
    <div className={gridClass}>
      {allTracks.map(
        (user, i) =>
          user.tracks.audio &&
          user.tracks.video && (
            <GridItem
              key={user.userId}
              className={getItemClass(focusedUser, user.userId)}
              style={{
                gridArea: getItemStyle(user.userId, i)
              }}
              username={user.username}
              audio={user.tracks.audio}
              video={user.tracks.video}
              onDoubleClick={() => updateFocusedUser(user.userId)}
            >
              <GridFooter
                className="grid-footer"
                username={user.username}
                audio={user.tracks.audio}
                video={user.tracks.video}
                userId={user.userId}
              />
              {!user.isLocal && (
                <GridControls className="grid-controls" userId={user.userId} />
              )}
            </GridItem>
          )
      )}
    </div>
  );
};

export default Grid;
