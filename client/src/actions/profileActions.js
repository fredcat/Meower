import axios from "axios";

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  PROFILES_LOADING,
  CLEAR_PROFILE,
  UPDATE_PROFILES,
  UPDATE_PROFILE,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

import { logoutUser } from "./authActions";

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  return axios
    .get("/api/profile")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
      return res.data;
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: null
      });
      return false;
    });
};

// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};

// Create or Edit Profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => {
      history.push("/feed");
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfilesLoading());
  axios
    .get("/api/profile/all")
    .then(res => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

// Get profiles of a user's followings
export const getFollowingsProfiles = userid => dispatch => {
  dispatch(setProfilesLoading());
  axios
    .get(`/api/profile/followings/${userid}`)
    .then(res => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

// Get profiles of a user's followers
export const getFollowersProfiles = userid => dispatch => {
  dispatch(setProfilesLoading());
  axios
    .get(`/api/profile/followers/${userid}`)
    .then(res => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
};

// Follow
export const addFollow = (inSidebar, id) => dispatch => {
  return axios
    .post(`/api/follow/follow/${id}`)
    .then(res => {
      if (inSidebar) dispatch(updateProfile({ ...res.data, followed: true }));
      else dispatch(updateProfiles({ ...res.data, followed: true }));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Unfollow
export const removeFollow = (inSidebar, id) => dispatch => {
  return axios
    .post(`/api/follow/unfollow/${id}`)
    .then(res => {
      if (inSidebar) dispatch(updateProfile({ ...res.data, followed: false }));
      else dispatch(updateProfiles({ ...res.data, followed: false }));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete account & profile
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete("/api/profile")
      .then(res => dispatch(logoutUser()))
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Get errors
export const getErrors = errors => dispatch => {
  dispatch({
    type: GET_ERRORS,
    payload: errors
  });
};

// Profile loading (Single profile)
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Profiles loading (Profile list)
export const setProfilesLoading = () => {
  return {
    type: PROFILES_LOADING
  };
};

// Clear profile
export const clearProfile = () => {
  return {
    type: CLEAR_PROFILE
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const updateProfiles = profile => {
  return {
    type: UPDATE_PROFILES,
    payload: profile
  };
};

export const updateProfile = profile => {
  return {
    type: UPDATE_PROFILE,
    payload: profile
  };
};
