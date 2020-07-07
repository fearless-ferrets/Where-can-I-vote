import {
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERROR,
} from '../constants/actionTypes';

const initialState = {
  loggedIn: false,
  preferredAddress: null,
  errorMessage: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };
    case SIGNUP_FAIL:
    case LOGIN_FAIL:
      return { ...state, errorMessage: payload };
    case LOGOUT:
      return { ...state, loggedIn: false };
    case CLEAR_ERROR:
      return { ...state, errorMessage: null };
    default:
      return state;
  }
}
