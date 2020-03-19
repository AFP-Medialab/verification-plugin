/**
 * Make authenticated requests hook.
 */

import {useStore } from "react-redux";

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
  const authenticatedRequest = axiosConfig => {
    const userSession = store.getState().userSession;
    const userAuthenticated = userSession && userSession.userAuthenticated;
    const accessToken = userSession && userSession.accessToken;

    // If not authenticated, make a std service call
    if (!userAuthenticated || !accessToken) {
      return axios(axiosConfig);
    }
    
    // TODO: check token expiry and refresh if required before making service call?

    // Inject access token
    if (!axiosConfig.headers) {
      axiosConfig.headers = {}
    }
    axiosConfig.headers["Authorization"] = `Bearer ${accessToken}`;

    // Make service call
    return axios(axiosConfig).catch(error => {
      // If unauthorized
      if (error.response && error.response.status === 401) {
        // Refresh token
        return authenticationAPI.refreshToken().then(response => {
          // TODO: get token (refresh return axios response??)
          const newAccessToken = response.data.accessToken;
          // Update access token header
          axiosConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
          // Make service call with refreshed token
          return axios(axiosConfig);
        }, authErr => {
          return Promise.reject(error);
        })
      }

      // Other errors
      return Promise.reject(error);
    });
  };

  return authenticatedRequest;
};
