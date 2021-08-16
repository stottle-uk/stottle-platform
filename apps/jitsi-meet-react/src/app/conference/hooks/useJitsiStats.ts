import { statsInitialState } from '@stottle-platform/lib-jitsi-meet';
import { useObservableState } from 'observable-hooks';
import { useJitsiStatsState } from './useJitsiMeet';

export const useJitsiStats = () => {
  const jitsiStats = useJitsiStatsState();
  const statsState = useObservableState(jitsiStats.state$, statsInitialState);

  return statsState;
};
