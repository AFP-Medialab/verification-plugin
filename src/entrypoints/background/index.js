import {
  handleRecordedMessage,
  handleRecorderOnCommit,
  handleSNARecorderChromeMessage,
  initializeMessageHandler,
} from "@/utils/snaRecorderMessageHandler";
import { trackEvent } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
  reverseImageSearchAll,
} from "@Shared/ReverseSearch/reverseSearchUtils";
import { openTabs } from "@Shared/ReverseSearch/utils/openTabUtils";
import { getImgUrl } from "@Shared/ReverseSearch/utils/searchUtils";

export default defineBackground(() => {
  // Browser detection
  const isFirefox = import.meta.env.BROWSER === "firefox";
  const isChrome = import.meta.env.BROWSER === "chrome";
  const browserName = import.meta.env.BROWSER;

  // Initialize the message handler
  initializeMessageHandler();

  const page_name = "popup.html";

  const mediaAssistant = (info) => {
    let url = getImgUrl(info);
    if (url !== "") {
      openTabs({
        url: page_name + "#/app/assistant/" + encodeURIComponent(url),
      });
      // Analytics
      trackEvent("contextMenu", "contextMenuClick", "Assistant", url, "");
    }
  };

  const ocr = (info) => {
    let url = getImgUrl(info);
    if (url !== "") {
      openTabs({
        url: page_name + "#/app/tools/ocr/" + encodeURIComponent(url),
      });
      // Analytics
      trackEvent("contextMenu", "contextMenuClick", "OCR", url, "");
    }
  };

  const thumbnailsSearch = (info) => {
    let url = info.linkUrl;
    if (url !== "" && url.startsWith("http")) {
      openTabs({
        url: page_name + "#/app/tools/thumbnails/" + encodeURIComponent(url),
      });
      // Analytics
      trackEvent(
        "contextMenu",
        "contextMenuClick",
        "YouTubeThumbnails",
        url,
        "",
      );
    }
  };

  const videoReversesearchDBKF = (info) => {
    let search_url =
      "https://weverify-demo.ontotext.com/#!/similaritySearchResults&type=Videos&params=";
    let urlvideo = info.linkUrl;
    if (urlvideo !== "" && urlvideo.startsWith("http")) {
      let url = search_url + encodeURIComponent(urlvideo);
      openTabs({
        url: url,
        selected: false,
      });
      // Analytics
      trackEvent(
        "contextMenu",
        "contextMenuClick",
        "Video Reverse Search - DBKF (beta)",
        url,
      );
    }
  };

  const analysisVideo = (info) => {
    let url = info.linkUrl;
    if (url !== "") {
      openTabs({
        url: page_name + "#/app/tools/Analysis/" + encodeURIComponent(url),
      });
      // Analytics
      trackEvent("contextMenu", "contextMenuClick", "Analysis", url, "");
    }
  };

  const imageMagnifier = (info) => {
    let url = getImgUrl(info);
    if (url !== "") {
      openTabs({
        url: page_name + "#/app/tools/magnifier/" + encodeURIComponent(url),
      });
      // Analytics
      trackEvent("contextMenu", "contextMenuClick", "Magnifier", url, "");
    }
  };

  const imageForensic = (info) => {
    let url = getImgUrl(info);
    if (url !== "") {
      openTabs({
        url: page_name + "#/app/tools/forensic/" + encodeURIComponent(url),
      });
      // Analytics
      trackEvent("contextMenu", "contextMenuClick", "Forensic", url, "");
    }
  };

  function contextClick(info) {
    const { menuItemId } = info;

    switch (menuItemId) {
      // Handle both Chrome and Firefox assistant menu IDs
      case "assistant":
      case "assistant_image":
      case "assistant_video":
        mediaAssistant(info);
        break;
      case "ocr":
        ocr(info);
        break;
      case "thumbnail":
        thumbnailsSearch(info);
        break;
      // Handle both Chrome and Firefox DBKF menu IDs
      case "dbkf":
      case "dbkf_link":
      case "dbkf_video":
        videoReversesearchDBKF(info);
        break;
      case "video_analysis":
        analysisVideo(info);
        break;
      case "magnifier":
        imageMagnifier(info);
        break;
      case "forensic":
        imageForensic(info);
        break;
      case SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_ID:
        reverseImageSearchAll(info);
        break;
      case SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.CONTEXT_MENU_ID:
        reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.NAME);
        break;
      case SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.CONTEXT_MENU_ID:
        reverseImageSearch(
          info,
          SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME,
        );
        break;
      case SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.CONTEXT_MENU_ID:
        reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME);
        break;
      case SEARCH_ENGINE_SETTINGS.BING_SEARCH.CONTEXT_MENU_ID:
        reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME);
        break;
      case SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.CONTEXT_MENU_ID:
        reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME);
        break;
      /*case SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.CONTEXT_MENU_ID:
      reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME);
      break;*/
      case SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.CONTEXT_MENU_ID:
        reverseImageSearch(info, SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.NAME);
        break;
      default:
        console.log(
          `⚠️ ${browserName}: Unknown context menu item: ${menuItemId}`,
        );
        break;
    }
  }

  // Helper function to safely create context menus with error handling
  const createContextMenu = (options) => {
    try {
      browser.contextMenus.create(options, () => {
        if (browser.runtime.lastError) {
          console.error(
            `❌ ${browserName}: Failed to create context menu "${options.id}":`,
            browser.runtime.lastError.message,
          );
        } else {
          // console.log(
          //   `✅ ${browserName}: Successfully created context menu: ${options.id}`,
          // );
        }
      });
    } catch (error) {
      console.error(
        `❌ ${browserName}: Error creating context menu "${options.id}":`,
        error,
      );
    }
  };

  // Register context menu click listener immediately (works for both Chrome and Firefox)
  browser.contextMenus.onClicked.addListener(contextClick);

  // Firefox-specific context menu setup
  const setupFirefoxContextMenus = () => {
    const manifest = browser.runtime.getManifest();
    const extensionName = manifest.name;

    // Clear all existing context menus to prevent duplicates
    browser.contextMenus.removeAll(() => {
      // Create parent menu for InVID tools on images, videos, and links
      createContextMenu({
        id: "invid_parent",
        title: extensionName,
        contexts: ["image", "link", "video"],
      });

      // Firefox needs separate menus for different contexts
      // These work on images and links (for images inside links)
      createContextMenu({
        id: "assistant_image",
        title: "Open with assistant",
        contexts: ["image", "link"],
        parentId: "invid_parent",
      });

      createContextMenu({
        id: "ocr",
        title: "Open with OCR",
        contexts: ["image", "link"],
        parentId: "invid_parent",
      });

      createContextMenu({
        id: "magnifier",
        title: "Image Magnifier",
        contexts: ["image", "link"],
        parentId: "invid_parent",
      });

      createContextMenu({
        id: "forensic",
        title: "Image Forensic",
        contexts: ["image", "link"],
        parentId: "invid_parent",
      });

      // Reverse search parent menu (works on images and links)
      if (SEARCH_ENGINE_SETTINGS && SEARCH_ENGINE_SETTINGS.ALL) {
        createContextMenu({
          id: "reverse_search_parent",
          title: "Reverse Image Search",
          contexts: ["image", "link"],
          parentId: "invid_parent",
        });

        createContextMenu({
          id: SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_ID,
          title: SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_TITLE,
          contexts: ["image", "link"],
          parentId: "reverse_search_parent",
        });

        // Add other search engines under parent menu
        Object.entries(SEARCH_ENGINE_SETTINGS).forEach(([key, setting]) => {
          if (
            key !== "ALL" &&
            setting.CONTEXT_MENU_ID &&
            setting.CONTEXT_MENU_TITLE
          ) {
            createContextMenu({
              id: setting.CONTEXT_MENU_ID,
              title: setting.CONTEXT_MENU_TITLE,
              contexts: ["image", "link"],
              parentId: "reverse_search_parent",
            });
          }
        });
      } else {
        console.error("❌ Firefox: SEARCH_ENGINE_SETTINGS.ALL is undefined!");
      }

      // Video menu under parent
      createContextMenu({
        id: "assistant_video",
        title: "Open with assistant (video)",
        contexts: ["video"],
        parentId: "invid_parent",
      });

      createContextMenu({
        id: "dbkf_video",
        title: "Video Reverse Search - DBKF (beta)",
        contexts: ["video"],
        parentId: "invid_parent",
      });

      // Link-specific menus under parent
      createContextMenu({
        id: "dbkf_link",
        title: "Video Reverse Search - DBKF (beta)",
        contexts: ["link"],
        parentId: "invid_parent",
      });

      createContextMenu({
        id: "thumbnail",
        title: "Youtube thumbnails",
        contexts: ["link"],
        targetUrlPatterns: ["https://www.youtube.com/*"],
        parentId: "invid_parent",
      });
    });
  };

  // Chrome-specific context menu setup
  const setupChromeContextMenus = () => {
    // Clear all existing context menus to prevent duplicates
    browser.contextMenus.removeAll(() => {
      // Chrome can handle combined contexts better
      createContextMenu({
        id: "assistant",
        title: "Open with assistant",
        contexts: ["image", "video"],
      });

      createContextMenu({
        id: "ocr",
        title: "Open with OCR",
        contexts: ["image"],
      });

      createContextMenu({
        id: "magnifier",
        title: "Image Magnifier",
        contexts: ["image"],
      });

      createContextMenu({
        id: "forensic",
        title: "Image Forensic",
        contexts: ["image"],
      });

      createContextMenu({
        id: "dbkf",
        title: "Video Reverse Search - DBKF (beta)",
        contexts: ["link", "video"],
      });

      createContextMenu({
        id: "thumbnail",
        title: "Youtube thumbnails",
        contexts: ["link"],
        targetUrlPatterns: ["https://www.youtube.com/*"],
      });

      // Search engine context menus
      if (SEARCH_ENGINE_SETTINGS && SEARCH_ENGINE_SETTINGS.ALL) {
        createContextMenu({
          id: SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_ID,
          title: SEARCH_ENGINE_SETTINGS.ALL.CONTEXT_MENU_TITLE,
          contexts: ["image"],
        });

        // Add other search engines for Chrome
        Object.entries(SEARCH_ENGINE_SETTINGS).forEach(([key, setting]) => {
          if (
            key !== "ALL" &&
            setting.CONTEXT_MENU_ID &&
            setting.CONTEXT_MENU_TITLE
          ) {
            createContextMenu({
              id: setting.CONTEXT_MENU_ID,
              title: setting.CONTEXT_MENU_TITLE,
              contexts: ["image"],
            });
          }
        });
      } else {
        console.error("❌ Chrome: SEARCH_ENGINE_SETTINGS.ALL is undefined!");
      }
    });
  };

  // Browser-specific initialization
  browser.runtime.onInstalled.addListener(() => {
    console.log(
      `🚀 ${browserName}: onInstalled fired, initializing browser-specific setup...`,
    );

    if (isFirefox) {
      setupFirefoxContextMenus();
    } else if (isChrome) {
      setupChromeContextMenus();
    } else {
      console.log(
        `🤷 Unknown browser: ${browserName}, using Chrome setup as fallback`,
      );
      setupChromeContextMenus();
    }
  });

  browser.contextMenus.onClicked.addListener(contextClick);

  browser.webNavigation.onCommitted.addListener(function (details) {
    handleRecorderOnCommit(details);
  });

  browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      // Check if this is a recorded message from content script bridge
      // TikTok: { prompt: "tiktokCapture", content: {...} }
      // Twitter: GraphQL response with nested data structure
      const isTiktokCapture = request.prompt === "tiktokCapture";
      const isTwitterCapture =
        request.data &&
        // Check for Twitter GraphQL response patterns
        (request.data.entryId ||
          // Or check for entries array which is common in Twitter API
          (Array.isArray(request.data.entries) &&
            request.data.entries.length > 0));

      if (isTiktokCapture || isTwitterCapture) {
        handleRecordedMessage(request);
        return false; // No async response needed
      }

      // Handle other SNA messages from popup/UI
      handleSNARecorderChromeMessage(request, sender, sendResponse);
      return true;
    },
  );

  // Firefox MV3 requires a callback function for runtime.onStartup
  browser.runtime.onStartup.addListener(() => {
    console.log("Extension startup");
  });
});
