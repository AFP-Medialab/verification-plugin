import { useSelector } from "react-redux";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";

/**
 * Custom hook for Hiya analytics tracking
 * Handles all analytics events related to Hiya audio processing
 *
 * @param {string} url - The audio URL being processed
 * @returns {void} This hook has no return value, it only triggers side effects
 *
 * @example
 * ```javascript
 * import { useHiyaAnalytics } from './hooks/useHiyaAnalytics';
 *
 * const HiyaResults = ({ url }) => {
 *   useHiyaAnalytics(url);
 *   // ... rest of component
 * };
 * ```
 */
export const useHiyaAnalytics = (url) => {
  const session = useSelector((state) => state.userSession);
  const client_id = getclientId();
  const uid = session?.user?.id || null;

  useTrackEvent(
    "submission",
    "loccus_detection",
    "Hiya audio processing",
    url,
    client_id,
    url,
    uid,
  );
};
