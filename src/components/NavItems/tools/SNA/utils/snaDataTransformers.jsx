import dayjs from "dayjs";
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
    path: "core.user_results.result.relationship_counts.followers",
    default: "",
  },
  total_posts: {
    path: "core.user_results.result.tweet_counts.tweets",
    default: "",
  },
  text: { path: "legacy.full_text", default: "" },
  language: { path: "legacy.lang", default: "" },
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
  isVerified: {
    path: "core.user_results.result.is_blue_verified",
    default: false,
  },
  isOfficiallyVerified: {
    path: "core.user_results.result.verification.verified",
    default: false,
  },
  verifiedType: {
    path: "core.user_results.result.verification.verified_type",
    default: "",
  },
  parodyLabel: {
    path: "core.user_results.result.parody_commentary_fan_label",
    default: "None",
  },
  professionalType: {
    path: "core.user_results.result.professional.professional_type",
    default: "",
  },
  likesGiven: {
    path: "core.user_results.result.action_counts.favorites_count",
    default: 0,
  },
  profileDescription: {
    path: "core.user_results.result.profile_bio.description",
    default: "",
  },
  isSensitiveContent: {
    path: "core.user_results.result.possibly_sensitive",
    default: false,
  },
  location: { path: "core.user_results.result.location.location", default: "" },
  following: {
    path: "core.user_results.result.relationship_counts.following",
    default: 0,
  },
  totalTweetsPublished: {
    path: "core.user_results.result.tweet_counts.tweets",
    default: 0,
  },
  hasOfficialAIContent: {
    path: "content_disclosure.ai_generated_disclosure.has_ai_generated_media",
    default: false,
  },
  aiContentDetectionSource: {
    path: "content_disclosure.ai_generated_disclosure.ai_generated_detection_source",
    default: "",
  },
  hasCommunityNotes: {
    path: "has_birdwatch_notes",
    default: "absent",
  },
  communityNoteText: { path: "birdwatch_pivot.subtitle.text", default: "" },
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
 * DEBUG: collect leaf paths of an object (arrays are treated as leaves)
 */
const collectLeafPaths = (obj, prefix = "", out = {}) => {
  if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
    Object.keys(obj).forEach((key) =>
      collectLeafPaths(obj[key], prefix ? `${prefix}.${key}` : key, out),
    );
  } else {
    out[prefix] = obj;
  }
  return out;
};

// DEBUG: paths already logged, so each unscraped field is only printed once
const loggedUnscrapedPaths = new Set();

/**
 * DEBUG: log the fields present in the raw tweet that are not scraped
 * (i.e. not covered by any path of TWEET_PROPERTY_PATHS). Each path is logged once.
 * @param {Object} tweetInfo - Raw tweet data
 */
const logUnscrapedTweetFields = (tweetInfo) => {
  const scrapedPaths = Object.values(TWEET_PROPERTY_PATHS).map((p) => p.path);
  const newFields = {};
  Object.entries(collectLeafPaths(tweetInfo)).forEach(([path, value]) => {
    const isScraped = scrapedPaths.some(
      (scraped) => path === scraped || path.startsWith(scraped + "."),
    );
    if (!isScraped && !loggedUnscrapedPaths.has(path)) {
      loggedUnscrapedPaths.add(path);
      newFields[path] = value;
    }
  });
  if (Object.keys(newFields).length > 0) {
    const username = _.get(
      tweetInfo,
      "core.user_results.result.core.screen_name",
      "unknown",
    );
    console.log(
      `[SNA] Unscraped tweet fields (@${username}, tweet ${tweetInfo?.rest_id}):`,
      newFields,
    );
  }
};

/**
 * Extract all properties from tweet data using TWEET_PROPERTY_PATHS
 * @param {Object} tweetInfo - Raw tweet data
 * @returns {Object} Object with all extracted properties
 */
export const extractTweetProperties = (tweetInfo) => {
  logUnscrapedTweetFields(tweetInfo);
  const properties = {};
  Object.keys(TWEET_PROPERTY_PATHS).forEach((key) => {
    properties[key] = _.get(
      tweetInfo,
      TWEET_PROPERTY_PATHS[key].path,
      TWEET_PROPERTY_PATHS[key].default,
    );
  });

  // has_birdwatch_notes only comes with TweetDetail: in the other feeds (home, search...)
  // a tweet showing a Community Note carries a birdwatch_pivot instead
  if (tweetInfo?.birdwatch_pivot) {
    properties.hasCommunityNotes = true;
  }

  // Posts over 280 characters: legacy.full_text is truncated and the entities
  // (hashtags, mentions, links) of the whole text are in note_tweet
  const longPost = _.get(tweetInfo, "note_tweet.note_tweet_results.result");
  if (longPost?.text) {
    properties.text = longPost.text;
    properties.hashtags = longPost.entity_set?.hashtags ?? [];
    properties.mentions = longPost.entity_set?.user_mentions ?? [];
    properties.links = longPost.entity_set?.urls ?? [];
  }
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
 * Extract all media of a tweet
 * @param {Object} tweetInfo - Raw tweet data
 * @returns {Object} imageLinks (image or thumbnail URL of each media)
 * and videos (best mp4 of each video/gif)
 */
export const extractTweetMedia = (tweetInfo) => {
  const mediaItems =
    _.get(tweetInfo, "legacy.extended_entities.media") ||
    _.get(tweetInfo, "legacy.entities.media") ||
    [];

  const imageLinks = [];
  const videos = [];

  mediaItems.forEach((media) => {
    if (media.media_url_https) imageLinks.push(media.media_url_https);

    if (media.type === "video" || media.type === "animated_gif") {
      const bestMp4 = (media.video_info?.variants || [])
        .filter((variant) => variant.content_type === "video/mp4")
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
      if (bestMp4?.url) videos.push(bestMp4.url);
    }
  });

  return { imageLinks, videos };
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
 * @param {string} [entryId] - Timeline entryId, e.g. "tweet-123" or "conversationthread-123"
 * @returns {Object} Fully formatted tweet
 */
export const transformTweet = (tweetInfo, collectionID, entryId = "") => {
  // Extract all properties
  let tweet = extractTweetProperties(tweetInfo);
  tweet.collectionID = collectionID;
  tweet.entryType = entryId.replace(/-\d.*$/, "");

  // Parse views as integer
  tweet.views = parseInt(tweet.views);

  // Transform array properties
  tweet = transformTweetArrayProperties(tweet);

  // Extract media
  const media = extractTweetMedia(tweetInfo);
  tweet.imageLinks = media.imageLinks;
  tweet.videos = media.videos;

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
  createdAt: { path: "created_at", default: "" },
  tweetId: { path: "tweet_results.result.rest_id", default: "" },
  ratingStatus: { path: "rating_status", default: "" },
  language: { path: "language", default: "" },
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
 * @returns {Object} Fully formatted Community Note
 */
export const transformCommunityNote = (noteInfo) => {
  let note = extractCommunityNoteProperties(noteInfo);
  note.entryType = "communityNote";
  note.createdAt = formatCommunityNoteDate(note.createdAt);
  note.noteLink = generateCommunityNoteLink(note.noteId);
  note.tweetLink = note.tweetId ? `https://x.com/i/status/${note.tweetId}` : "";

  return note;
};
