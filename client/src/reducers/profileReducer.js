import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  PROFILES_LOADING,
  UPDATE_PROFILE,
  UPDATE_PROFILES,
  CLEAR_PROFILE
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: null,
  loading: false,
  listLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        listLoading: false
      };
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case PROFILES_LOADING:
      return {
        ...state,
        listLoading: true
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          followed: action.payload.followed
        }
      };
    case UPDATE_PROFILES:
      return {
        ...state,
        profiles: state.profiles.map(profile => {
          if (profile.user._id === action.payload.user)
            return { ...profile, followed: action.payload.followed };
          return profile;
        })
      };
    case CLEAR_PROFILE:
      return initialState;
    default:
      return state;
  }
}
