import { useSelector } from "react-redux";

// Re-export all core analytics functions (React-free)
export {
  toolEvent,
  trackEvent,
  trackEventAnonymous,
  trackPageView,
  trackPageViewAnonymous,
} from "./MatomoAnalyticsCore";

// React-specific function (uses Redux hooks)
export const getclientId = () => {
  const cookies = useSelector((state) => state.cookies);
  const clientId = cookies !== null ? cookies.id : null;

  return clientId;
};
