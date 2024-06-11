import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

export const yandexReverseSearch = (imageObject, isRequestFromContextMenu) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
      reverseImageSearchYandexURI(imageObject.obj, isRequestFromContextMenu);
      break;
    case IMAGE_FORMATS.BLOB:
      reverseImageSearchYandex(imageObject.obj, isRequestFromContextMenu);
      break;
    default:
      throw new Error(
        `[reverseImageSearchYandex] Error: invalid image format  ${imageObject.imageFormat}`,
      );
  }
};

export const reverseImageSearchYandexURIV2 = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const url = `https://yandex.com/images-apphost/image-download?url=${encodeURIComponent(
    imgUrl,
  )}&images_avatars_size=preview&cbird=111&images_avatars_namespace=images-cbir`;
  fetch(url, {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json, text/javascript, */*; q=0.01",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const cbirId = json.cbir_id;
      const fullUrl = `https://yandex.com/images/search?cbir_id=${cbirId}&rpt=imageview`;
      const urlObject = { url: fullUrl };

      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    });
};

export const reverseImageSearchYandexURI = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const tabUrl = `https://yandex.com/images/search?url=${encodeURIComponent(
    imgUrl,
  )}&rpt=imageview`;
  const urlObject = { url: tabUrl };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};
/**
 * Search with local image
 * @param {*} imgBlob
 * @param {*} isRequestFromContextMenu
 */
export const reverseImageSearchYandex = (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  const url = `https://yandex.com/images/touch/search?rpt=imageview&format=json&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}`;

  const formData = new FormData();

  formData.append("upfile", imgBlob);

  fetch(url, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json, text/javascript, */*; q=0.01",
    },
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const block = json.blocks[0];
      const originalImageUrl = block.params.originalImageUrl;
      const cbirId = block.params.url;
      const fullUrl = `https://yandex.com/images/search?rpt=imageview&url=${originalImageUrl}&${cbirId}`;

      const urlObject = { url: fullUrl };

      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    })
    .catch(() => {
      //console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};
