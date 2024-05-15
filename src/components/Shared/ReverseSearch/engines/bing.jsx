import { openNewTabWithUrl } from "../utils/openTabUtils";
import {
  IMAGE_FORMATS,
  isBase64,
  getLocalImageFromSourcePath,
} from "../utils/searchUtils";

export const bingReverseSearch = (imageObject, isRequestFromContextMenu) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
      reverseImageSearchBingURI(imageObject.obj, isRequestFromContextMenu);
      break;
    case IMAGE_FORMATS.BLOB:
    case IMAGE_FORMATS.B64:
      reverseImageSearchBing(imageObject.obj, isRequestFromContextMenu);
      break;
    default:
      throw new Error(
        `[reverseImageSearchBing] Error: invalid image format ${imageObject.imageFormat}`,
      );
  }
};
export const reverseImageSearchBingURI = async (
  url,
  isRequestFromContextMenu = true,
) => {
  const encoded_url = encodeURIComponent(url);
  const tabUrl = `https://www.bing.com/images/searchbyimage?cbir=ssbi&imgurl=${encoded_url}`;
  const urlObject = { url: tabUrl };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};

export const reverseImageSearchBing = async (
  blob,
  isRequestFromContextMenu = true,
) => {
  // let image = content.substring(content.indexOf(",") + 1);
  // let image = content;
  const image = isBase64(blob)
    ? blob
    : await getLocalImageFromSourcePath(blob, IMAGE_FORMATS.B64);
  // const image = await blobToBase64(blob);

  let url =
    "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file";

  const formData = new FormData();
  formData.append("data-imgurl", "");
  formData.append("cbir", "sbi");
  formData.append("imageBin", image);
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      const urlObject = { url: response.url };

      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    })
    .catch(() => {
      //console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};
