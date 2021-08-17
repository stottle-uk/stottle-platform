import {
  chatInitialState,
  JitsiChatMessage
} from '@stottle-platform/lib-jitsi-meet';
import { useObservableState } from 'observable-hooks';
import { useJitsiChatState } from './useJitsiMeet';

export const useJitsiChat = () => {
  const chat = useJitsiChatState();
  const chatState = useObservableState(chat.listen(), chatInitialState);

  const sendChatMessage = (message: JitsiChatMessage) => chat.send(message);

  return {
    chatMessages: chatState.messages,
    sendChatMessage
  };
};
