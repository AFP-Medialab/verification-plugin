import {
    localImageGoogleSearch,
    localImageYandexSearch,
    localImageBingSearch,
    localImageBaiduSearch,
    loadImage} from "../components/Shared/ReverseSearch/reverseSearchUtils"
import {toolEvent, getclientId} from "../components/Shared/GoogleAnalytics/MatomoAnalytics"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.contentScriptQuery === "keyframes"){
            fetch((request.url), {
                mode: 'cors',
                method: 'POST',
                body: request.body
            })
            .then(response => {return response.json()})
            .then(json => {sendResponse(json)})
            .catch(errors => {sendResponse(errors)})
        }
    })
chrome.contextMenus.removeAll()
let page_name = 'popup.html';

const rightClickEvent = (toolName, media) => {
    toolEvent("Contextual Menu", "right_click", toolName, toolName, media)
    /*ga('send', 'event',
        'Contextual menu',
        'Contextual menu click on :' + toolName + " for " + media,
        JSON.stringify({
            toolName: toolName,
            media: media,
        })
    );*/
    return true;
}

const get_images = (url) => {
    let video_id = url.split('v=')[1].split('&')[0];
    let img_url = "http://img.youtube.com/vi/%s/%d.jpg";
    let search_url = "https://www.google.com/searchbyimage?sbisrc=cr_1_5_2&image_url="
    let img_arr = ["", "", "", ""];
    for (let count = 0; count < 4; count++) {
        img_arr[count] = search_url + img_url.replace("%s", video_id).replace("%d", count);
        img_url = "http://img.youtube.com/vi/%s/%d.jpg";
    }
    return img_arr;
};

const karmadecaySearch = (info) => {
    // from User JavaScript @https://static.karmadecay.com/js/karma-decay.user.js
    let search_url = "http://karmadecay.com/search?kdtoolver=b1&q=";
    let img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
        let url = search_url + encodeURIComponent(img);
        chrome.tabs.create({ url: url, selected: false });
        //Google analytics
        rightClickEvent("Image Reverse Search Reddit", url)
    }
};

const thumbnailsSearch = (info) => {
    let url = info.linkUrl;
    if (url !== "" &&  url.startsWith("http")) {
        let lst = get_images(url);
        for (let index in lst) {
            chrome.tabs.create({ url: lst[index] });
        }
        // Google analytics
        rightClickEvent("YouTubeThumbnails", url)
    }
};

const getUrlImg = (info) => {
    var query = info.pageUrl;
    if (info.mediaType === "image") {
        return info.srcUrl;
    }
    return query;
};

const analysisVideo = (info) => {
    let url = info.linkUrl;
    if (url !== "") {
        chrome.tabs.create({ url: page_name + "#/app/tools/Analysis/" + encodeURIComponent(url) });
        // Google analytics
        rightClickEvent("Analysis", url)
    }
};

const imageMagnifier =  (info) => {
    let url = getUrlImg(info);
    if (url !== "") {
        chrome.tabs.create({ url: page_name + "#/app/tools/magnifier/" + encodeURIComponent(url) });
        // Google analytics
        rightClickEvent("Magnifier", url)
    }
};

const mediaAssistant = (info) => {
    let url = getUrlImg(info);
    if (url !== "") {
        chrome.tabs.create({ url: page_name + "#/app/assistant/" + encodeURIComponent(url) });
        // Google analytics
        rightClickEvent("Assistant", url)
    }
};

const ocr = (info) => {
    let url = getUrlImg(info);
    if (url !== "") {
        chrome.tabs.create({ url: page_name + "#/app/tools/ocr/" + encodeURIComponent(url) });
        // Google analytics
        rightClickEvent("OCR", url)
    }
};
const imageReversesearch = (info) => {
    let img = getUrlImg(info);
    if(img !== "" ){
        loadImage(img, localImageGoogleSearch)
    }
};

const imageReversesearchDBKF = (info) => {
    let search_url = "http://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Images&params=";
    let img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
        let url = search_url + encodeURIComponent(img);
        chrome.tabs.create({ url: url, selected: false });
        // Google analytics
        rightClickEvent("Image Reverse Search - DBKF (beta)", url)
    }
};

const videoReversesearchDBKF = (info) => {
    let search_url = "https://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Videos&params=";
    let urlvideo = info.linkUrl;
    if (urlvideo !== "" && urlvideo.startsWith("http")) {
        let url = search_url + encodeURIComponent(urlvideo);
        chrome.tabs.create({ url: url, selected: false });
        // Google analytics
        rightClickEvent("Video Reverse Search - DBKF (beta)", url)
    }

};

const imageForensic = (info) => {
    let url = getUrlImg(info);
    if (url !== "" && url.startsWith("http")) {
        chrome.tabs.create({ url: page_name + "#/app/tools/forensic/" + encodeURIComponent(url) });
        // Google analytics
        rightClickEvent("Forensic", url)
    }
};

const imageReversesearchBaidu = (info) => {
    let search_url = "https://image.baidu.com/n/pc_search?queryImageUrl=";
    let img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
        let url = search_url + encodeURIComponent(img) + "&fm=index&uptype=urlsearch";
        chrome.tabs.create({ url: url, selected: false });
        // Google analytics
        rightClickEvent("Image Reverse Search Baidu", url)
    }
    else if(img !== ""){
        loadImage(img, localImageBaiduSearch)
    }
};

const imageReversesearchYandex = (info) => {
    let search_url = "https://yandex.com/images/search?url=";
    let img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
        let url = search_url + encodeURIComponent(img) + "&rpt=imageview";
        chrome.tabs.create({ url: url, selected: false });
        // Google analytics
        rightClickEvent("Image Reverse Search Yandex", url)
    }
    else if(img !== ""){
        loadImage(img, localImageYandexSearch)
    }
};

const imageReversesearchTineye = (info) => {
    let search_url = "https://www.tineye.com/search?url=";
    let img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
        let url = search_url + encodeURIComponent(img);
        chrome.tabs.create({ url: url, selected: false });
        // Google analytics
        rightClickEvent("Image Reverse Search Tineye", url)
    }
};

const imageReversesearchBing = (info) => {
    let search_url = "https://www.bing.com/images/search?q=imgurl:";
    let img = getUrlImg(info);
    if (img !== "" && img.startsWith("http")) {
        let url = search_url + encodeURIComponent(img) + "&view=detailv2&iss=sbi";
        chrome.tabs.create({ url: url, selected: false });
        // Google analytics
        rightClickEvent("Image Reverse Search Bing", url)
    }
    else if(img !== ""){
        loadImage(img, localImageBingSearch)
    }
};

const imageReversesearchAll = (info) =>{
    rightClickEvent("Image Reverse Search All", getUrlImg(info));
    imageReversesearchDBKF(info);
    imageReversesearch(info);
    imageReversesearchBaidu(info);
    imageReversesearchBing(info);
    imageReversesearchTineye(info);
    imageReversesearchYandex(info);
    karmadecaySearch(info);
};

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


function contextClick(info, tab) {
    const { menuItemId } = info
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
            imageReversesearchAll(info)
        break;
        case "dbkf_image":
            imageReversesearchDBKF(info)
        break;
        case "reverse_search_google":
            imageReversesearch(info)
        break;
        case "reverse_search_yandex":
            imageReversesearchYandex(info)
        break;
        case "reverse_search_bing":
            imageReversesearchBing(info)
        break;
        case "reverse_search_tineye":
            imageReversesearchTineye(info)
        break;
        case "reverse_search_baidu":
            imageReversesearchBaidu(info)
        break;
        case "reverse_search_reddit":
            karmadecaySearch(info)
        break;
        default:
            break;
    }
  }
chrome.contextMenus.onClicked.addListener(contextClick)