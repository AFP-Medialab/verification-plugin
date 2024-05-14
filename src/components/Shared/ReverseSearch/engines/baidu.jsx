import {
  SEARCH_ENGINE_SETTINGS,
  openNewTabWithUrl,
} from "../reverseSearchUtils";

export const reverseImageSearchBaidu = (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  const url = SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.URI;
  const data = new FormData();

  data.append("tn", "pc");
  data.append("from", "pc");
  data.append("range", '{"page_from": "searchIndex"}');
  data.append("image", imgBlob);
  data.append("image_source", "PC_UPLOAD_SEARCH_FILE");

  fetch(url, {
    mode: "cors",
    method: "POST",
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const urlObject = { url: json.data.url };

      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};
