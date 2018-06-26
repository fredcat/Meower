import {
  ADD_POST,
  DELETE_POST,
  GET_POSTS,
  POST_LOADING,
  UPDATE_POSTS,
  CLEAR_POST
} from "../actions/types";

const initialState = {
  posts: [],
  loading: false,
  postSuccess: false,
  commentSuccess: false,
  uploadUrl: ""
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
