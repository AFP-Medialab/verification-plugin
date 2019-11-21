// If your extension doesn't need a background script, just leave this file empty
/*
* Set here your own Tracking ID
*/
import history from "../components/utility/History/History";

let trackingID = "UA-XXXXXXXX-Y";
// let page_name = 'invid.html';
let page_name = 'popup.html';


function get_images(url){
    let video_id = url.split('v=')[1].split('&')[0];
    let img_url = "http://img.youtube.com/vi/%s/%d.jpg";
    let search_url = "https://www.google.com/searchbyimage?&image_url="
    let img_arr = ["","","",""];
    for (let count = 0; count < 4; count++){
        img_arr[count] = search_url + img_url.replace("%s", video_id).replace("%d", count);
        img_url = "http://img.youtube.com/vi/%s/%d.jpg";
    }
    return img_arr;
}

const karmadecaySearch = function(word){
    // from User JavaScript @https://static.karmadecay.com/js/karma-decay.user.js
    let search_url = "http://karmadecay.com/search?kdtoolver=b1&q=";
    let url = getUrlImg(word);
    if (url !== "") {
        window.chrome.tabs.create({ url: search_url + url});
        //Google analytics
        //ga("send", "event", "Contextual Menu - Reddit", "click", url);
    }
}

const thumbnailsSearch = function(word){
    let checkLink = "https://www.youtube.com/watch?v="
    let url = word.linkUrl;
    if (url != "") {
        let lst = get_images(url);
        for (let index in lst){
            window.chrome.tabs.create({url:lst[index]});
        }
        // Google analytics
        //ga("send", "event", "ContextualMenu - ThumbnailYouTube", "click", url);
    }
};

function getUrlImg(word) {
    if (word.srcUrl)
        return String(word.srcUrl);
    return String(word.linkUrl);
}

const analysisVideo = function(word){
    let url = word.linkUrl;
    if (url !== "") {
        window.chrome.tabs.create({url:page_name+"#/app/tools/analysis/" + encodeURIComponent(url)});
        // Google analytics
        //ga("send", "event", "ContextualMenu - AnalysisVideo", "click", url);
    }
};

const imageMagnifier = function(word){
    let url = getUrlImg(word);
    if (url != "") {
        window.chrome.tabs.create({url:page_name+"#/app/tools/magnifier/" + encodeURIComponent(url)});
        // Google analytics
        //ga("send", "event", "ContextualMenu - Magnifier", "click", url);
    }
};

const imageReversesearch = function(word){
    let search_url = "https://www.google.com/searchbyimage?image_url=";
    let url = getUrlImg(word);

    if (url != ""){
        window.chrome.tabs.create({url:search_url + url});
        // Google analytics
        //ga("send", "event", "ContextualMenu - Google", "click", url);
    }
};

const imageForensic = function(word){
    let url = getUrlImg(word);
    if (url !== ""){
        window.chrome.tabs.create({url:page_name+"#/app/tools/forensic/" + encodeURIComponent(url)});
        // Google analytics
        //ga("send", "event", "ContextualMenu - Forensic", "click", url);
    }
};

const imageReversesearchBaidu = function(word){
    let search_url = "https://image.baidu.com/n/pc_search?queryImageUrl=";
    let url = getUrlImg(word);
    if (url != ""){
        window.chrome.tabs.create({url:search_url + url + "&fm=index&uptype=urlsearch"});
        // Google analytics
        //ga("send", "event", "ContextualMenu - Baidu", "click", url);
    }
};

const imageReversesearchYandex = function(word){
    let search_url = "https://yandex.com/images/search?url=";
    let url = getUrlImg(word);
    if (url != ""){
        window.chrome.tabs.create({url:search_url + url + "&rpt=imageview"});
        // Google analytics
        //ga("send", "event", "ContextualMenu - Yandex", "click", url);
    }
};

const imageReversesearchTineye = function(word){
    let search_url = "https://www.tineye.com/search?url=";
    let url = getUrlImg(word);
    if (url != "") {
        window.chrome.tabs.create({url:search_url + url});
        // Google analytics
        //ga("send", "event", "ContextualMenu - Tineye", "click", url);
    }
};

const imageReversesearchBing = function(word){
    let search_url = "https://www.bing.com/images/search?q=imgurl:";
    let url = getUrlImg(word);
    if (url != "") {
        window.chrome.tabs.create({url:search_url + url + "&view=detailv2&iss=sbi"});
        // Google analytics
        //ga("send", "event", "ContextualMenu - Bing", "click", url);
    }
};

const imageReversesearchAll = function(word){
    imageReversesearch(word);
    imageReversesearchBaidu(word);
    imageReversesearchBing(word);
    imageReversesearchTineye(word);
    imageReversesearchYandex(word);
    karmadecaySearch(word);
};

window.chrome.contextMenus.create({
    title: "Youtube thumbnails reverse search",
    contexts:["link", "video"],
    onclick: thumbnailsSearch,
    targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*"]
});

window.chrome.contextMenus.create({
    title: "Video contextual analysis",
    contexts:["link", "video"],
    onclick: analysisVideo,
    targetUrlPatterns: ["https://www.youtube.com/*", "https://youtu.be/*", "https://www.facebook.com/*/videos/*", "https://www.facebook.com/*", "https://twitter.com/*"]
});

window.chrome.contextMenus.create({
    title: "Image Magnifier",
    contexts:["image", "link"],
    onclick: imageMagnifier,
});

window.chrome.contextMenus.create({
    title: "Image Forensic",
    contexts:["image"],
    onclick: imageForensic,
});

window.chrome.contextMenus.create({
    title: "Image Reverse Search - ALL",
    contexts:["image", "link"],
    onclick: imageReversesearchAll,
});

window.chrome.contextMenus.create({
    title: "Image Reverse Search - Google",
    contexts:["image", "link"],
    onclick: imageReversesearch,
});

window.chrome.contextMenus.create({
    title: "Image Reverse Search - Yandex",
    contexts:["image", "link"],
    onclick: imageReversesearchYandex,
});

window.chrome.contextMenus.create({
    title: "Image Reverse Search - Bing",
    contexts:["image"],
    onclick: imageReversesearchBing,
});

window.chrome.contextMenus.create({
    title: "Image Reverse Search - Tineye",
    contexts:["image", "link"],
    onclick: imageReversesearchTineye,
});

window.chrome.contextMenus.create({
    title: "Image Reverse Search - Baidu",
    contexts:["image", "link"],
    onclick: imageReversesearchBaidu,
});

window.chrome.contextMenus.create({
    title: "Image Reverse Search - Reddit",
    contexts:["image"],
    onclick: karmadecaySearch,
});
