import { KNOWN_LINKS, TOOLS_CATEGORIES } from "@/constants/tools";

export const filterAssistantResults = (
  urlType,
  contentType,
  userInput,
  scrapeResult,
) => {
  let videoList = [];
  let imageList = [];
  let linkList = [];
  let urlText = null;
  let urlTextHtmlMap = null;
  let textLang = null;
  let collectedComments = null;

  switch (urlType) {
    case KNOWN_LINKS.YOUTUBE:
    case KNOWN_LINKS.YOUTUBESHORTS:
    case KNOWN_LINKS.LIVELEAK:
    case KNOWN_LINKS.VIMEO:
    case KNOWN_LINKS.DAILYMOTION:
      videoList = [userInput];
      break;
    case KNOWN_LINKS.TIKTOK:
      videoList = scrapeResult.videos;
      break;
    case KNOWN_LINKS.INSTAGRAM:
      if (scrapeResult.videos.length === 1) {
        videoList = [scrapeResult.videos[0]];
      } else {
        imageList = [scrapeResult.images[0]];
      }
      break;
    case KNOWN_LINKS.FACEBOOK:
      if (scrapeResult.videos.length === 0) {
        imageList = scrapeResult.images;
      } else {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.TWITTER:
      if (scrapeResult.images.length > 0) {
        imageList = scrapeResult.images;
      }
      if (scrapeResult.videos.length > 0) {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.SNAPCHAT:
    case KNOWN_LINKS.BLUESKY:
      if (scrapeResult.images.length > 0) {
        imageList = scrapeResult.images;
      }
      if (scrapeResult.videos.length > 0) {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.MASTODON:
    case KNOWN_LINKS.TELEGRAM:
    case KNOWN_LINKS.VK:
    case KNOWN_LINKS.BBC:
      if (scrapeResult.images.length > 0) {
        imageList = scrapeResult.images;
      }
      if (scrapeResult.videos.length > 0) {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.MISC:
      if (contentType) {
        contentType === TOOLS_CATEGORIES.IMAGE
          ? (imageList = [userInput])
          : (videoList = [userInput]);
      } else {
        imageList = scrapeResult.images;
        // filter generic loading placeholder that some scraped pages include
        imageList = imageList.filter(
          (imageUrl) => !imageUrl.includes("loader.svg"),
        );
        videoList = scrapeResult.videos;
      }
      break;
    default:
      break;
  }

  if (scrapeResult) {
    urlText = scrapeResult.text;
    textLang = scrapeResult.lang;
    linkList = scrapeResult.links
      .sort()
      .filter((value, index, array) => array.indexOf(value) === index);
    urlTextHtmlMap = scrapeResult.text_html_mapping;

    if ("collected_comments" in scrapeResult) {
      collectedComments = scrapeResult.collected_comments;
    }
  }

  return {
    urlText,
    textLang,
    videoList,
    imageList,
    linkList,
    urlTextHtmlMap,
    collectedComments,
  };
};
