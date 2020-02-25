/**
 * Authentication Redux actions.
*/

/**
 * User registration sent event.
 */
export const AUTH_USER_REGISTRATION_SENT = "AUTH_USER_REGISTRATION_SENT";
/**
 * Access code request sent event.
 */
export const AUTH_ACCESS_CODE_REQUEST_SENT = "AUTH_ACCESS_CODE_REQUEST_SENT";
/**
 * User logged in event.
 */
export const AUHT_USER_LOGIN = "AUHT_USER_LOGIN";
/**
 * User logged out event.
 */
export const AUHT_USER_LOGOUT = "AUHT_USER_LOGOUT";
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
 * TODO
 *
 * @returns
 */
export function userRegistrationSentAction() {
  return {
    type: AUTH_USER_REGISTRATION_SENT
  };
};

/**
 * TODO
 *
 * @returns
 */
export function userAccessCodeRequestSentAction() {
  return {
    type: AUTH_ACCESS_CODE_REQUEST_SENT
  };
};

/**
 * TODO
 *
 * @param {*} accessToken User's JWT access token.
 * @param {*} accessTokenExpiry The JWT access token expiry date.
 * @param {*} user Logged in user information.
 * @returns
 */
export function userLoginAction(accessToken, accessTokenExpiry, user) {
  return {
    type: AUHT_USER_LOGIN,
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
 * @param {*} accessToken
 * @param {*} accessTokenExpiry
 * @param {*} user
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
  userRegistrationSentAction,
  userAccessCodeRequestSentAction,
  userLoginAction,
  userTokenRefreshed: userTokenRefreshedAction,
  userSessionExpired: userSessionExpiredAction
};
