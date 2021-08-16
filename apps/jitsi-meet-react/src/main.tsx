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
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
