/**
 * Authentication API hook.
 */
import { useDispatch, useSelector } from "react-redux";

import {
  userAccessCodeRequestLoadingAction,
  userAccessCodeRequestSentAction,
  userLoginAction,
  userLoginLoadingAction,
  userLogoutAction,
  userRegistrationLoadingAction,
  userRegistrationSentAction,
  userSessionExpiredAction,
  userTokenRefreshedAction,
} from "@/redux/actions/authenticationActions";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import _ from "lodash";

import {
  ERR_AUTH_ABORT_ERROR,
  ERR_AUTH_BAD_REQUEST,
  ERR_AUTH_INVALID_CREDENTIALS,
  ERR_AUTH_INVALID_PARAMS,
  ERR_AUTH_INVALID_TOKEN,
  ERR_AUTH_INVALID_USER_STATE,
  ERR_AUTH_SERVER_ERROR,
  ERR_AUTH_SESSION_EXPIRED,
  ERR_AUTH_UNKNOWN_ERROR,
  ERR_AUTH_USER_EXPIRED,
} from "./authenticationErrors";

/**
 * Authentication API hook.
 *
 * @returns
 */
export default function useAuthenticationAPI() {
  // Global REST client parameters
  const defaultTimeout = 5000;
  const loginTimeout = 30000;
  const jsonContentType = "application/json";
  const textContentType = "text/plain";
  const authSrvBaseURL = `${process.env.REACT_APP_BASEURL}/api/v1/auth`;

  // Services URL
  const AUTH_SRV_REGISTER_USER_URL = "/registration";
  const AUTH_SRV_REQUEST_ACCESS_CODE_URL = "/accesscode";
  const AUTH_SRV_LOGIN_URL = "/login";
  //const AUTH_SRV_LOGOUT_URL = "/logout";
  const AUTH_SRV_REFRESH_TOKEN_URL = "/refreshtoken";

  const dispatch = useDispatch();

  // Default language
  const lang = useSelector((state) => state.language);

  /**
   * Register a new user to services.
   *
   * @param {Object} request
   * @returns {Promise<Object>} Result as a Promise.
   */
  const registerUser = (request) => {
    if (_.isEmpty(request)) {
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_PARAMS,
          message: "Empty request argument",
        },
      });
    }

    // Service request
    const srvRequest = {
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      organization: request.organization,
      organizationRole: request.organizationRole,
      organizationRoleOther: request.organizationRoleOther,
      preferredLanguages: request.preferredLanguages || [lang],
      timezone:
        request.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Make service call
    dispatch(userRegistrationLoadingAction());
    return axios
      .post(AUTH_SRV_REGISTER_USER_URL, srvRequest, {
        baseURL: authSrvBaseURL,
        timeout: defaultTimeout,
      })
      .then(
        (response) => {
          dispatch(userRegistrationSentAction());
          return Promise.resolve({
            status: response.status,
          });
        },
        (error) => {
          dispatch(userRegistrationLoadingAction(false));
          if (error.response) {
            if (error.response.status === 400) {
              return Promise.reject({
                error: {
                  code: ERR_AUTH_BAD_REQUEST,
                  message: error.response.data,
                },
              });
            }
            return Promise.reject({
              error: {
                code: ERR_AUTH_SERVER_ERROR,
                message: error.response.data,
              },
            });
          }
          return Promise.reject({
            error: {
              code: ERR_AUTH_UNKNOWN_ERROR,
              message: error.message,
            },
          });
        },
      );
  };

  /**
   * Request an access code to the service.
   *
   * @param {Object} request
   * @returns {Promise<Object>} Result as a Promise.
   */
  const requestAccessCode = (request) => {
    if (_.isEmpty(request)) {
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_PARAMS,
          message: "Empty request argument",
        },
      });
    }

    // Service request
    const srvRequest = {
      email: request.email,
    };

    // Call service
    dispatch(userAccessCodeRequestLoadingAction());
    return axios
      .post(AUTH_SRV_REQUEST_ACCESS_CODE_URL, srvRequest, {
        baseURL: authSrvBaseURL,
        timeout: defaultTimeout,
      })
      .then(
        (response) => {
          dispatch(userAccessCodeRequestSentAction());
          return Promise.resolve({
            status: response.status,
          });
        },
        (error) => {
          dispatch(userAccessCodeRequestLoadingAction(false));
          if (error.response) {
            if (error.response.status === 400) {
              return Promise.reject({
                error: {
                  code: ERR_AUTH_BAD_REQUEST,
                  message: error.response.data,
                },
              });
            }
            return Promise.reject({
              error: {
                code: ERR_AUTH_SERVER_ERROR,
                message: error.response.data,
              },
            });
          }
          return Promise.reject({
            error: {
              code: ERR_AUTH_UNKNOWN_ERROR,
              message: error.message,
            },
          });
        },
      );
  };

  /**
   * Log the user in using their access code.
   *
   * @param {Object} request
   * @returns {Promise<Object>} Result as a Promise.
   */
  const login = (request) => {
    if (_.isEmpty(request)) {
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_PARAMS,
          message: "Empty request argument",
        },
      });
    }

    // Service request
    const srvRequest = {
      code: request.accessCode,
    };

    // Call service
    dispatch(userLoginLoadingAction());
    return axios
      .post(AUTH_SRV_LOGIN_URL, srvRequest, {
        baseURL: authSrvBaseURL,
        headers: {
          ContentType: jsonContentType,
        },
        timeout: loginTimeout,
      })
      .then(
        (response) => {
          const accessToken = response.data.token;
          const refreshToken = response.data.refreshToken;
          const userInfo = response.data.user;
          // Decode JWT token
          try {
            const tokenContent = decodeJWTToken(accessToken);
            _.merge(userInfo, tokenContent.user);
            dispatch(
              userLoginAction(
                accessToken,
                tokenContent.accessTokenExpiry,
                refreshToken,
                userInfo,
              ),
            );
            return Promise.resolve({
              status: response.status,
              data: {
                accessToken: accessToken,
                accessTokenExpiry: tokenContent.accessTokenExpiry,
                refreshToken: refreshToken,
                user: userInfo,
              },
            });
          } catch (jwtError) {
            dispatch(userLoginLoadingAction(false));
            // Invalid token
            return Promise.reject({
              error: {
                code: ERR_AUTH_INVALID_TOKEN,
                message: jwtError.message,
              },
            });
          }
        },
        (error) => {
          // console.log("Error calling loggin service: ", error);
          dispatch(userLoginLoadingAction(false));
          if (error.response) {
            switch (error.response.status) {
              case 400:
                // Invalid request data
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_BAD_REQUEST,
                    message: error.response.data,
                  },
                });
              case 403:
                // Invalid credentials (access code)
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_INVALID_CREDENTIALS,
                    message: error.response.data,
                  },
                });
              case 409:
                // User's state prevent login
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_INVALID_USER_STATE,
                    message: error.response.data,
                  },
                });
              case 410:
                // User account expired
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_USER_EXPIRED,
                    message: error.response.data,
                  },
                });
              default:
                // Unknown error
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_UNKNOWN_ERROR,
                    message: error.response.data,
                  },
                });
            }
          } else if (error.code && error.code === "ECONNABORTED") {
            // Timeout or abort error
            return Promise.reject({
              error: {
                code: ERR_AUTH_ABORT_ERROR,
                message: error.message,
              },
            });
          }
          return Promise.reject({
            error: {
              code: ERR_AUTH_UNKNOWN_ERROR,
              message: error.message,
            },
          });
        },
      );
  };

  /**
   * Logout current user.
   *
   * @returns {Promise<Object>} Result as a Promise.
   */
  const logout = () => {
    // TODO: logout on authentication server to invalidate token and refresh token
    dispatch(userLogoutAction());
    return Promise.resolve();
  };

  /**
   * Refresh the JWT access token.
   *
   * @returns {Promise<Object>} Result as a Promise.
   */
  const refreshToken = (refreshToken) => {
    return axios
      .post(AUTH_SRV_REFRESH_TOKEN_URL, refreshToken, {
        baseURL: authSrvBaseURL,
        headers: {
          "Content-Type": textContentType,
        },
        // timeout: defaultTimeout
        timeout: 10000,
      })
      .then(
        (response) => {
          const accessToken = response.data.token;
          // Decode JWT token
          try {
            const tokenContent = decodeJWTToken(accessToken);
            dispatch(
              userTokenRefreshedAction(
                accessToken,
                tokenContent.accessTokenExpiry,
                tokenContent.user,
              ),
            );
            return Promise.resolve({
              status: response.status,
              data: {
                accessToken: accessToken,
                accessTokenExpiry: tokenContent.accessTokenExpiry,
                user: tokenContent.user,
              },
            });
          } catch (jwtError) {
            // Invalid token
            dispatch(userSessionExpiredAction());
            return Promise.reject({
              error: {
                code: ERR_AUTH_INVALID_TOKEN,
                message: jwtError.message,
              },
            });
          }
        },
        (error) => {
          // Logout user
          dispatch(userSessionExpiredAction());
          // Reject with error
          if (error.response) {
            switch (error.response.status) {
              case 400:
                // Invalid request data
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_BAD_REQUEST,
                    message: error.response.data,
                  },
                });
              case 401:
                // Invalid or expired refresh token
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_SESSION_EXPIRED,
                    message: error.response.data,
                  },
                });
              default:
                // Unknown error
                return Promise.reject({
                  error: {
                    code: ERR_AUTH_UNKNOWN_ERROR,
                    message: error.response.data,
                  },
                });
            }
          }
          return Promise.reject({
            error: {
              code: ERR_AUTH_UNKNOWN_ERROR,
              message: error.message,
            },
          });
        },
      );
  };

  return {
    registerUser,
    requestAccessCode,
    login,
    logout,
    refreshToken,
  };
}

/**
 * Decode a JWT token and return it's content data as an object.
 *
 * @param {string} token
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
    roles: tokenContent.roles,
  };

  return result;
}
