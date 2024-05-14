import {
  SEARCH_ENGINE_SETTINGS,
  openNewTabWithUrl,
} from "../reverseSearchUtils";

export const reverseImageSearchDBKF = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const url =
    SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.URI + encodeURIComponent(imgUrl);
  const urlObject = { url: url };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};
