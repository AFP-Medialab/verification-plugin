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
