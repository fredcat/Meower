import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS,
  POST_LOADING,
  POST_SUCCESS,
  CLEAR_POST_SUCCESS,
  COMMENT_SUCCESS,
  CLEAR_COMMENT_SUCCESS,
  UPDATE_POSTS,
  CLEAR_POST
} from "../actions/types";

const initialState = {
  posts: [],
  loading: false,
  postSuccess: false,
  commentSuccess: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case POST_SUCCESS:
      return {
        ...state,
        postSuccess: true
      };
    case CLEAR_POST_SUCCESS:
      return {
        ...state,
        postSuccess: false
      };
    case COMMENT_SUCCESS:
      return {
        ...state,
        commentSuccess: true
      };
    case CLEAR_COMMENT_SUCCESS:
      return {
        ...state,
        commentSuccess: false
      };
    case UPDATE_POSTS:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) return { ...action.payload };
          return post;
        })
      };
    case CLEAR_POST:
      return initialState;
    default:
      return state;
  }
}
