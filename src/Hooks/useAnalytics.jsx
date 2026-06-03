import { useEffect } from "react";
import { useSelector } from "react-redux";

import {
  trackEvent,
  trackEventAnonymous,
  trackPageView,
  trackPageViewAnonymous,
} from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { history } from "@Shared/History/History";

export const useTrackPageView = (path, client_id, uid, toolName) => {
  const analytics = useSelector((state) => state.cookies.analytics);
  useEffect(() => {
    //console.log("general page view");
    if (analytics) {
      //go to analytics
      trackPageView(path, client_id, history, uid);
    } else {
      trackPageViewAnonymous(path, history);
    }
  }, [toolName]);
};

export const useTrackEvent = (
  category,
  action,
  name,
  url,
  client_id,
  event,
  uid = "",
) => {
  const analytics = useSelector((state) => state.cookies.analytics);
  //console.log("event tracked ", event);
  useEffect(() => {
    if (!event || !url) return;
    //console.log("Track event");
    if (analytics) {
      //go to analytics
      trackEvent(category, action, name, url, client_id, history, uid);
    } else {
      trackEventAnonymous(category, action, name, url, history);
    }
  }, [event, url]);
};

/**
 * This hook can be use for tracking when nothing change taht can be observed by a useEffect
 * @returns function
 */
export const useTrackEventClick = () => {
  const analytics = useSelector((state) => state.cookies.analytics);

  const track = (category, action, name, url, client_id, uid = "") => {
    if (analytics) {
      trackEvent(category, action, name, url, client_id, history, uid);
    } else {
      trackEventAnonymous(category, action, name, url, history);
    }
  };

  return track;
};
