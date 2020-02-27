/**
 * Authentication Redux reducer function.
 */

 import _ from "lodash";

import { AUTH_USER_REGISTRATION_SENT, AUTH_ACCESS_CODE_REQUEST_SENT, AUHT_USER_LOGIN, AUHT_USER_LOGOUT, AUTH_TOKEN_INVALID, AUTH_TOKEN_REFRESHED, AUTH_USER_SESSION_EXPIRED } from "../actions/authenticationActions";

const defaultState = {
  userRegistrationSent: false,
  accessCodeRequestSent: false,
  userAuthenticated: false,
  accessToken: null,
  accessTokenExpiry: null,
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

    case AUTH_USER_REGISTRATION_SENT:
      state.userRegistrationSent = true;
      break;

    case AUTH_ACCESS_CODE_REQUEST_SENT:
      state.accessCodeRequestSent = true;
      break;

    case AUHT_USER_LOGIN:
      // State user as logged in and add user authentication information.
      state.userAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.accessTokenExpiry = action.payload.accessTokenExpiry;
      // user: {
      //   id: null,
      //   firstName: null,
      //   lastName: null,
      //   email: null,
      //   roles: []
      // }
      state.user = action.payload.user;
      break;

    case AUHT_USER_LOGOUT:
      // State user as not logged and remove user authentication information.
      state.userAuthenticated = false;
      state.accessToken = null;
      state.accessTokenExpiry = null;
      state.user = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        roles: []
      };
      break;

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
      // TODO
      state.userAuthenticated = false;
      state.accessToken = null;
      state.accessTokenExpiry = null;
      state.user = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        roles: []
      };
      break;
  }

    return state;
};

export default authenticationReducer;
