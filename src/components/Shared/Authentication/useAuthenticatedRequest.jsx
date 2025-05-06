/**
 * Make authenticated requests hook.
 */
import { useStore } from "react-redux";

import axios from "axios";

import useAuthenticationAPI from "./useAuthenticationAPI";

/**
 * Authenticated service request hook.
 *
 * @returns
 */
export default function useAuthenticatedRequest() {
  const authenticationAPI = useAuthenticationAPI();
  const store = useStore();

  return (axiosConfig) => {
    const userSession = store.getState().userSession;
    const userAuthenticated = userSession && userSession.userAuthenticated;
    const accessToken = userSession && userSession.accessToken;
    const refreshToken = userSession && userSession.refreshToken;

    // If not authenticated, make a std service call
    if (!userAuthenticated || !accessToken) {
      return axios(axiosConfig);
    }

    // TODO: check token expiry and refresh if required before making service call?

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
}
