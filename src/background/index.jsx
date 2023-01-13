import {
    localImageGoogleSearch,
    localImageYandexSearch,
    localImageBingSearch,
    localImageBaiduSearch,
    loadImage
} from "../components/Shared/ReverseSearch/reverseSearchUtils"

let page_name = 'popup.html';

const rightClickEvent = (toolName, media) => {
    return true
}

const getUrlImg = (info) => {
    var query = info.pageUrl;
    if (info.mediaType === "image") {
        return info.srcUrl;
    }
    return query;
};

const mediaAssistant = (info) => {
    let url = getUrlImg(info);
    if (url !== "") {
        chrome.tabs.create({
            url: page_name + "#/app/assistant/" + encodeURIComponent(url)
        });
        // Google analytics
        rightClickEvent("Assistant", url)
    }
};

const ocr = (info) => {
    let url = getUrlImg(info);
    if (url !== "") {
        chrome.tabs.create({
            url: page_name + "#/app/tools/ocr/" + encodeURIComponent(url)
        });
        // Google analytics
        rightClickEvent("OCR", url)
    }
};

const thumbnailsSearch = (info) => {
    let url = info.linkUrl;
    if (url !== "" && url.startsWith("http")) {
        let lst = get_images(url);
        for (let index in lst) {
            chrome.tabs.create({
                url: lst[index]
            });
        }
        // Google analytics
        rightClickEvent("YouTubeThumbnails", url)
    }
};

const videoReversesearchDBKF = (info) => {
    let search_url = "https://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Videos&params=";
    let urlvideo = info.linkUrl;
    if (urlvideo !== "" && urlvideo.startsWith("http")) {
        let url = search_url + encodeURIComponent(urlvideo);
        chrome.tabs.create({
            url: url,
            selected: false
        });
        // Google analytics
        rightClickEvent("Video Reverse Search - DBKF (beta)", url)
    }

};

const analysisVideo = (info) => {
    let url = info.linkUrl;
    if (url !== "") {
        chrome.tabs.create({
            url: page_name + "#/app/tools/Analysis/" + encodeURIComponent(url)
        });
        // Google analytics
        rightClickEvent("Analysis", url)
    }
};

const imageMagnifier = (info) => {
    let url = getUrlImg(info);
    if (url !== "") {
        chrome.tabs.create({
            url: page_name + "#/app/tools/magnifier/" + encodeURIComponent(url)
        });
        // Google analytics
        rightClickEvent("Magnifier", url)
    }
};

const imageForensic = (info) => {
    let url = getUrlImg(info);
    if (url !== "" && url.startsWith("http")) {
        chrome.tabs.create({
            url: page_name + "#/app/tools/forensic/" + encodeURIComponent(url)
        });
        // Google analytics
        rightClickEvent("Forensic", url)
    }
};

const imageReversesearchDBKF = (info) => {
    let search_url = "http://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Images&params=";
    let img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
        let url = search_url + encodeURIComponent(img);
        chrome.tabs.create({
            url: url,
            selected: false
        });
        // Google analytics
        rightClickEvent("Image Reverse Search - DBKF (beta)", url)
    }
};

const imageReversesearch = (info) => {
    let img = getUrlImg(info);
    if (img !== "") {
        loadImage(img, localImageGoogleSearch)
    }
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "assistant",
        title: "Open with assistant",
        contexts: ["image", "video"],
    })
    chrome.contextMenus.create({
        id: "ocr",
        title: "Open with OCR",
        contexts: ["image"]}
    )
    chrome.contextMenus.create({
        id: "thumbnail",
        title: "Youtube thumbnails reverse search",
        contexts: ["link", "video"],
        targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*"]
    })
    chrome.contextMenus.create({
        id: "dbkf",
        title: "Video Reverse Search - DBKF (beta)",
        contexts: ["link", "video"],
    })
    chrome.contextMenus.create({
        id: "video_analysis",
        title: "Video contextual Analysis",
        contexts: ["link", "video"],
        targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*", "https://www.facebook.com/*/videos/*", "https://www.facebook.com/*", "https://twitter.com/*"]
    })
    chrome.contextMenus.create({
        id: "magnifier",
        title: "Image Magnifier",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "forensic",
        title: "Image Forensic",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "reverse_search_all",
        title: "Image Reverse Search - ALL",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "dbkf_image",
        title: "Image Reverse Search - DBKF (beta)",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "reverse_search_google",
        title: "Image Reverse Search - Google",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "reverse_search_yandex",
        title: "Image Reverse Search - Yandex",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "reverse_search_bing",
        title: "Image Reverse Search - Bing",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "reverse_search_tineye",
        title: "Image Reverse Search - Tineye",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "reverse_search_baidu",
        title: "Image Reverse Search - Baidu",
        contexts: ["image"],
    })
    chrome.contextMenus.create({
        id: "reverse_search_reddit",
        title: "Image Reverse Search - Reddit",
        contexts: ["image"],
    })
});

function contextClick(info, tab) {
    const {
        menuItemId
    } = info
    switch (menuItemId) {
        case "assistant":
            mediaAssistant(info)
            break;
        case "ocr":
            ocr(info)
            break;
        case "thumbnail":
            thumbnailsSearch(info)
            break;
        case "dbkf":
            videoReversesearchDBKF(info)
            break;
        case "video_analysis":
            analysisVideo(info)
            break;
        case "magnifier":
            imageMagnifier(info)
            break;
        case "forensic":
            imageForensic(info)
            break;
        case "reverse_search_all":
            //imageReversesearchAll(info)
            break;
        case "dbkf_image":
            imageReversesearchDBKF(info)
            break;
        case "reverse_search_google":
            imageReversesearch(info)
            break;
        case "reverse_search_yandex":
            //imageReversesearchYandex(info)
            break;
        case "reverse_search_bing":
            //imageReversesearchBing(info)
            break;
        case "reverse_search_tineye":
            //imageReversesearchTineye(info)
            break;
        case "reverse_search_baidu":
            //imageReversesearchBaidu(info)
            break;
        case "reverse_search_reddit":
            //karmadecaySearch(info)
            break;
        default:
            break;
    }
}

chrome.contextMenus.onClicked.addListener(contextClick)