import { Timeout } from "../Utils/URLUtils";
import { Buffer } from "buffer";

const IMAGE_FORMATS = {
  BLOB: "BLOB",
  URI: "URI",
  B64: "B64",
};

class ImageObject {
  constructor(obj, imageFormat) {
    this.obj = obj;

    if (
      typeof imageFormat !== "string" ||
      !Object.values(IMAGE_FORMATS).includes(imageFormat)
    ) {
      throw new Error(
        "[ImageObject.constructor] Error: Image format is not a string",
      );
    }

    if (!Object.values(IMAGE_FORMATS).includes(imageFormat)) {
      throw new Error(
        "[ImageObject.constructor] Error: Image format not supported",
      );
    }

    this.imageFormat = imageFormat;
  }
}

export const SEARCH_ENGINE_SETTINGS = {
  // To open all search engines at once
  ALL: {
    NAME: "All",
    CONTEXT_MENU_ID: "reverse_search_all",
    CONTEXT_MENU_TITLE: "Image Reverse Search - ALL",
  },
  DBKF_SEARCH: {
    NAME: "DBKF",
    CONTEXT_MENU_ID: "reverse_search_dbkf",
    CONTEXT_MENU_TITLE: "Image Reverse Search - DBKF (beta)",
    URI: "http://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Images&params=",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
  },
  GOOGLE_SEARCH: {
    NAME: "Google",
    CONTEXT_MENU_ID: "reverse_search_google",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Google",
    URI: "https://www.google.com/searchbyimage/upload",
    IMAGE_FORMAT: IMAGE_FORMATS.BLOB,
  },
  GOOGLE_LENS_SEARCH: {
    NAME: "Google Lens",
    CONTEXT_MENU_ID: "reverse_search_google_lens",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Google Lens",
    URI: `https://lens.google.com/upload?ep=ccm&s=&st=${Date.now()}`,
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
    IMAGE_FORMAT_LOCAL: IMAGE_FORMATS.BLOB,
  },
  BAIDU_SEARCH: {
    NAME: "Baidu",
    CONTEXT_MENU_ID: "reverse_search_baidu",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Baidu",
    URI: "https://graph.baidu.com/upload",
    IMAGE_FORMAT: IMAGE_FORMATS.BLOB,
  },
  YANDEX_SEARCH: {
    NAME: "Yandex",
    CONTEXT_MENU_ID: "reverse_search_yandex",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Yandex",
    URI: 'https://yandex.com/images/touch/search?rpt=imageview&format=json&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}',
    IMAGE_FORMAT: IMAGE_FORMATS.BLOB,
  },
  BING_SEARCH: {
    NAME: "Bing",
    CONTEXT_MENU_ID: "reverse_search_bing",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Bing",
    URI: "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file",
    URI_LOCAL:
      "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
    IMAGE_FORMAT_LOCAL: IMAGE_FORMATS.B64,
  },
  TINEYE_SEARCH: {
    NAME: "Tineye",
    CONTEXT_MENU_ID: "reverse_search_tineye",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Tineye",
    URI: "https://www.tineye.com/search?url=",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
  },
  REDDIT_SEARCH: {
    NAME: "Reddit",
    CONTEXT_MENU_ID: "reverse_search_reddit",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Reddit",
    URI: "http://karmadecay.com/search?kdtoolver=b1&q=",
    IMAGE_FORMAT: IMAGE_FORMATS.URI,
  },
};

const fetchImage = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new ImageObject(blob, IMAGE_FORMATS.BLOB);
};

/**
 * Wrapper function to open a new tab from the context menus or from the app
 * @param {} url The url object
 * @param {boolean} isRequestFromContextMenu
 */
const openNewTabWithUrl = async (url, isRequestFromContextMenu) => {
  if (isRequestFromContextMenu) openTabsSearch(url);
  else await chrome.tabs.create(url);
};

/**
 * Returns true if the string is in the base64 format, else false
 * @param {string} str
 * @returns {boolean}
 */
const isBase64 = (str) => {
  // get rid of edge cases
  if (typeof str !== "string") return false;

  if (!str.includes(",")) return false;

  const strArr = str.split(",");
  const b64marker = strArr[0];
  const b64Str = strArr[1];

  // From https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
  // test the b64 marker
  if (/^data:image\/\w+;base64/.test(b64marker) === false) {
    return false;
  }

  if (Buffer.from(b64Str, "base64").toString("base64") !== b64Str) {
    return false;
  }

  return true;
};

const b64toBlobde = (base64String, contentType = "") => {
  let image = base64String.substring(base64String.indexOf(",") + 1);
  const byteCharacters = atob(image);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);
  const blob = new Blob([byteArray], { type: contentType });
  return new ImageObject(blob, IMAGE_FORMATS.BLOB);
};

const b64toBlob = (content, contentType = "", sliceSize = 512) => {
  let image = content.substring(content.indexOf(",") + 1);
  const byteCharacters = atob(image);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return new ImageObject(blob, IMAGE_FORMATS.BLOB);
};

// const blobToBase64 = async (blob) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result);
//     reader.error = (err) => reject(err);
//     reader.readAsDataURL(blob);
//   });
// };

export const loadImage = (src, reverseSearchFunction) => {
  window.body.style.cursor = "wait";
  if (document !== undefined) document.body.style.cursor = "wait";
  let img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    // Get raw image data
    reverseSearchFunction(canvas.toDataURL("image/png"));
    canvas.remove();
  };
  img.onerror = (error) => {
    console.log("failed to load image", error);
    if (document !== undefined) {
      document.body.style.cursor = "default";
    }
    img.src = src;
  };
};

export const reverseImageSearchDBKF = (
  imgUrl,
  isRequestFromContextMenu = true,
) => {
  const url =
    SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.URI + encodeURIComponent(imgUrl);

  const urlObject = { url: url };

  openNewTabWithUrl(urlObject, isRequestFromContextMenu);

  // Google analytics
  // rightClickEvent("Image Reverse Search - DBKF (beta)", url);
};

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
      tabUrl = decodeURIComponent(tabUrl.replaceAll("&amp;", "&"));
      //console.log(tabUrl)
      const urlObject = { url: "https://lens.google.com" + tabUrl };

      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    })
    .catch((error) => {
      //console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};

export const reverseImageSearchYandex = (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  const url =
    'https://yandex.com/images/touch/search?rpt=imageview&format=json&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}';

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
    .catch((error) => {
      //console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};

export const reverseImageSearchGoogle = (
  imgBlob,
  isRequestFromContextMenu = true,
) => {
  const chromeSbiSrc = "Google Chrome 107.0.5304.107 (Official) Windows";

  let url = SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.URI;
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
    .catch((error) => {
      //console.error(error);
    });
  // .finally(() => {
  //   document.body.style.cursor = "default";
  // });
};

export const reverseImageSearchBing = async (
  blob,
  isRequestFromContextMenu = true,
) => {
  // let image = content.substring(content.indexOf(",") + 1);
  // let image = content;

  const image = blob;
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
    .catch((error) => {
      //console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};

const reverseImageSearchTineye = (
  imageUrl,
  isRequestFromContextMenu = true,
) => {
  const urlObject = {
    url:
      SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.URI + encodeURIComponent(imageUrl),
  };

  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};

const reverseImageSearchReddit = (
  imageUrl,
  isRequestFromContextMenu = true,
) => {
  const urlObject = {
    url:
      SEARCH_ENGINE_SETTINGS.REDDIT_SEARCH.URI + encodeURIComponent(imageUrl),
  };

  openNewTabWithUrl(urlObject, isRequestFromContextMenu);
};

export const getImgUrl = (info) => {
  if (typeof info === "string" && info.startsWith("http")) {
    return info;
  }

  const query = info.pageUrl;
  if (info.mediaType === "image") {
    return info.srcUrl;
  }
  return query;
};

export const getLocalImageFromSourcePath = async (src, imgFormat) => {
  if (!Object.values(IMAGE_FORMATS).includes(imgFormat)) {
    throw new Error(
      `[getLocalImageFromSourcePath] Error: Image format ${imgFormat} not supported`,
    );
  }

  let img = new Image();
  img.crossOrigin = "anonymous";
  // console.log(src);
  // console.log(src.toDataURL());

  const blob = await (await fetch(src)).blob();

  // const url = URL.createObjectURL(blob);

  if (imgFormat === IMAGE_FORMATS.BLOB) {
    return new ImageObject(blob, IMAGE_FORMATS.BLOB);
  }
  if (imgFormat === IMAGE_FORMATS.B64) {
    let reader = new FileReader();

    reader.readAsBinaryString(blob);

    reader.onloadend = () => {
      const base64String = reader.result;

      if (!base64String) {
        throw new Error(
          `[getLocalImageFromSourcePath] Error: Invalid type for base64string`,
        );
      }

      // console.log(base64String);

      return new ImageObject(base64String, IMAGE_FORMATS.B64);
    };

    img.src = src;
  }
};

/**
 * Wrapper to retrieve a blob from url, b64 input, or local image path
 * @param {any} info
 * @returns {Promise<ImageObject>}
 */
export const getBlob = async (info) => {
  if (!info) {
    throw new Error(`[getBlob] Error : bad parameter`);
  }

  const isImgUrl = typeof getImgUrl(info) === "string";

  const isb64 = isBase64(info);

  // console.log(info);
  // console.log(isImgUrl);
  // console.log(isb64);

  // console.log(getImgUrl(info));

  let imgBlob;

  if (
    typeof info === "string" &&
    (info.startsWith("http") || info.startsWith("blob"))
  ) {
    imgBlob = await fetchImage(info);
  } else if (isImgUrl && !isb64) {
    imgBlob = await fetchImage(getImgUrl(info));
  } else if (isb64) {
    imgBlob = b64toBlob(info, "image/jpeg");
  } else {
    imgBlob = await getLocalImageFromSourcePath(
      getImgUrl(info),
      IMAGE_FORMATS.BLOB,
    );
  }

  if (!imgBlob) {
    throw new Error(`[getBlob] Error: imgBlob is not defined`);
  }

  return imgBlob;
};

const getSearchEngineFromName = (searchEngineName) => {
  if (typeof searchEngineName !== "string" || !searchEngineName) {
    throw new Error("[getSearchEngineFromName] Error: Invalid string");
  }

  for (const searchEngine of Object.values(SEARCH_ENGINE_SETTINGS)) {
    if (searchEngineName === searchEngine.NAME) {
      return searchEngine;
    }
  }

  throw new Error(
    `[getSearchEngineFromName] Error: Search Engine not found for searchEngineName ${searchEngineName}`,
  );
};

/**
 * Description
 * @param {any} info
 * @param {boolean} isImgUrl
 * @param {string} searchEngineName
 * @returns {Promise<ImageObject>}
 */
const retrieveImgObjectForSearchEngine = async (info, searchEngineName) => {
  const searchEngine = getSearchEngineFromName(searchEngineName);

  var imgFormat =
    typeof info === "string" && info.startsWith("http")
      ? searchEngine.IMAGE_FORMAT
      : searchEngine.IMAGE_FORMAT_LOCAL;
  imgFormat = imgFormat === undefined ? searchEngine.IMAGE_FORMAT : imgFormat;

  if (imgFormat === IMAGE_FORMATS.URI) {
    return new ImageObject(getImgUrl(info), IMAGE_FORMATS.URI);
  }

  if (imgFormat === IMAGE_FORMATS.BLOB) {
    return await getBlob(info);
  }

  if (imgFormat === IMAGE_FORMATS.B64) {
    if (isBase64(info)) {
      return new ImageObject(info, IMAGE_FORMATS.B64);
    } else {
      if (src) return await getLocalImageFromSourcePath(src, IMAGE_FORMATS.B64);
      else return await getLocalImageFromSourcePath(info, IMAGE_FORMATS.B64);
    }
    // TODO: local image
  }

  throw new Error(
    `[retrieveImgObjectForSearchEngine] Error: Image format ${searchEngine.IMAGE_FORMAT} not supported`,
  );
};

export const reverseImageSearch = async (
  info,
  isImgUrl,
  searchEngineName,
  isRequestFromContextMenu = true,
) => {
  const imageObject = await retrieveImgObjectForSearchEngine(
    info,
    searchEngineName,
  );

  if (searchEngineName === SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchDBKF(imageObject.obj, isRequestFromContextMenu);
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchGoogle(imageObject.obj, isRequestFromContextMenu);
  } else if (
    searchEngineName === SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME
  ) {
    //console.log("DEBUG image ", imageObject);
    if (
      imageObject.imageFormat ==
      SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.IMAGE_FORMAT_LOCAL
    )
      reverseImageSearchGoogleLens(imageObject.obj, isRequestFromContextMenu);
    else if (
      imageObject.imageFormat ==
      SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.IMAGE_FORMAT
    ) {
      reverseRemoteGoogleLens(imageObject.obj, isRequestFromContextMenu);
    }
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchYandex(imageObject.obj, isRequestFromContextMenu);
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchBaidu(imageObject.obj, isRequestFromContextMenu);
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.BING_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    // TODO: move all the logic in a single function
    const search_url = "https://www.bing.com/images/search?q=imgurl:";

    if (
      typeof imageObject.obj === "string" &&
      imageObject.obj !== "" &&
      imageObject.obj.startsWith("http")
    ) {
      const url =
        search_url +
        encodeURIComponent(imageObject.obj) +
        "&view=detailv2&iss=sbi";

      const urlObject = { url: url };
      openNewTabWithUrl(urlObject, isRequestFromContextMenu);
    } else if (imageObject.obj !== "") {
      const b64Img = await retrieveImgObjectForSearchEngine(
        info,
        searchEngineName,
      );

      // console.log(b64Img);

      let url =
        "https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIHMP&sbifnm=weverify-local-file";
      const formData = new FormData();
      formData.append("data-imgurl", "");
      formData.append("cbir", "sbi");
      formData.append("imageBin", b64Img.obj);
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          openTabsSearch({ url: response.url });
        })
        .catch((error) => {
          //console.error(error);
        });
    }
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.REDDIT_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.REDDIT_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchReddit(imageObject.obj, isRequestFromContextMenu);
  } else if (searchEngineName === SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME) {
    if (
      imageObject.imageFormat !==
      SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.IMAGE_FORMAT
    ) {
      throw new Error(`[reverseImageSearch] Error: invalid image format`);
    }

    reverseImageSearchTineye(imageObject.obj, isRequestFromContextMenu);
  } else {
    throw new Error("[reverseImageSearch] Error: Search Engine not supported");
  }
};

export const reverseImageSearchAll = async (
  info,
  isImageUrl,
  isRequestFromContextMenu = true,
) => {
  let promises = [];

  for (const searchEngineSetting of Object.values(SEARCH_ENGINE_SETTINGS)) {
    if (searchEngineSetting.NAME === SEARCH_ENGINE_SETTINGS.ALL.NAME) {
      continue;
    }
    promises.push(
      reverseImageSearch(
        info,
        isImageUrl,
        searchEngineSetting.NAME,
        isRequestFromContextMenu,
      ),
    );
  }
  await Promise.all(promises);
};
export const openTabs = (url) => {
  chrome.tabs.create(url, (createdTab) => {
    chrome.tabs.onUpdated.addListener(async function _(tabId) {
      if (tabId === createdTab.id) {
        chrome.tabs.onUpdated.removeListener(_);
      } else {
        await chrome.tabs.get(tabId, async () => {
          if (!chrome.runtime.lastError) {
            //console.log("tab exist ", tabId)
            await chrome.tabs.remove(tabId, () => {
              if (!chrome.runtime.lastError) {
                //nothing todo
              }
              //chrome.tabs.onUpdated.removeListener(_);
            });
          }
        });
      }
    });
  });
};

const openTabsSearch = (url) => {
  chrome.tabs.create(url, (createdTab) => {
    chrome.tabs.onUpdated.addListener(async function _(tabId, info, tab) {
      let pending_url = ns(createdTab.pendingUrl);
      let tab_url = ns(tab.url);
      if (tabId === createdTab.id && pending_url === tab_url) {
        //console.log("remove .... listerner", tabId);
        chrome.tabs.onUpdated.removeListener(_);
      } else {
        if (pending_url === tab_url) {
          //console.log("remove id ", tabId);
          await chrome.tabs.get(tabId, async () => {
            if (!chrome.runtime.lastError) {
              //console.log("tab exist ", tabId)
              await chrome.tabs.remove(tabId, async () => {
                //nothing todo
                if (!chrome.runtime.lastError) {
                  //nothing todo
                }
              });
            } else {
              //nothing todo
            }
          });
        }
      }
    });
  });
};

function ns(url) {
  let domain = new URL(url);
  domain = domain.hostname.replace("www.", "");
  return domain;
}
