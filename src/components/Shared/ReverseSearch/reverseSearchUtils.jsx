import { Timeout } from "../Utils/URLUtils";

const IMAGE_FORMATS = {
  BLOB: "BLOB",
  URI: "URI",
  B64: "B64",
};

export const SEARCH_ENGINE_SETTINGS = {
  // To open all search engines at once
  ALL: {
    NAME: "All",
    CONTEXT_MENU_ID: "reverse_search_all",
    CONTEXT_MENU_TITLE: "Image Reverse Search - ALL",
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
    CONTEXT_MENU_TITLE: "",
    URI: `https://lens.google.com/upload?ep=ccm&s=&st=${Date.now()}`,
    IMAGE_FORMAT: IMAGE_FORMATS.BLOB,
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
    IMAGE_FORMAT: IMAGE_FORMATS.B64,
  },
  TINEYE_SEARCH: {
    NAME: "Tineye",
    CONTEXT_MENU_ID: "reverse_search_tineye",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Tineye",
    URI: "https://www.tineye.com/search?url=",
    IMAGE_FORMAT: IMAGE_FORMATS.B64,
  },
  REDDIT_SEARCH: {
    NAME: "Reddit",
    CONTEXT_MENU_ID: "reverse_search_reddit",
    CONTEXT_MENU_TITLE: "Image Reverse Search - Reddit",
    URI: "http://karmadecay.com/search?kdtoolver=b1&q=",
    IMAGE_FORMAT: IMAGE_FORMATS.B64,
  },
};

const fetchImage = async (url) => {
  const response = await fetch(url, {
    mode: "no-cors",
  });
  const blob = await response.blob();

  return blob;
};

const blobToBase64 = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.error = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
};

export const loadImageContent = async (imgUrl, reverseSearchFunction) => {
  const imgBlob = await fetchImage(imgUrl);

  reverseSearchFunction(imgBlob);
};

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
    console.log("failed to load image");
    if (document !== undefined) {
      document.body.style.cursor = "default";
    }
    img.src = src;
  };
};

export const localImageBaiduSearch = (content) => {
  let url = "https://graph.baidu.com/upload";
  const blob = content;
  const data = new FormData();
  data.append("tn", "pc");
  data.append("from", "pc");
  data.append("range", '{"page_from": "searchIndex"}');
  data.append("image", blob);
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
      chrome.tabs.create({ url: json.data.url });
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};

export const localImageGoogleLens = (content) => {
  // const blob = b64toBlob(content, "image/png");
  const blob = content;
  let url = `https://lens.google.com/upload?ep=ccm&s=&st=${Date.now()}`;
  const formData = new FormData();
  formData.append("encoded_image", blob);
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
      const tabUrl = body.match(/<meta .*URL=(https?:\/\/.*)"/)[1];
      chrome.tabs.create({ url: tabUrl });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};

export const localImageYandexSearch = (content) => {
  const url =
    'https://yandex.com/images/touch/search?rpt=imageview&format=json&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}';
  const blob = content;
  const formData = new FormData();

  formData.append("upfile", blob);

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
      //console.log("response ", json)
      let block = json.blocks[0];
      //console.log("block ", block)
      let originalImageUrl = block.params.originalImageUrl;
      //console.log("originalImageUrl : ", originalImageUrl)
      let cbirId = block.params.url;
      let fullUrl = `https://yandex.com/images/search?rpt=imageview&url=${originalImageUrl}&${cbirId}`;
      chrome.tabs.create({ url: fullUrl });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};

// const getGoogleSearchFormData = () => {
//   const chromeSbiSrc = "Google Chrome 107.0.5304.107 (Official) Windows";
//   const formData = new FormData();
//   formData.append("encoded_image", blob);
//   formData.append("image_url", "");
//   formData.append("sbisrc", chromeSbiSrc);
// };

export const localImageGoogleSearch = (content) => {
  const chromeSbiSrc = "Google Chrome 107.0.5304.107 (Official) Windows";
  const blob = content;
  let url = SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.URI;
  const formData = new FormData();
  formData.append("encoded_image", blob);
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
      chrome.tabs.create({ url: response.url });
    })
    .catch((error) => {
      console.error(error);
      //try google lens
      localImageGoogleLens(content);
    });
  // .finally(() => {
  //   document.body.style.cursor = "default";
  // });
};

export const localImageBingSearch = async (content) => {
  // let image = content.substring(content.indexOf(",") + 1);
  // let image = content;
  const image = await blobToBase64(content);

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
      chrome.tabs.create({ url: response.url });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      // document.body.style.cursor = "default";
    });
};


export const getImgUrl = (info) => {
  var query = info.pageUrl;
  if (info.mediaType === "image") {
    return info.srcUrl;
  }
  return query;
};

export const imageReverseSearch = (info, searchEngine) => {
  const imgUrl = getImgUrl(info);

  if (imgUrl === "") {
    // TODO: Error handling
    throw new Error("[imageReversesearch] Error: Empty URL string");
  }

  if (searchEngine === SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.NAME)
    loadImageContent(imgUrl, localImageGoogleSearch);
  else if (searchEngine === SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME)
    loadImageContent(imgUrl, localImageYandexSearch);
  else if (searchEngine === SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME)
    loadImageContent(imgUrl, localImageBaiduSearch);
  else if (searchEngine === SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME) {
    // TODO: move all the logic in one single function
    const search_url = "https://www.bing.com/images/search?q=imgurl:";
    if (imgUrl !== "" && imgUrl.startsWith("http")) {
      const url =
        search_url + encodeURIComponent(imgUrl) + "&view=detailv2&iss=sbi";
      chrome.tabs.create({ url: url });
    } else if (imgUrl !== "") {
      loadImageContent(imgUrl, localImageBingSearch);
    }
  } else if (searchEngine === SEARCH_ENGINE_SETTINGS.REDDIT_SEARCH.NAME) {
    // TODO
  } else if (searchEngine === SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME) {
    // TODO
  }
};
