import React from 'react';
import { useJitsiTracks } from '../../hooks/useJitsiTracks';
import GridControls from './GridControls';
import GridFooter from './GridFooter';
import GridItem from './GridItem';

const Grid: React.FC = () => {
  const { allTracks, participantsLength } = useJitsiTracks('ME!');

  return (
    <div className={`grid-container grid-${participantsLength}`}>
      {allTracks.map(
        (user, i) =>
          user.tracks.audio &&
          user.tracks.video && (
            <GridItem
              key={user.userId}
              className="grid-item"
              style={{
                gridArea: `box${i + 1}`
              }}
              username={user.username}
              audio={user.tracks.audio}
              video={user.tracks.video}
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
