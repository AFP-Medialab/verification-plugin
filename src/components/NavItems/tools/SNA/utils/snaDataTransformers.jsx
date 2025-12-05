import dayjs from "dayjs";
import { JSONPath as jp } from "jsonpath-plus";
import _ from "lodash";

export const TWEET_PROPERTY_PATHS = {
  id: { path: "rest_id", default: "" },
  username: { path: "core.user_results.result.core.screen_name", default: "" },
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

export const TIKTOK_PROPERTY_PATHS = {
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

/**
 * Transforms an array property by flattening, mapping to a specific key, and filtering
 * @param {Array} array - The array to transform
 * @param {string|Function} mapper - Property key or function to extract value
 * @param {number} minLength - Minimum length to filter by
 * @returns {Array} Transformed array or empty array if input is invalid
 */
export const transformArrayProperty = (array, mapper, minLength = 1) => {
  if (!array || array.length < 1) return [];

  const mapFn =
    typeof mapper === "function" ? mapper : (obj) => obj[mapper] || "";

  return array
    .flat(1)
    .map(mapFn)
    .filter((obj) => obj.length > minLength);
};

/**
 * Extract all properties from tweet data using TWEET_PROPERTY_PATHS
 * @param {Object} tweetInfo - Raw tweet data
 * @returns {Object} Object with all extracted properties
 */
export const extractTweetProperties = (tweetInfo) => {
  const properties = {};
  Object.keys(TWEET_PROPERTY_PATHS).forEach((key) => {
    properties[key] = _.get(
      tweetInfo,
      TWEET_PROPERTY_PATHS[key].path,
      TWEET_PROPERTY_PATHS[key].default,
    );
  });
  return properties;
};

/**
 * Transform tweet array properties (mentions, hashtags, links)
 * @param {Object} tweet - Tweet object with raw array properties
 * @returns {Object} Tweet object with transformed array properties
 */
export const transformTweetArrayProperties = (tweet) => {
  return {
    ...tweet,
    mentions: transformArrayProperty(
      tweet.mentions,
      (obj) => obj.screen_name || "",
    ),
    hashtags: transformArrayProperty(tweet.hashtags, (obj) => obj.text),
    links: transformArrayProperty(tweet.links, (obj) => obj.expanded_url || ""),
  };
};

/**
 * Extract media links from tweet
 * @param {Object} tweetInfo - Raw tweet data
 * @returns {Object} Object with imageLink and video properties
 */
export const extractTweetMedia = (tweetInfo) => {
  const imageLink =
    jp({
      json: tweetInfo,
      path: "$.legacy.extended_entities..media_url_https",
    })[0] || "None";

  const videoVariants =
    jp({
      json: tweetInfo,
      path: "$.legacy.extended_entities..video_info.variants",
    })[0] || [];

  const video =
    videoVariants.filter((x) => x.url?.includes(".mp4"))[0]?.url || "None";

  return { imageLink, video };
};

/**
 * Generate tweet link from username and id
 * @param {string} username - Twitter username
 * @param {string} id - Tweet ID
 * @returns {string} Full tweet URL
 */
export const generateTweetLink = (username, id) => {
  return `https://x.com/${username}/status/${id}`;
};

/**
 * Complete tweet transformation pipeline
 * @param {Object} tweetInfo - Raw tweet data
 * @param {string} collectionID - Collection ID
 * @returns {Object} Fully formatted tweet
 */
export const transformTweet = (tweetInfo, collectionID) => {
  // Extract all properties
  let tweet = extractTweetProperties(tweetInfo);
  tweet.collectionID = collectionID;

  // Parse views as integer
  tweet.views = parseInt(tweet.views);

  // Transform array properties
  tweet = transformTweetArrayProperties(tweet);

  // Extract media
  const media = extractTweetMedia(tweetInfo);
  tweet.imageLink = media.imageLink;
  tweet.video = media.video;

  // Generate tweet link
  tweet.tweetLink = generateTweetLink(tweet.username, tweet.id);

  return tweet;
};

/**
 * Extract all properties from tiktok data using TIKTOK_PROPERTY_PATHS
 * @param {Object} tiktokInfo - Raw tiktok data
 * @returns {Object} Object with all extracted properties
 */
export const extractTiktokProperties = (tiktokInfo) => {
  const properties = {};
  Object.keys(TIKTOK_PROPERTY_PATHS).forEach((key) => {
    properties[key] = _.get(
      tiktokInfo,
      TIKTOK_PROPERTY_PATHS[key].path,
      TIKTOK_PROPERTY_PATHS[key].default,
    );
  });
  return properties;
};

/**
 * Transform tiktok hashtags
 * @param {Array} hashtags - Raw hashtag array
 * @returns {Array} Transformed hashtags or empty array
 */
export const transformTiktokHashtags = (hashtags) => {
  if (!hashtags || hashtags.length < 1) return [];
  return hashtags.map((v) => "#" + v.hashtagName).filter((v) => v.length > 2);
};

/**
 * Format tiktok date from unix timestamp
 * @param {number} unixTimestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
export const formatTiktokDate = (unixTimestamp) => {
  return dayjs.unix(unixTimestamp).format("YYYY-MM-DDTHH:mm:ss");
};

/**
 * Complete tiktok transformation pipeline
 * @param {Object} tiktokInfo - Raw tiktok data
 * @param {string} id - Tiktok ID
 * @param {string} collectionID - Collection ID
 * @returns {Object} Fully formatted tiktok
 */
export const transformTiktok = (tiktokInfo, id, collectionID) => {
  // Extract all properties
  let tiktok = extractTiktokProperties(tiktokInfo);
  tiktok.id = id;
  tiktok.collectionID = collectionID;

  // Format date
  tiktok.date = formatTiktokDate(tiktok.date);

  // Transform hashtags
  tiktok.hashtags = transformTiktokHashtags(tiktok.hashtags);

  // Parse reposts as integer
  tiktok.reposts = parseInt(tiktok.reposts);

  return tiktok;
};
