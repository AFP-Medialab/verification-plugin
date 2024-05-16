import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

export const googleFactCheckReverseSearch = (
  imageObject,
  isRequestFromContextMenu,
) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
      reverseImageSearchGoogleFactCheck(
        imageObject.obj,
        isRequestFromContextMenu,
      );
      break;
    case IMAGE_FORMATS.BLOB:
      localImageSearch(imageObject.obj, isRequestFromContextMenu);
      break;
    default:
      throw new Error(
        `[reverseImageSearchGoogleFactCheck] Error: invalid image format  ${imageObject.imageFormat}`,
      );
  }
};

const reverseImageSearchGoogleFactCheck = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const image_url = encodeURIComponent(imgUrl);
  const tabUrl = `https://toolbox.google.com/factcheck/explorer/search/image_url:${image_url};hl=`; //hl =>  language parameter
  const urlObject = { url: tabUrl };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};

const localImageSearch = (blob, isRequestFromContextMenu) => {
  const url = "https://toolbox.google.com/factcheck/explorer/uploads";
  //init upload

  const initHeader = new Headers();
  initHeader.append("X-Goog-Upload-Command", "start");
  initHeader.append("X-Goog-Upload-Protocol", "resumable");
  const initPost = {
    method: "POST",
    headers: initHeader,
  };
  const uploadHeader = new Headers();
  uploadHeader.append("X-Goog-Upload-Command", "upload, finalize");
  uploadHeader.append("X-Goog-Upload-Offset", "0");
  const uploadPost = {
    method: "POST",
    headers: uploadHeader,
    body: blob,
  };
  fetch(url, initPost)
    .then((response) => {
      return response.headers;
    })
    .then((headers) => {
      const uploadURL = headers.get("X-Goog-Upload-URL");
      //console.log("headers ", uploadURL);
      fetch(uploadURL, uploadPost)
        .then((response) => response.text())
        .then((result) => {
          const redirectURL = `https://toolbox.google.com/factcheck/explorer/search/${result};hl=`;
          const urlObject = { url: redirectURL };
          openNewTabWithUrl(urlObject, isRequestFromContextMenu);
        });
    });
};
