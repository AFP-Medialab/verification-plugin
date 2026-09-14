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

  // Parse numeric fields as integers
  tiktok.likes = parseInt(tiktok.likes) || 0;
  tiktok.views = parseInt(tiktok.views) || 0;
  tiktok.reposts = parseInt(tiktok.reposts) || 0;
  tiktok.replies = parseInt(tiktok.replies) || 0;
  tiktok.shares = parseInt(tiktok.shares) || 0;

  return tiktok;
};

/**
 * Community Note property paths
 */
export const COMMUNITY_NOTE_PROPERTY_PATHS = {
  id: { path: "rest_id", default: "" },
  noteId: { path: "rest_id", default: "" },
  text: { path: "data_v1.summary.text", default: "" },
  classification: { path: "data_v1.classification", default: "" },
  misleadingTags: { path: "data_v1.misleading_tags", default: [] },
  trustworthySources: { path: "data_v1.trustworthy_sources", default: false },
  createdAt: { path: "created_at", default: "" },
  tweetId: { path: "tweet_results.result.rest_id", default: "" },
  ratingStatus: { path: "rating_status", default: "" },
  decidedBy: { path: "decided_by", default: "" },
  language: { path: "language", default: "" },
  isMediaNote: { path: "is_media_note", default: false },
  mediaMatches: { path: "media_note_matches_v2.match_count", default: 0 },
  authorAlias: { path: "birdwatch_profile.alias", default: "" },
  appealStatus: { path: "appeal_status", default: "" },
};

/**
 * Extract all properties from Community Note data
 * @param {Object} noteInfo - Raw Community Note data
 * @returns {Object} Object with all extracted properties
 */
export const extractCommunityNoteProperties = (noteInfo) => {
  const properties = {};
  Object.keys(COMMUNITY_NOTE_PROPERTY_PATHS).forEach((key) => {
    properties[key] = _.get(
      noteInfo,
      COMMUNITY_NOTE_PROPERTY_PATHS[key].path,
      COMMUNITY_NOTE_PROPERTY_PATHS[key].default,
    );
  });
  return properties;
};

/**
 * Transform Community Note date from milliseconds timestamp
 * @param {number} millisTimestamp - Milliseconds timestamp
 * @returns {string} Formatted date string
 */
export const formatCommunityNoteDate = (millisTimestamp) => {
  if (!millisTimestamp) return "";
  // Twitter uses Unix timestamp in milliseconds
  return dayjs(parseInt(millisTimestamp)).format("YYYY-MM-DD HH:mm:ss");
};

/**
 * Generate Community Note link
 * @param {string} noteId - Community Note ID
 * @returns {string} Full Community Note URL
 */
export const generateCommunityNoteLink = (noteId) => {
  return `https://x.com/i/communitynotes/m/${noteId}`;
};

/**
 * Complete Community Note transformation pipeline
 * @param {Object} noteInfo - Raw Community Note data
 * @param {string} collectionID - Collection ID
 * @returns {Object} Fully formatted Community Note
 */
export const transformCommunityNote = (noteInfo, collectionID) => {
  // Extract all properties
  let note = extractCommunityNoteProperties(noteInfo);
  note.collectionID = collectionID;

  // Format date
  note.createdAt = formatCommunityNoteDate(note.createdAt);

  // Parse numeric fields
  note.mediaMatches = parseInt(note.mediaMatches) || 0;

  // Generate note link
  note.noteLink = generateCommunityNoteLink(note.noteId);

  // Add tweet link if tweetId exists
  if (note.tweetId) {
    note.tweetLink = `https://x.com/i/status/${note.tweetId}`;
  }

  // Ensure misleadingTags is an array
  if (!Array.isArray(note.misleadingTags)) {
    note.misleadingTags = [];
  }

  return note;
};
