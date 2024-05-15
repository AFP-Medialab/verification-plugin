import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

export const tineyeReverseSearch = (imageObject, isRequestFromContextMenu) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
      reverseImageSearchTineye(imageObject.obj, isRequestFromContextMenu);
      break;
    default:
      throw new Error(
        `[reverseImageSearchTineye] Error: invalid image format  ${imageObject.imageFormat}`,
      );
  }
};

export const reverseImageSearchTineye = (
  imageUrl,
  isRequestFromContextMenu = true,
) => {
  const urlObject = {
    url: "https://www.tineye.com/search?url=" + encodeURIComponent(imageUrl),
  };

  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};
