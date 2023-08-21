/**
 * Make authenticated requests hook.
 */

import { useStore } from "react-redux";

import useAuthenticationAPI from "./useAuthenticationAPI";
import axios from "axios";

/**
 * Authenticated service request hook.
 *
 * @returns
 */
export default function useAuthenticatedRequest() {
  const authenticationAPI = useAuthenticationAPI();
  const store = useStore();

  /**
   * Handle authentication on a service request.
   *
   * @param {Object} axiosConfig
   * @param {*} successHandler
   * @param {*} errorHandler
   * @returns {Promise<Object>} Result as a Promise.
   */
  const authenticatedRequest = async (axiosConfig) => {
    const userSession = store.getState().userSession;
    // const userSession = store.getState().userSession;
    const userAuthenticated = userSession && userSession.userAuthenticated;
    let accessToken = userSession && userSession.accessToken;
    const refreshToken = userSession && userSession.refreshToken;

    // If not authenticated, make a std service call
    if (!userAuthenticated || !accessToken) {
      return axios(axiosConfig);
    }

    // TODO: check token expiry and refresh if required before making service call?

    const now = new Date();
    const needsRefresh = 5 * 60 * 1000;

    if (userSession && userSession.accessTokenExpiry) {
      const diff = new Date(userSession.accessTokenExpiry) - now;
      if (diff < needsRefresh) {
        const response = await authenticationAPI.refreshToken(refreshToken);
        accessToken = response.data.accessToken;
      }
    }

    // Inject access token
    if (!axiosConfig.headers) {
      axiosConfig.headers = {};
    }
    axiosConfig.headers["Authorization"] = `Bearer ${accessToken}`;

    // Make service call
    return axios(axiosConfig).catch((error) => {
      // If unauthorized
      if (error.response && error.response.status === 401) {
        // Refresh token
        return authenticationAPI.refreshToken(refreshToken).then(
          (response) => {
            // TODO: get token (refresh return axios response??)
            const newAccessToken = response.data.accessToken;
            // Update access token header
            axiosConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
            // Make service call with refreshed token
            return axios(axiosConfig);
          },
          (authErr) => {
            console.error(authErr);
            return Promise.reject(error);
          },
        );
      }

      // Other errors
      return Promise.reject(error);
    });
  };

  return authenticatedRequest;
}
