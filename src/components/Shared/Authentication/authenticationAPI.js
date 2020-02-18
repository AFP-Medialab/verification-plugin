/**
 * Authentication API functions.
 */

import axios from "axios";
import _ from "lodash";
import jwtDecode from "jwt-decode";

import { ERR_AUTH_INVALID_PARAMS, ERR_AUTH_BAD_REQUEST, ERR_AUTH_SERVER_ERROR, ERR_AUTH_UNKNOWN_ERROR, ERR_AUTH_INVALID_TOKEN, ERR_AUTH_INVALID_CREDENTIALS, ERR_AUTH_INVALID_USER_STATE, ERR_AUTH_USER_EXPIRED, ERR_AUTH_SESSION_EXPIRED } from "./authenticationErrors";

import { userRegistrationSentAction, userAccessCodeRequestSentAction, userLoginAction, userTokenRefreshed, userSessionExpired } from '../../../redux/actions/authenticationActions';


// Global REST client parameters
const defaultTimeout = 3000;
const jsonContentType = "application/json";
const authSrvBaseURL = `${process.env.REACT_APP_AUTH_BASE_URL}/api/v1/auth`;

// Services URL
const AUTH_SRV_REGISTER_USER_URL = "/user";
const AUTH_SRV_REQUEST_ACCESS_CODE_URL = "/accesscode";
const AUTH_SRV_LOGIN_URL = "/login";
const AUTH_SRV_LOGOUT_URL = "/logout";
const AUTH_SRV_REFRESH_TOKEN_URL = "/refreshtoken";

/**
 * Register a new user to services.
 *
 * @param {import("redux").Store} store
 * @param {Object} request
 * @returns {Promise<Object>} Result as a Promise.
 */
export function registerUser(store, request) {
  if (_.isEmpty(request)) {
    return Promise.reject({
      error: {
        code: ERR_AUTH_INVALID_PARAMS,
        message: "Empty request argument"
      }
    });
  }

  // Default language
  const lang = store.getState().language;

  // Service request
  const srvRequest = {
    email: request.email,
    firstName: request.firstName,
    lastName: request.lastName,
    company: request.company,
    position: request.position,
    preferredLanguages: request.preferredLanguages || [ lang ],
    timezone: request.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  // Make service call
  return axios.post(AUTH_SRV_REGISTER_USER_URL, srvRequest, {
    baseURL: authSrvBaseURL,
    headers: {
      ContentType: jsonContentType
    },
    timeout: defaultTimeout
  }).then(response => {
    store.dispatch(userRegistrationSentAction());
    return Promise.resolve({
      status: response.status
    });
  }, error => {
    if (error.response) {
      if (error.response.status === 400) {
        return Promise.reject({
          error: {
            code: ERR_AUTH_BAD_REQUEST,
            message: error.response.data
          }
        });
      }
      return Promise.reject({
        error: {
          code: ERR_AUTH_SERVER_ERROR,
          message: error.response.data
        }
      });
    }
    return Promise.reject({
      error: {
        code: ERR_AUTH_UNKNOWN_ERROR,
        message: error.message
      }
    });
  });
};

/**
 * Request an access code to the service.
 *
 * @param {import("redux").Store} store
 * @param {Object} request
 * @returns {Promise<Object>} Result as a Promise.
 */
export function requestAccessCode(store, request) {
  if (_.isEmpty(request)) {
    return Promise.reject({
      error: {
        code: ERR_AUTH_INVALID_PARAMS,
        message: "Empty request argument"
      }
    });
  }

  // Service request
  const srvRequest = {
    email: request.email
  };

  // Call service
  return axios.post(AUTH_SRV_REQUEST_ACCESS_CODE_URL, srvRequest, {
    baseURL: authSrvBaseURL,
    headers: {
      ContentType: jsonContentType
    },
    timeout: defaultTimeout
  }).then(response => {
    store.dispatch(userAccessCodeRequestSentAction());
    return Promise.resolve({
      status: response.status
    });
  }, error => {
    if (error.response) {
      if (error.response.status === 400) {
        return Promise.reject({
          error: {
            code: ERR_AUTH_BAD_REQUEST,
            message: error.response.data
          }
        });
      }
      return Promise.reject({
        error: {
          code: ERR_AUTH_SERVER_ERROR,
          message: error.response.data
        }
      });
    }
    return Promise.reject({
      error: {
        code: ERR_AUTH_UNKNOWN_ERROR,
        message: error.message
      }
    });
  });
}

/**
 * Login user using it's access code.
 *
 * @param {import("redux").Store} store
 * @param {Object} request
 * @returns {Promise<Object>} Result as a Promise.
 */
export function login(store, request) {
  if (_.isEmpty(request)) {
    return Promise.reject({
      error: {
        code: ERR_AUTH_INVALID_PARAMS,
        message: "Empty request argument"
      }
    });
  }

  // Service request
  const srvRequest = {
    code: request.accessCode
  };

  // Call service
  return axios.post(AUTH_SRV_LOGIN_URL, srvRequest, {
    baseURL: authSrvBaseURL,
    headers: {
      ContentType: jsonContentType
    },
    timeout: defaultTimeout
  }).then(response => {
    const accessToken = response.data.token;
    const userInfo = response.data.user;
    // Decode JWT token
    try {
      const tokenContent = decodeJWTToken(accessToken);
      _.merge(userInfo, tokenContent.user);
      store.dispatch(userLoginAction(accessToken, tokenContent.accessTokenExpiry, userInfo));
      return Promise.resolve({
        status: response.status,
        data: {
          accessToken: accessToken,
          accessTokenExpiry: tokenContent.accessTokenExpiry,
          user: userInfo
        }
      });
    } catch (jwtError) {
      // Invalid token
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_TOKEN,
          message: jwtError.message
        }
      });
    }
  }, error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // Invalid request data
          return Promise.reject({
            error: {
              code: ERR_AUTH_BAD_REQUEST,
              message: error.response.data
            }
          });
        case 403:
          // Invalid credentials (access code)
          return Promise.reject({
            error: {
              code: ERR_AUTH_INVALID_CREDENTIALS,
              message: error.response.data
            }
          });
        case 409:
          // User's state prevent login
          return Promise.reject({
            error: {
              code: ERR_AUTH_INVALID_USER_STATE,
              message: error.response.data
            }
          });
        case 410:
          // User account expired
          return Promise.reject({
            error: {
              code: ERR_AUTH_USER_EXPIRED,
              message: error.response.data
            }
          });
        default:
          // Unknown error
          return Promise.reject({
            error: {
              code: ERR_AUTH_UNKNOWN_ERROR,
              message: error.response.data
            }
          });
      }
    }
    return Promise.reject({
      error: {
        code: ERR_AUTH_UNKNOWN_ERROR,
        message: error.message
      }
    });
  });
}

export function logout() {
  // TODO
}

/**
 * Refresh the JWT access token.
 *
 * @param {import("redux").Store} store
 * @returns {Promise<Object>} Result as a Promise.
 */
function refreshToken(store) {
  return axios.post(AUTH_SRV_REFRESH_TOKEN_URL, null, {
    baseURL: authSrvBaseURL,
    // headers: {
    //   ContentType: jsonContentType
    // },
    timeout: defaultTimeout
  }).then(response => {
    const accessToken = response.data.token;
    // Decode JWT token
    try {
      const tokenContent = decodeJWTToken(accessToken);
      store.dispatch(userTokenRefreshed(accessToken, tokenContent.accessTokenExpiry, tokenContent.user));
      return Promise.resolve({
        status: response.status,
        data: {
          accessToken: accessToken,
          accessTokenExpiry: tokenContent.accessTokenExpiry,
          user: tokenContent.user
        }
      });
    } catch (jwtError) {
      // Invalid token
      store.dispatch(userSessionExpired());
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_TOKEN,
          message: jwtError.message
        }
      });
    }
  }, error => {
    // Logout user
    store.dispatch(userSessionExpired());
    // Reject with error
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // Invalid request data
          return Promise.reject({
            error: {
              code: ERR_AUTH_BAD_REQUEST,
              message: error.response.data
            }
          });
        case 401:
          // Invalid or expired refresh token
          return Promise.reject({
            error: {
              code: ERR_AUTH_SESSION_EXPIRED,
              message: error.response.data
            }
          });
        default:
          // Unknown error
          return Promise.reject({
            error: {
              code: ERR_AUTH_UNKNOWN_ERROR,
              message: error.response.data
            }
          });
      }
    }
    return Promise.reject({
      error: {
        code: ERR_AUTH_UNKNOWN_ERROR,
        message: error.message
      }
    });
  });
}

/**
 * Handle authentication on a service request.
 *
 * @param {import("redux").Store} store
 * @param {Object} axiosConfig
 * @param {*} successHandler
 * @param {*} errorHandler
 * @returns {Promise<Object>} Result as a Promise.
 */
export function authenticatedRequest(store, axiosConfig, successHandler, errorHandler) {
  const userSession = store.getState(userSession);
  
  // If not authenticated, make a std service call
  if (!userSession.userAuthenticated || !userSession.accessToken) {
    return axios(axiosConfig).then(successHandler, errorHandler);
  }
  
  // TODO: check token expiry and refresh if required before making service call?

  // Inject access token
  if (!axiosConfig.headers) {
    axiosConfig.headers = {}
  }
  axiosConfig.headers["Authorization"] = `Bearer ${userSession.accessToken}`;

  // Make service call
  return axios(axiosConfig).then(successHandler, error => {
    // If unauthorized
    if (error.response && error.response.status === 401) {
      // Refresh token
      return refreshToken(store).then(response => {
        // TODO: get token (refresh return axios response??)
        const accessToken = response.data.token;
        // Update access token header
        axiosConfig.headers["Authorization"] = `Bearer ${accessToken}`;
        // Make service call with refreshed token
        return axios(axiosConfig).then(successHandler, errorHandler);
      }, error => {
        // Make service call
        return axios(axiosConfig).then(successHandler, errorHandler);
      })
    }
    return errorHandler(error);
  });
}

/**
 * Decode a JWT token and return it's content data as an object.
 *
 * @param {*} token
 * @returns
 * @throws
 */
function decodeJWTToken(token) {
  let result = {};

  // Token
  result.accessToken = token;

  // Decode JWT Token
  const tokenContent = jwtDecode(token);
  // console.log("tokenContent: ", tokenContent);

  // Token Expiry
  result.accessTokenExpiry = new Date(tokenContent.exp * 1000);

  // User
  result.user = {
    id: tokenContent.sub,
    email: tokenContent.email,
    username: tokenContent.preferred_username,
    roles: tokenContent.roles
  };

  return result;
}

export default {
  registerUser,
  requestAccessCode,
  login,
  logout,
  authenticatedRequest
};
