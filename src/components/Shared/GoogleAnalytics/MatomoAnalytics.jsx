import { useSelector } from "react-redux";

const matomo_site = import.meta.env.VITE_MATOMO_SITE;

export const getclientId = () => {
  const cookies = useSelector((state) => state.cookies);
  const clientId = cookies !== null ? cookies.id : null;

  return clientId;
};

export const toolEvent = (
  action_name,
  category,
  action,
  name,
  url,
  client_id,
  uid = "",
) => {
  console.log("action_name ", action_name);
  let actions = {
    action_name: action_name,
    client_id: client_id,
    uid: uid,
    url: url,
    event: {
      e_c: category,
      e_a: action,
      e_n: name,
    },
  };
  matomoCall(actions);
};

export const trackEvent = (
  category,
  action,
  name,
  url,
  client_id,
  history = null,
  uid = "",
) => {
  const pathname =
    history && history.location ? history.location.pathname : null;

  let actions;

  if (!uid) {
    actions = {
      action_name: pathname,
      client_id: client_id,
      url: url,
      event: {
        e_c: category,
        e_a: action,
        e_n: name,
      },
    };
  } else {
    actions = {
      action_name: pathname,
      client_id: client_id,
      uid: uid,
      url: url,
      event: {
        e_c: category,
        e_a: action,
        e_n: name,
      },
    };
  }

  matomoCall(actions);
};
export const trackEventAnonymous = (
  category,
  action,
  name,
  url,
  history = null,
) => {
  trackEvent(category, action, name, url, null, history, "");
};

export const trackPageView = (
  path,
  client_id,
  history = undefined,
  uid = "",
) => {
  let pathname = "";
  if (typeof history !== "undefined" && path !== null) {
    history.push(path.pathname);
    pathname = history.location.pathname;
  }

  let actions;
  if (!uid) {
    actions = {
      action_name: pathname,
      client_id: client_id,
      url: "urn:" + pathname,
    };
  } else {
    actions = {
      action_name: pathname,
      client_id: client_id,
      uid: uid,
      url: "urn:" + pathname,
    };
  }

  matomoCall(actions);
};

export const trackPageViewAnonymous = (path, history = undefined) => {
  trackPageView(path, null, history, "");
};

const resolution = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

function matomoCall(actions) {
  if (actions === undefined) {
    console.error("[matomoCall][Error] undefined parameter");
    return;
  }

  let innerWidth;
  let innerHeight;

  if (typeof window !== "undefined")
    ({ innerWidth, innerHeight } = resolution());

  const url_params = new URLSearchParams();

  url_params.append("idsite", matomo_site);
  url_params.append("rec", 1);
  url_params.append("apiv", 1);
  url_params.append("action_name", actions.action_name);
  url_params.append("url", actions.url);
  url_params.append("_id", actions.client_id);
  url_params.append("_cvar", JSON.stringify(actions.cvar));

  if (actions.event) {
    url_params.append("e_c", actions.event.e_c);
    url_params.append("e_a", actions.event.e_a);
    url_params.append("e_n", actions.event.e_n);
  }

  if (actions.uid) url_params.append("uid", actions.uid);

  url_params.append("cookie", 1);

  if (innerWidth && innerHeight)
    url_params.append("res", innerWidth + "x" + innerHeight);

  const url = import.meta.env.VITE_MATOMO_URL;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: url_params,
  });
}
