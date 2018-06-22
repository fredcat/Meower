import isEmpty from "../validation/is-empty";

import { SET_CURRENT_USER, SET_CURRENT_AVATAR } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  avatar: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SET_CURRENT_AVATAR:
      return {
        ...state,
        avatar: action.payload
      };
    default:
      return state;
  }
}
