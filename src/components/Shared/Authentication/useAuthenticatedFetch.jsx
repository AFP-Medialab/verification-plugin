import { useStore } from "react-redux";

import useAuthenticationAPI from "./useAuthenticationAPI";

/**
 * Authenticated fetch hook for streaming requests (SSE, duplex).
 * Mirrors useAuthenticatedRequest but wraps the native fetch API.
 */
export default function useAuthenticatedFetch() {
  const authenticationAPI = useAuthenticationAPI();
  const store = useStore();

  return async (url, options = {}) => {
    const userSession = store.getState().userSession;
    const userAuthenticated = userSession?.userAuthenticated;
    const accessToken = userSession?.accessToken;
    const refreshToken = userSession?.refreshToken;

    const buildOptions = (token) => ({
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!userAuthenticated || !accessToken) {
      return fetch(url, options);
    }

    const response = await fetch(url, buildOptions(accessToken));

    if (response.status === 401 && refreshToken) {
      try {
        const refreshResponse =
          await authenticationAPI.refreshToken(refreshToken);
        const newAccessToken = refreshResponse.data.accessToken;
        return fetch(url, buildOptions(newAccessToken));
      } catch {
        return response;
      }
    }

    return response;
  };
}
