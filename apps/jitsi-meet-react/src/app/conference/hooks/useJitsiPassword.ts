import { passwordInitialState } from '@stottle-platform/lib-jitsi-meet';
import { useObservableState } from 'observable-hooks';
import { useJitsiPasswordState } from './useJitsiMeet';

export const useJitsiPassword = () => {
  const passwords = useJitsiPasswordState();
  const passwordState = useObservableState(
    passwords.state$,
    passwordInitialState
  );

  const lockRoom = (password: string) => passwords.lockRoom(password);

  return { ...passwordState, lockRoom };
};
