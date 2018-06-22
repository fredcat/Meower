import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, SET_CURRENT_AVATAR } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      // Set avatar state to current avatar url
      dispatch(setCurrentAvatar(true));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change User Role
export const changeRole = roleData => dispatch => {
  axios
    .post("/api/users/role", roleData)
    .then(res => dispatch(setCurrentUser(res.data)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Change Avatar
export const changeAvatar = avatarData => dispatch => {
  axios
    .post("/api/users/avatar", avatarData)
    .then(res =>
      dispatch({
        type: SET_CURRENT_AVATAR,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set current avatar
// setCurrentAvatar(true) => get avatar url and set avatar state
// setCurrentAvatar(false) => clear out avatar state in redux store
export const setCurrentAvatar = loggedin => dispatch => {
  if (loggedin) {
    axios
      .get("/api/users/avatar")
      .then(res => {
        dispatch({
          type: SET_CURRENT_AVATAR,
          payload: res.data
        });
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  } else {
    dispatch({
      type: SET_CURRENT_AVATAR,
      payload: {}
    });
  }
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch(setCurrentAvatar(false));
};
