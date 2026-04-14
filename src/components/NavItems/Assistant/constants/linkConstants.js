import { KNOWN_LINKS, TOOLS_CATEGORIES } from "@/constants/tools";

/**
 * File-extension patterns used to classify a URL as video or image
 */
export const TYPE_PATTERNS = [
  {
    key: TOOLS_CATEGORIES.VIDEO,
    patterns: [/.(mp4|mkv)(.*)?$/i],
  },
  {
    key: TOOLS_CATEGORIES.IMAGE,
    patterns: [/.(jpg|jpeg|png)(.*)?$/i],
  },
];

/**
 * Regex patterns used to identify which platform a URL belongs to.
 * Order matters — more specific patterns should come before general ones.
 */
export const KNOWN_LINK_PATTERNS = [
  {
    key: KNOWN_LINKS.BLUESKY,
    patterns: ["((https?:/{2})?(www.)?(bsky).app/profile/[\\w-.]+/post/\\w*)"],
  },
  {
    key: KNOWN_LINKS.TWITTER,
    patterns: [
      "((https?:/{2})?(www.)?(twitter|x).com/\\w{1,15}/status/\\d*)",
      "((https?:/{2})?(www.)?(twitter|x).com/i/birdwatch/t/\\d*)",
    ],
  },
  {
    key: KNOWN_LINKS.TIKTOK,
    patterns: ["((https?:\\/{2})?(www.)?tiktok.com\\/.*\\/video/\\d*)"],
  },
  {
    key: KNOWN_LINKS.SNAPCHAT,
    patterns: [
      "((https?:\\/{2})?(www.)?snapchat.com\\/(spotlight|lens)/\\w*)",
      "((https?:\\/{2})?(www.)?snapchat.com\\/p\\/[\\w\\-]+\\/\\w*)",
    ],
  },
  {
    key: KNOWN_LINKS.INSTAGRAM,
    patterns: [
      "((https?:\\/{2})?(www.)?instagram.com(\\/[A-Za-z0-9_]*)?\\/(([A-Za-z0-9\\.]+\\/)?p|reel)\\/.*)",
    ],
  },
  {
    key: KNOWN_LINKS.FACEBOOK,
    patterns: [
      "^(https?:/{2})?(www.)?facebook.com/.*/(videos|photos|posts)/.*",
      "^(https?:/{2})?(www.)?facebook.com/reel/.*",
    ],
  },
  {
    key: KNOWN_LINKS.TELEGRAM,
    patterns: ["^(https?:/{2})?(www.)?t.me/(s/)?\\w*/\\d*"],
  },
  {
    key: KNOWN_LINKS.YOUTUBE,
    patterns: [
      "(https?:\\/{2})?(www.)?((youtube.com\\/watch\\?v=)|youtu.be\\/)([a-zA-Z0-9_-]{11})",
    ],
  },
  {
    key: KNOWN_LINKS.YOUTUBESHORTS,
    patterns: [
      "(https?:\\/{2})?(www.)?((youtube.com\\/shorts\\/))([a-zA-Z0-9_-]{11})",
    ],
  },
  {
    key: KNOWN_LINKS.VIMEO,
    patterns: ["^(https?:/{2})?(www.)?vimeo.com/\\d*"],
  },
  {
    key: KNOWN_LINKS.DAILYMOTION,
    patterns: ["^(https?:/{2})?(www.)?dailymotion.com/video/.*"],
  },
  {
    key: KNOWN_LINKS.LIVELEAK,
    patterns: ["^(https?:/{2})?(www.)?liveleak.com/view\\?t=.*"],
  },
  {
    key: KNOWN_LINKS.MASTODON,
    patterns: ["^(?:https?:/{2})?(www.)?.+..+/@.*/d*"],
  },
  {
    key: KNOWN_LINKS.VK,
    patterns: [
      "(https?:\\/{2})?(www.)?vk.com\\/(wall|video)(-?)\\d*_\\d*(\\??)",
    ],
  },
  {
    key: KNOWN_LINKS.MISC,
    patterns: [
      "(http(s)?://.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)",
    ],
  },
];
