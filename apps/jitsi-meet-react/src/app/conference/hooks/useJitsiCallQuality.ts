import { callQualityInitialState } from '@stottle-platform/lib-jitsi-meet';
import { useObservableState } from 'observable-hooks';
import { useJitsiCallQualityState } from './useJitsiMeet';

export const useJitsiCallQuality = () => {
  const callQuality = useJitsiCallQualityState();
  const conferenceState = useObservableState(
    callQuality.state$,
    callQualityInitialState
  );

  return conferenceState;
};
