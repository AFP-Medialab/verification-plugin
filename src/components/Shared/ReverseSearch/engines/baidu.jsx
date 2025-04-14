import { openNewTabWithUrl } from "../utils/openTabUtils";
import { IMAGE_FORMATS } from "../utils/searchUtils";

export const baiduReverseSearch = (imageObject, isRequestFromContextMenu) => {
  switch (imageObject.imageFormat) {
    case IMAGE_FORMATS.URI:
    case IMAGE_FORMATS.BLOB:
      reverseImageSearchBaidu(imageObject, isRequestFromContextMenu);
      break;
    default:
      throw new Error(
        `[reverseImageSearchBaidu] Error: invalid image format  ${imageObject.imageFormat}`,
      );
  }
};

const reverseImageSearchBaidu = (
  imageObject,
  isRequestFromContextMenu = true,
) => {
  const url = "https://graph.baidu.com/upload";
  const data = new FormData();

  data.append("tn", "pc");
  data.append("from", "pc");
  data.append("range", '{"page_from": "searchIndex"}');
  data.append("image", imageObject.obj);
  if (imageObject.imageFormat === IMAGE_FORMATS.URI) {
    data.append("image_source", "PC_UPLOAD_SEARCH_URL");
  } else {
    data.append("image_source", "PC_UPLOAD_SEARCH_FILE");
  }

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
