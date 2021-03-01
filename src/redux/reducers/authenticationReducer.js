/**
 * Authentication Redux reducer function.
 */

import _ from "lodash";

import { AUTH_USER_REGISTRATION_LOADING, AUTH_USER_REGISTRATION_SENT, AUTH_ACCESS_CODE_REQUEST_LOADING, AUTH_ACCESS_CODE_REQUEST_SENT, AUTH_USER_LOGIN_LOADING, AUTH_USER_LOGIN, AUTH_USER_LOGOUT, AUTH_TOKEN_INVALID, AUTH_TOKEN_REFRESHED, AUTH_USER_SESSION_EXPIRED } from "../actions/authenticationActions";

const defaultState = {
  userRegistrationLoading: false,
  userRegistrationSent: false,
  accessCodeRequestLoading: false,
  accessCodeRequestSent: false,
  userLoginLoading: false,
  userAuthenticated: false,
  accessToken: null,
  accessTokenExpiry: null,
  refreshToken: null,
  // user: null
  user: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    roles: []
  }
};

/**
 * Authentication reducer.
 *
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
function authenticationReducer(state = defaultState, action) {
  switch (action.type) {

    case AUTH_USER_REGISTRATION_LOADING:
      state.userRegistrationLoading = action.payload;
      break;

    case AUTH_USER_REGISTRATION_SENT:
      state.userRegistrationLoading = false;
      state.userRegistrationSent = action.payload;
      break;

    case AUTH_ACCESS_CODE_REQUEST_LOADING:
      state.accessCodeRequestLoading = action.payload;
      break;

    case AUTH_ACCESS_CODE_REQUEST_SENT:
      state.accessCodeRequestLoading = false;
      state.accessCodeRequestSent = action.payload;
      break;

    case AUTH_USER_LOGIN_LOADING:
      state.userLoginLoading = action.payload;
      break;

    case AUTH_USER_LOGIN:
      // State user as logged in and add user authentication information.
      return {...state, 
        userLoginLoading:false, 
        userAuthenticated: true, 
        accessToken:action.payload.accessToken, 
        accessTokenExpiry: 
        action.payload.accessTokenExpiry, 
        refreshToken: action.payload.refreshToken,
        user:action.payload.user
      };

    case AUTH_USER_LOGOUT:
      // State user as not logged and remove user authentication information.
      return {...state, 
        userAuthenticated: false,
        accessToken: null,
        accessTokenExpiry: null,
        refreshToken: null,
        user:{
          id: null,
          firstName: null,
          lastName: null,
          email: null,
          roles: []
          }
        };

    case AUTH_TOKEN_INVALID:
      // TODO
      break;

    case AUTH_TOKEN_REFRESHED:
      // TODO
      state.userAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.accessTokenExpiry = action.payload.accessTokenExpiry;
      // state.user = action.payload.user;
      _.merge(state.user, action.payload.user);
      break;

    case AUTH_USER_SESSION_EXPIRED:
      return {...state, 
        userAuthenticated: false,
        accessToken: null,
        accessTokenExpiry: null,
        refreshToken: null,
        user:{
          id: null,
          firstName: null,
          lastName: null,
          email: null,
          roles: []
          }
        };

    default:
      break;
  }

  return state;
};

export default authenticationReducer;
