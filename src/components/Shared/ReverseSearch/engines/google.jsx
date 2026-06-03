import { Timeout } from "@/components/Shared/Utils/URLUtils";

import { openNewTabWithUrl } from "../utils/openTabUtils";

export const reverseImageSearchGoogle = (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  const chromeSbiSrc = "Google Chrome 107.0.5304.107 (Official) Windows";

  let url = "https://www.google.com/searchbyimage/upload";
  const formData = new FormData();
  formData.append("encoded_image", imgBlob);
  formData.append("image_url", "");
  formData.append("sbisrc", chromeSbiSrc);

  fetch(url, {
    referrer: "",
    mode: "cors",
    method: "POST",
    body: formData,
    signal: Timeout(10).signal,
  })
    .then((response) => {
      const urlObject = { url: response.url };

      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    })
    .catch(() => {
      //console.error(error);
    });
  // .finally(() => {
  //   document.body.style.cursor = "default";
  // });
};
