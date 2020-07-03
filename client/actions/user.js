import axios from "axios";
import {
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_FAIL,
  LOGOUT,
} from "../constants/actionTypes";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const login = async (username, password) => {};

export const signup = (username, password, email) => async (dispatch) => {
  //set up the body and stringify it
  const body = JSON.stringify({ username, password, email });
  try {
    // store the result of a post request to /api/signup in a const
    const res = await axios.post("/api/signup", body, config);
    console.log("res from /api/signup ->", res.data);
    // expect to get back the token
    // if successful store in localStore
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      return dispatch({ type: SIGNUP_SUCCESS });
    }
    return dispatch({ type: SIGNUP_FAIL });
    // else display error
  } catch (error) {
    console.error(error);
    return dispatch({ type: SIGNUP_FAIL, payload: res.data.message });
  }
};
