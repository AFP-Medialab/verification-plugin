import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

export const dbkfReverseSearch = (imageObject, isRequestFromContextMenu) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
      reverseImageSearchDBKF(imageObject.obj, isRequestFromContextMenu);
      break;
    default:
      throw new Error(
        `[reverseImageSearchDBKF] Error: invalid image format  ${imageObject.imageFormat}`,
      );
  }
};

export const reverseImageSearchDBKF = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const url =
    "http://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Images&params=" +
    encodeURIComponent(imgUrl);
  const urlObject = { url: url };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};
