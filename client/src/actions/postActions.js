import axios from "axios";

import {
  GET_POSTS,
  POST_LOADING,
  ADD_POST,
  DELETE_POST,
  POST_SUCCESS,
  CLEAR_POST_SUCCESS,
  COMMENT_SUCCESS,
  CLEAR_COMMENT_SUCCESS,
  UPDATE_POSTS,
  GET_ERRORS,
  CLEAR_ERRORS,
  CLEAR_POST
} from "./types";

// Add Post
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/posts", postData)
    .then(res => {
      dispatch({
        type: ADD_POST,
        payload: res.data
      });
      // send a success message to clear the textarea
      dispatch({
        type: POST_SUCCESS
      });
      dispatch({
        type: CLEAR_POST_SUCCESS
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
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(res => {
      dispatch(updatePosts({ ...res.data }));
      // send a success message to clear the textarea
      dispatch({
        type: COMMENT_SUCCESS
      });
      dispatch({
        type: CLEAR_COMMENT_SUCCESS
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
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
