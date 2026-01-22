import { trackEvent } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
  reverseImageSearchAll,
} from "@Shared/ReverseSearch/reverseSearchUtils";
import { openTabs } from "@Shared/ReverseSearch/utils/openTabUtils";
import { getImgUrl } from "@Shared/ReverseSearch/utils/searchUtils";
import dayjs from "dayjs";
import Dexie from "dexie";
import { JSONPath as jp } from "jsonpath-plus";
import _ from "lodash";

export default defineBackground(() => {
  // Browser detection
  const isFirefox = import.meta.env.BROWSER === "firefox";
  const isChrome = import.meta.env.BROWSER === "chrome";
  const browserName = import.meta.env.BROWSER;

  const db = new Dexie("tweetTest");
  db.version(2).stores({
    tweets: "[id+collectionID], [collectionID+id], tweet",
    tiktoks: "[id+collectionID],[collectionID+id], tiktok",
    collections: "id",
    recording: "id,state",
  });
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
    // Clear all existing context menus to prevent duplicates
    browser.contextMenus.removeAll(() => {
      // Create parent menu for InVID tools on images, videos, and links
      createContextMenu({
        id: "invid_parent",
        title: "InVID/WeVerify",
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

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await browser.tabs.query(queryOptions);
    return tab;
  }

  const PLATFORM_URLS = {
    Tiktok: [".tiktok.com", "/tiktok.com"],
    Twitter: [".x.com", "/x.com"],
  };

  browser.webNavigation.onCommitted.addListener(async (details) => {
    if (details.frameId !== 0) return; //Skip subframes

    const recordingState = await db.recording.get("main");

    if (!recordingState) {
      return;
    }

    let recordingSession = recordingState.state;
    let currentTab = await getCurrentTab();

    // Safety check: ensure currentTab exists
    if (!currentTab || recordingSession === false) {
      return;
    }

    let platforms = recordingState.platforms.split(",");
    let url_test = [];
    platforms.forEach((platform) => url_test.push(PLATFORM_URLS[platform]));
    if (
      !currentTab.url ||
      !url_test.flat().some((url) => currentTab.url.includes(url))
    ) {
      return;
    }
    try {
      await browser.scripting.executeScript({
        target: { tabId: currentTab.id, allFrames: true },
        function: () => {
          let pluginId = browser.runtime.id;
          let s = document.createElement("script");
          s.dataset.params = pluginId;
          s.src = browser.runtime.getURL("content-scripts/inject.js");
          (document.head || document.documentElement).appendChild(s);
        },
      });
    } catch (e) {
      throw Error(e);
    }
  });

  const TWEET_PROPERTY_PATHS = {
    id: { path: "rest_id", default: "" },
    username: {
      path: "core.user_results.result.core.screen_name",
      default: "",
    },
    display_name: { path: "core.user_results.result.core.name", default: "" },
    account_created: {
      path: "core.user_results.result.core.created_at",
      default: "",
    },
    followers: {
      path: "core.user_results.result.legacy.followers_count",
      default: "",
    },
    total_posts: {
      path: "core.user_results.result.legacy.statuses_count",
      default: "",
    },
    text: { path: "legacy.full_text", default: "" },
    replying_to: { path: "legacy.in_reply_to_screen_name", default: false },
    isQuote: { path: "legacy.is_quote_status", default: false },
    retweeted: { path: "legacy.retweeted", default: false },
    links: { path: "legacy.entities.urls", default: "" },
    mentions: { path: "legacy.entities.user_mentions", default: "" },
    hashtags: { path: "legacy.entities.hashtags", default: "" },
    date: { path: "legacy.created_at", default: "" },
    likes: { path: "legacy.favorite_count", default: 0 },
    quotes: { path: "legacy.quote_count", default: 0 },
    retweets: { path: "legacy.retweet_count", default: 0 },
    replies: { path: "legacy.reply_count", default: 0 },
    views: { path: "views.count", default: 0 },
  };

  const getTweetsFromDB = async () => {
    const dbTweetsRaw = await db.tweets.toArray();
    const dbTweetsResults = dbTweetsRaw.map((rawTweet) => ({
      collID: rawTweet.collectionID,
      res: jp({ json: rawTweet, path: "$..tweet_results" })[0],
    }));

    return dbTweetsResults.map((tweet) => {
      if (!tweet.res || _.isEmpty(tweet.res)) return;
      let tweetInfo =
        tweet.res.result.tweet || tweet.res.result || tweet.res.tweet;
      let reformatedTweet = {};
      reformatedTweet.collectionID = tweet.collID;
      Object.keys(TWEET_PROPERTY_PATHS).forEach(
        (k) =>
          (reformatedTweet[k] = _.get(
            tweetInfo,
            TWEET_PROPERTY_PATHS[k].path,
            TWEET_PROPERTY_PATHS[k].default,
          )),
      );

      reformatedTweet.views = parseInt(reformatedTweet.views);

      reformatedTweet.mentions.length >= 1
        ? (reformatedTweet.mentions = reformatedTweet.mentions
            .flat(1)
            .map((obj) => (obj.screen_name ? obj.screen_name : ""))
            .filter((obj) => obj.length > 1))
        : {};

      reformatedTweet.hashtags.length >= 1
        ? (reformatedTweet.hashtags = reformatedTweet.hashtags
            .flat(1)
            .map((obj) => (obj.text ? obj.text : ""))
            .filter((obj) => obj.length > 1))
        : {};

      reformatedTweet.links.length >= 1
        ? (reformatedTweet.links = reformatedTweet.links
            .flat(1)
            .map((obj) => (obj.expanded_url ? obj.expanded_url : ""))
            .filter((obj) => obj.length > 1))
        : {};
      reformatedTweet.imageLink =
        jp({
          json: tweetInfo,
          path: "$.legacy.extended_entities..media_url_https",
        })[0] || "None";

      reformatedTweet.video =
        jp({
          json: tweetInfo,
          path: "$.legacy.extended_entities..video_info.variants",
        })[0]?.filter((x) => x && x.url && x.url.includes(".mp4"))[0]?.url ||
        "None";
      reformatedTweet.tweetLink =
        "https://x.com/" +
        reformatedTweet.username +
        "/status/" +
        reformatedTweet.id;
      return reformatedTweet;
    });
  };

  const TIKTOK_PROPERTY_PATHS = {
    username: {
      path: "author.uniqueId",
      default: "",
    },
    date: {
      path: "createTime",
      default: "",
    },
    hashtags: {
      path: "textExtra",
      default: "",
    },
    soundID: {
      path: "music.id",
      default: "",
    },
    soundAuthor: {
      path: "music.authorName",
      default: "",
    },
    soundTitle: {
      path: "music.title",
      default: "",
    },
    likes: {
      path: "stats.diggCount",
      default: 0,
    },
    replies: {
      path: "stats.commentCount",
      default: 0,
    },
    views: {
      path: "stats.playCount",
      default: 0,
    },
    shares: {
      path: "stats.shareCount",
      default: 0,
    },
    reposts: {
      path: "statsV2.repostCount",
      default: 0,
    },
    text: {
      path: "desc",
      default: "",
    },
    isAd: {
      path: "isAd",
      default: false,
    },
  };

  const getTikToksFromDB = async () => {
    const rawTiktoks = await db.tiktoks.toArray();
    const reformatedTiktoks = rawTiktoks.map((rawTiktok) => {
      let reformatedTiktok = {};
      reformatedTiktok.id = rawTiktok.id;
      reformatedTiktok.collectionID = rawTiktok.collectionID;
      Object.keys(TIKTOK_PROPERTY_PATHS).forEach(
        (k) =>
          (reformatedTiktok[k] = _.get(
            rawTiktok.tiktok,
            TIKTOK_PROPERTY_PATHS[k].path,
            TIKTOK_PROPERTY_PATHS[k].default,
          )),
      );
      reformatedTiktok.date = dayjs
        .unix(parseInt(reformatedTiktok.date))
        .format("YYYY-MM-DDTHH:mm:ss");
      reformatedTiktok.hashtags.length >= 1
        ? (reformatedTiktok.hashtags = reformatedTiktok.hashtags
            .map((v) => "#" + v.hashtagName)
            .filter((v) => v.length > 2))
        : {};
      reformatedTiktok.reposts = parseInt(reformatedTiktok.reposts);
      return reformatedTiktok;
    });
    return reformatedTiktoks;
  };

  browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      (async (request) => {
        try {
          if (request.prompt === "getTweets") {
            const tweetResponse = await getTweetsFromDB();
            sendResponse(tweetResponse);
          } else if (request.prompt === "getTiktoks") {
            const tiktokResp = await getTikToksFromDB();
            sendResponse(tiktokResp);
          } else if (request.prompt === "deleteAll") {
            await db.delete().then(() => db.open());
            sendResponse({ success: true });
          } else if (request.prompt === "deleteCollection") {
            if (request.source === "twitter") {
              await db.tweets
                .where("[collectionID+id]")
                .between(
                  [request.collectionId, Dexie.minKey],
                  [request.collectionId, Dexie.maxKey],
                  true,
                  true,
                )
                .delete();
            } else if (request.source === "tiktok") {
              await db.tiktoks
                .where("[collectionID+id]")
                .between(
                  [request.collectionId, Dexie.minKey],
                  [request.collectionId, Dexie.maxKey],
                  true,
                  true,
                )
                .delete();
            }
            sendResponse({ success: true });
          } else if (request.prompt === "getRecordingInfo") {
            const currentCollections = await db.collections.toArray();
            if (!currentCollections.includes("Default Collection")) {
              await db.collections.put({ id: "Default Collection" });
            }
            const updatedCollections = await db.collections.toArray();

            const currentStatus = await db.recording.toArray();

            if (currentStatus.length === 0) {
              await db.recording.put({ id: "main", state: false });
            }

            const updatedStatus = await db.recording.toArray();

            sendResponse({
              recording: updatedStatus,
              collections: updatedCollections,
            });
          } else if (request.prompt === "addCollection") {
            await db.collections.put({ id: request.newCollectionName });
            sendResponse({ success: true });
          } else if (request.prompt === "stopRecording") {
            await db.recording.put({ id: "main", state: false, platforms: "" });
            sendResponse({ success: true });
          } else if (request.prompt === "startRecording") {
            await db.recording.put({
              id: "main",
              state: request.currentCollectionName,
              platforms: request.platforms.join(","),
            });
            sendResponse({ success: true });
          } else if (request.prompt === "getRawCollection") {
            if (request.platform === "twitter") {
              const x = await db.tweets
                .where("[collectionID+id]")
                .between(
                  [request.collectionId, Dexie.minKey],
                  [request.collectionId, Dexie.maxKey],
                  true,
                  true,
                )
                .toArray();
              sendResponse({ data: x });
            } else if (request.platform === "tiktok") {
              const x = await db.tiktoks
                .where("[collectionID+id]")
                .between(
                  [request.collectionId, Dexie.minKey],
                  [request.collectionId, Dexie.maxKey],
                  true,
                  true,
                )
                .toArray();
              sendResponse({ data: x });
            }
          } else if (request.prompt === "addToCollection") {
            const data = request.data;
            if (request.platform === "twitter") {
              await Promise.all(
                data.map(async (t) =>
                  db.tweets.add({
                    id: t.id,
                    collectionID: request.collectionId,
                    tweet: t.tweet,
                  }),
                ),
              );
            } else if (request.platform === "tiktok") {
              await Promise.all(
                data.map(async (t) =>
                  db.tiktoks.add({
                    id: t.id,
                    collectionID: request.collectionId,
                    tiktok: t.tiktok,
                  }),
                ),
              );
            }
            sendResponse({ done: "ok" });
          } else {
            // Handle unknown prompts
            sendResponse({ error: "Unknown prompt" });
          }
        } catch (error) {
          console.error("Error in message listener:", error);
          sendResponse({ error: error.message });
        }
      })(request);
      return true;
    },
  );

  browser.runtime.onMessageExternal.addListener(async function (request) {
    const entryIds = jp({ json: request, path: "$..entryId" });
    const session = await db.recording.toArray();

    const currentSession = session[0].state;
    if (currentSession === false) {
      return;
    }
    if (request.prompt === "tiktokCapture") {
      request.content.itemList?.forEach(async (item) => {
        await db.tiktoks.put({
          id: item.id,
          collectionID: currentSession,
          tiktok: item,
        });
      });
      //Tiktok responses can have item details in either data or itemList field
      request.content.data
        ?.map((x) => x.item)
        .forEach(async (item) => {
          await db.tiktoks.put({
            id: item.id,
            collectionID: currentSession,
            tiktok: item,
          });
        });
      return;
    }

    if (jp({ json: request, path: "$..entryId" }).length > 0) {
      for (let entryId of entryIds) {
        let current = jp({
          json: request,
          path: `$..entries[?(@.entryId=="${entryId}")]`,
        });
        jp({
          json: request,
          path: `$..entries[?(@.entryId=="${entryId}")]..tweet_results`,
        }).length > 0
          ? await db.tweets.put({
              id: entryId,
              collectionID: currentSession,
              tweet: current[0],
            })
          : {};
      }
    }
  });

  // Firefox MV3 requires a callback function for runtime.onStartup
  browser.runtime.onStartup.addListener(() => {
    console.log("Extension startup");
  });
});
