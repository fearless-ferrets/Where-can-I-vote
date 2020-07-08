import axios from 'axios';
import {
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERROR,
} from '../constants/actionTypes';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const login = (username, password) => async (dispatch) => {
  // set up the body and stringify it
  const body = JSON.stringify({ username, password });
  let res;
  try {
    res = await axios.post('/api/login', body, config);
    console.log('res from /api/login ->', res.data);
    // if we get a JWT token...
    if (res.data.token) {
      // save it in local storage
      localStorage.setItem('token', res.data.token);
      return dispatch({ type: LOGIN_SUCCESS });
    }
    return dispatch({ type: LOGIN_FAIL, payload: res.data.message });
  } catch (error) {
    console.error(error);
    return dispatch({ type: LOGIN_FAIL, payload: error.response.data.error });
  }
};

export const signup = (username, password, email) => async (dispatch) => {
  // set up the body and stringify it
  const body = JSON.stringify({ username, password, email });
  let res;
  try {
    // store the result of a post request to /api/signup in a const
    res = await axios.post('/api/signup', body, config);
    console.log('res from /api/signup ->', res.data);
    // expect to get back the token
    // if successful store in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      return dispatch({ type: SIGNUP_SUCCESS });
    }
    return dispatch({ type: SIGNUP_FAIL, payload: res.data.message });
    // else display error
  } catch (error) {
    console.error(error);
    return dispatch({ type: SIGNUP_FAIL, payload: error.response.data.error });
  }
};

export const clearError = () => (dispatch) => {
  return dispatch({ type: CLEAR_ERROR });
};

export const logOut = () => (dispatch) => {
  // clear the JWT first
  localStorage.removeItem('token');
  return dispatch({ type: LOGOUT });
};
