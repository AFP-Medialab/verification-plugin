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
    if (event !== undefined && event !== null) {
      //console.log("Track event");
      if (analytics) {
        //go to analytics
        trackEvent(category, action, name, url, client_id, history, uid);
      } else {
        trackEventAnonymous(category, action, name, url, history);
      }
    }
  }, [event]);
};
