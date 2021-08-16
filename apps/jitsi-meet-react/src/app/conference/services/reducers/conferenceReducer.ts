import {
  ConferenceStateActions,
  ConferenceStateActionTypes
} from './conferenceActions';

export interface ConferenceState {
  created: number; // timestamp
  isJoined: boolean;
  hasLeftRoom: boolean;
  wasKicked: boolean;
  role: string;
  myUserId: string;
  roomname: string;
  isHidden: boolean;
  authEnabled: boolean;
  authIdentity: string;
}

export const conferenceInitialState: ConferenceState = {
  created: 0,
  isJoined: false,
  hasLeftRoom: false,
  wasKicked: false,
  role: 'unknown',
  myUserId: 'unknown',
  roomname: 'unknown',
  isHidden: false,
  authEnabled: false,
  authIdentity: 'unknown'
};

export const conferenceReducer = (
  state = conferenceInitialState,
  action: ConferenceStateActions
): ConferenceState => {
  switch (action.type) {
    case ConferenceStateActionTypes.SetCreatedTimestamp:
      return { ...state, created: action.payload };

    case ConferenceStateActionTypes.SetJoined:
      return { ...state, ...action.payload, isJoined: true };

    case ConferenceStateActionTypes.SetLeft:
      return { ...conferenceInitialState, hasLeftRoom: true };

    case ConferenceStateActionTypes.SetKicked:
      return { ...conferenceInitialState, hasLeftRoom: true, wasKicked: true };

    case ConferenceStateActionTypes.AuthStatusChanged:
      return { ...conferenceInitialState, ...action.payload };

    default:
      return state;
  }
};
