export const Timeout = (time) => {
  let controller = new AbortController();
  setTimeout(() => controller.abort(), time * 1000);
  return controller;
};

export const isValidUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== "string") {
    return false;
  }
  try {
    new URL(urlStr);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
