import { openNewTabWithUrl } from "../reverseSearchUtils";

export const reverseImageSearchYandexURI = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const tabUrl = `https://yandex.com/images/search?url=${imgUrl}&rpt=imageview`;
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
