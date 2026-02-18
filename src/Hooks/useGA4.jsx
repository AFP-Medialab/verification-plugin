export const GAUtils = (event_name) => {
  const GACode = import.meta.env.VITE_GOOGLE_ANALYTICS_KEY;
  const url =
    "https://www.google-analytics.com/mp/collect?measurement_id=" +
    GACode +
    "&api_secret=Akub_0F8QyWH9x_-mf_mGg";

  let data = {
    client_id: "veraplugin.76",
    events: [
      {
        name: event_name,
        params: {},
      },
    ],
  };

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: data,
  });
};
