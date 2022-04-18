import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faCheckSquare,
  faCog,
  faDesktop,
  faMicrophone,
  faMicrophoneSlash,
  faPhoneSlash,
  faUser,
  faVideo,
  faVideoSlash,
  faVolumeMute
} from '@fortawesome/free-solid-svg-icons';
import { JITSI_MEET_SERVICE } from '@stottle-platform/lib-jitsi-meet';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { container } from 'tsyringe';
import App from './app/App';

library.add(
  faCheckSquare,
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
  faPhoneSlash,
  faVolumeMute,
  faDesktop,
  faCog,
  faUser,
  faBars
);

const rootEl = document.getElementById('root');

container.register(JITSI_MEET_SERVICE, {
  useValue: window.JitsiMeetJS
});

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
