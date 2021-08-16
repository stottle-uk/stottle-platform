import { usersInitialState } from '@stottle-platform/lib-jitsi-meet';
import { useObservableState } from 'observable-hooks';
import { useJitsiUsersState } from './useJitsiMeet';

export const useJitsiUsers = () => {
  const users = useJitsiUsersState();
  const usersState = useObservableState(users.state$, usersInitialState);

  return {
    userIds: usersState.userIds,
    users: usersState.users
  };
};
