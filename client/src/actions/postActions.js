import axios from "axios";
import path from "path";

import {
  GET_POSTS,
  POST_LOADING,
  ADD_POST,
  DELETE_POST,
  UPDATE_POSTS,
  GET_ERRORS,
  CLEAR_ERRORS,
  CLEAR_POST
} from "./types";

// Add Post
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  return axios
    .post("/api/posts", postData)
    .then(res => {
      dispatch({
        type: ADD_POST,
        payload: res.data
      });
      // return a success message
      return true;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      return false;
    });
};

export const uploadImage = file => dispatch => {
  const extName = path.extname(file.name);
  return axios
    .get(`/api/posts/sign-s3?ext-name=${extName}&file-type=${file.type}`)
    .then(res => {
      const uploadUrl = res.data.url;
      const options = {
        headers: {
          "Content-Type": file.type
        },
        transformRequest: [
          (data, headers) => {
            delete headers.common.Authorization;
            return data;
          }
        ]
      };
      return axios
        .put(res.data.signedRequest, file, options)
        .then(res => uploadUrl)
        .catch(err => {
          console.log(err.response.data);
          return false;
        });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/posts")
    .then(res => {
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get Subscribed Posts
export const getSubscribedPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/posts/subscribed")
    .then(res => {
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get Single Post by ID
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/${id}`)
    .then(res => {
      dispatch({
        type: GET_POSTS,
        payload: [res.data]
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get all the posts of a user
export const getPostsByUser = userid => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/user/${userid}`)
    .then(res => {
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Like
export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => dispatch(updatePosts({ ...res.data, liked: true })))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Like
export const removeLike = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(res => dispatch(updatePosts({ ...res.data, liked: false })))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Comment
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  return axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(res => {
      dispatch(updatePosts({ ...res.data }));
      // return a success message
      return true;
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      return false;
    });
};

// Delete Comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`)
    .then(res => dispatch(updatePosts({ ...res.data })))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get errors
export const getErrors = errors => dispatch => {
  dispatch({
    type: GET_ERRORS,
    payload: errors
  });
};

// Set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// Update posts
export const updatePosts = post => {
  return {
    type: UPDATE_POSTS,
    payload: post
  };
};

// Clear post state
export const clearPost = () => {
  return {
    type: CLEAR_POST
  };
};
