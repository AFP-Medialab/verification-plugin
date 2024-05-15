import { openNewTabWithUrl } from "../reverseSearchUtils";

export const reverseImageSearchGoogleFactCheck = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const image_url = encodeURIComponent(imgUrl);
  const tabUrl = `https://toolbox.google.com/factcheck/explorer/search/image_url:${image_url};hl=`; //hl =>  language parameter
  const urlObject = { url: tabUrl };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};
