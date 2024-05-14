import { openNewTabWithUrl } from "../reverseSearchUtils";

export const reverseRemoteGoogleLens = (
  url,
  isRequestFromContextMenu = true,
) => {
  const tabUrl = `https://lens.google.com/uploadbyurl?url=${url}`;
  const urlObject = { url: tabUrl };
  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};
export const reverseImageSearchGoogleLens = (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  const url = `https://lens.google.com/upload?ep=ccm&s=&st=${Date.now()}`;
  const formData = new FormData();
  //console.log("imgBlob ", imgBlob)
  formData.append("encoded_image", imgBlob);
  fetch(url, {
    referrer: "",
    mode: "cors",
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      var tabUrl = body.match(/(?<=<meta .*url=)(.*)(?=")/)[1];
      // @ts-ignore
      tabUrl = decodeURIComponent(tabUrl.replaceAll("&amp;", "&"));
      //console.log(tabUrl)
      const urlObject = { url: "https://lens.google.com" + tabUrl };

      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    })
    .catch(() => {
      //console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};
