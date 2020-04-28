import {
  PROFILE_API_FAILURE,
  PROFILE_API_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PREFERENCES_SUCCESS,
  GET_ASSETS_LIGHT_ON_SUCCESS,
  GET_ASSET_LIGHT_OFF_OR_RESET_SUCCESS,
  USER_PROFILE_IMAGE_SUCCESS, CLEAR_USER_DATA,
  GET_SYSTEM_CONFIG_SUCCESS
} from '../constants';

const initialState = {
  error: false,
  loading: false,
  userProfile: {},
  userPreferences: [],
  sysConfig: {}
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case PROFILE_API_REQUEST:
      return {
        ...state,
        loading: true
      };
    case PROFILE_API_FAILURE:
      return {
        ...state,
        loading: false,
        error: true
      };
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case GET_ASSETS_LIGHT_ON_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case GET_ASSET_LIGHT_OFF_OR_RESET_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case USER_PROFILE_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload,
        loading: false
      };
    case GET_USER_PREFERENCES_SUCCESS:
      return {
        ...state,
        userPreferences: action.payload,
        loading: false
      };
    case CLEAR_USER_DATA:
      return {
        ...state,
        userProfile: {},
        loading: false
      };
    case GET_SYSTEM_CONFIG_SUCCESS:
      return {
        ...state,
        sysConfig: {},
        loading: false
      };
    default:
      return state;
  }
}
