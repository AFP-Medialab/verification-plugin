/**
 * Authentication Redux actions.
*/

/**
 * User registration loading event.
 */
export const AUTH_USER_REGISTRATION_LOADING = "AUTH_USER_REGISTRATION_LOADING";
/**
 * User registration sent event.
 */
export const AUTH_USER_REGISTRATION_SENT = "AUTH_USER_REGISTRATION_SENT";
/**
 * Access code request loading event.
 */
export const AUTH_ACCESS_CODE_REQUEST_LOADING = "AUTH_ACCESS_CODE_REQUEST_LOADING";
/**
 * Access code request sent event.
 */
export const AUTH_ACCESS_CODE_REQUEST_SENT = "AUTH_ACCESS_CODE_REQUEST_SENT";
/**
 * User login loading event.
 */
export const AUTH_USER_LOGIN_LOADING = "AUTH_USER_LOGIN_LOADING";
/**
 * User logged in event.
 */
export const AUTH_USER_LOGIN = "AUTH_USER_LOGIN";
/**
 * User logged out event.
 */
export const AUTH_USER_LOGOUT = "AUTH_USER_LOGOUT";
/**
 * Authentication token invalid event.
 */
export const AUTH_TOKEN_INVALID = "AUTH_TOKEN_INVALID";
/**
 * Authentication token refreshed event.
 */
export const AUTH_TOKEN_REFRESHED = "AUTH_TOKEN_REFRESHED";
/**
 * User session expired event.
 */
export const AUTH_USER_SESSION_EXPIRED = "AUTH_USER_SESSION_EXPIRED";


/**
 *
 *
 * @param {boolean} [loading=true]
 * @returns
 */
export function userRegistrationLoadingAction(loading = true) {
  return {
    type: AUTH_USER_REGISTRATION_LOADING,
    payload: loading
  };
}

/**
 * TODO
 *
 * @param {boolean} [sent=true]
 * @returns
 */
export function userRegistrationSentAction(sent = true) {
  return {
    type: AUTH_USER_REGISTRATION_SENT,
    payload: sent
  };
};

/**
 * TODO
 *
 * @param {boolean} [loading=true]
 * @returns
 */
export function userAccessCodeRequestLoadingAction(loading = true) {
  return {
    type: AUTH_ACCESS_CODE_REQUEST_LOADING,
    payload: loading
  };
};

/**
 * TODO
 *
 * @param {boolean} [sent=true]
 * @returns
 */
export function userAccessCodeRequestSentAction(sent = true) {
  return {
    type: AUTH_ACCESS_CODE_REQUEST_SENT,
    payload: sent
  };
};

/**
 * TODO
 *
 * @param {boolean} [loading=true]
 * @returns
 */
export function userLoginLoadingAction(loading = true) {
  return {
    type: AUTH_USER_LOGIN_LOADING,
    payload: loading
  };
};

/**
 * TODO
 *
 * @param {String} accessToken User's JWT access token.
 * @param {Date} accessTokenExpiry The JWT access token expiry date.
 * @param {Object} user Logged in user information.
 * @returns
 */
export function userLoginAction(accessToken, accessTokenExpiry, user) {
  return {
    type: AUTH_USER_LOGIN,
    payload: {
      accessToken,
      accessTokenExpiry,
      user
    }
  };
};

/**
 * TODO
 *
 * @returns
 */
export function userLogoutAction() {
  return {
    type: AUTH_USER_LOGOUT
  };
}

/**
 * TODO
 *
 * @param {String} accessToken
 * @param {Date} accessTokenExpiry
 * @param {Object} user
 * @returns
 */
export function userTokenRefreshedAction(accessToken, accessTokenExpiry, user) {
  return {
    type: AUTH_TOKEN_REFRESHED,
    payload: {
      accessToken,
      accessTokenExpiry,
      user
    }
  };
};

/**
 * TODO
 *
 * @returns
 */
export function userSessionExpiredAction() {
  return {
    type: AUTH_USER_SESSION_EXPIRED
  };
};

export default {
  userRegistrationLoadingAction,
  userRegistrationSentAction,
  userAccessCodeRequestLoadingAction,
  userAccessCodeRequestSentAction,
  userLoginAction,
  userTokenRefreshed: userTokenRefreshedAction,
  userSessionExpired: userSessionExpiredAction
};
