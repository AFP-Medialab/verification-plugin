import {
  openNewTabWithUrl,
  SEARCH_ENGINE_SETTINGS,
} from "../reverseSearchUtils";

export const reverseImageSearchTineye = (
  imageUrl,
  isRequestFromContextMenu = true,
) => {
  const urlObject = {
    url:
      SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.URI + encodeURIComponent(imageUrl),
  };

  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};
