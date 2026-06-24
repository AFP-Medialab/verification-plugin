import {
  resetDeepfake,
  setDeepfakeUrlVideo,
} from "@/redux/actions/tools/deepfakeVideoActions";
import {
  resetPoiForensics,
  setPoiForensicsUrl,
} from "@/redux/actions/tools/poiForensicsActions";
import { c2paUrlSet, resetC2paState } from "@/redux/reducers/tools/c2paReducer";
import {
  resetGeolocation as resetGeolocationImage,
  setGeolocationUrl,
} from "@/redux/reducers/tools/geolocationReducer";
import {
  resetSyntheticImageDetectionImage,
  setSyntheticImageDetectionUrl,
} from "@/redux/reducers/tools/syntheticImageDetectionReducer";

import { ROLES } from "./roles";

/**
 * Represents the categories to which the tools belong
 * @typedef ToolsCategories
 * @type {{OTHER: string, ALL: string, IMAGE: string, VIDEO: string, SEARCH: string, DATA_ANALYSIS: string, AUDIO: string}}
 */
export const TOOLS_CATEGORIES = {
  VIDEO: "navbar_category_video",
  IMAGE: "navbar_category_image",
  AUDIO: "navbar_category_audio",
  SEARCH: "navbar_category_search",
  DATA_ANALYSIS: "navbar_category_data",
  OTHER: "navbar_category_other",

  // Used to display the home page
  ALL: "navbar_category_general",
};

/**
 * Represents the possible temporary states of the tools:
 * - An experimental topMenuItem is not ready for production, and available to beta testers
 * - A new topMenuItem is an experimental topMenuItem that was released to everyone
 * - A locked topMenuItem is a topMenuItem available to registered users
 * @typedef ToolsStatusIcon
 * @type {{NEW: string, LOCK: string, EXPERIMENTAL: string}}
 */
export const TOOL_STATUS_ICON = {
  EXPERIMENTAL: "experimental",
  NEW: "new",
  LOCK: "lock",
};

/**
 * Represents the different segments of tools.
 * Verification - The tools that can be used for Verification
 * Learning - Resources to learn how to use the Verification Tools
 * More - Settings and general information
 * @typedef ToolGroups
 * @type {{MORE: string, LEARNING: string, VERIFICATION: string}}
 */
export const TOOL_GROUPS = {
  VERIFICATION: "verification",
  LEARNING: "learning",
  MORE: "more",
};

/**
 * Represents a topMenuItem that can be used by users
 */
export class Tool {
  /**
   *
   * @param titleKeyword {string} The keyword for the name of the topMenuItem
   * @param descriptionKeyword {string=} The keyword for the topMenuItem description
   * @param icon {SvgIconComponent | React.JSX.Element} The topMenuItem's icon
   * @param category {ToolsCategories} The topMenuItem's category
   * @param rolesIcons {?Array<ToolsStatusIcon>} Icons representing the development status of the topMenuItem
   * @param rolesNeeded {?Array<Roles>} Role(s) needed to access the topMenuItem
   * @param path {string} The url path to the topMenuItem
   * @param toolGroup {ToolGroups} The group to which the topMenuItem belongs
   * @param content The React Element to display for the topMenuItem
   * @param footer The React element to display at the bottom of the topMenuItem React Element
   * @param assistantProps Additional properties used by the assistant to determine whether to recommend a tool
   */
  constructor(
    titleKeyword,
    descriptionKeyword,
    icon,
    category,
    rolesIcons,
    rolesNeeded,
    path,
    toolGroup,
    content,
    footer,
    assistantProps = {},
  ) {
    this.titleKeyword = titleKeyword;
    this.descriptionKeyword = descriptionKeyword;
    this.icon = icon;
    this.category = category;
    this.rolesIcons = rolesIcons;
    this.rolesNeeded = rolesNeeded;
    this.path = path;
    this.toolGroup = toolGroup;
    this.content = content;
    this.footer = footer;
    this.assistantProps = assistantProps;
  }
}

export const KNOWN_LINKS = {
  TWITTER: "twitter",
  INSTAGRAM: "instagram",
  SNAPCHAT: "snapchat",
  FACEBOOK: "facebook",
  TIKTOK: "tiktok",
  TELEGRAM: "telegram",
  YOUTUBE: "youtube",
  YOUTUBESHORTS: "youtubeshorts",
  DAILYMOTION: "dailymotion",
  LIVELEAK: "liveleak",
  VIMEO: "vimeo",
  MASTODON: "mastodon",
  OWN: "own",
  VK: "vk",
  BLUESKY: "bsky",
  BBC: "bbc",
  MISC: "general",
};

/**
 * Helper function to verify if a user has the permissions to see a tool
 * @param tool {Tool}
 * @param role {ROLES[]}
 * @param isUserAuthenticated {boolean}
 * @returns {boolean|*|?Array<Roles>|?Roles[]|boolean}
 */
export const canUserSeeTool = (tool, role, isUserAuthenticated) => {
  if (!tool) throw new Error("[Error] Tool was not provided");

  if (!isUserAuthenticated && tool.rolesNeeded) {
    return false;
  }

  return (
    !tool.rolesNeeded ||
    (role && tool.rolesNeeded && role.includes(...tool.rolesNeeded)) ||
    (isUserAuthenticated && tool.rolesNeeded.includes(ROLES.REGISTERED_USER))
  );
};

// ---------------------------------------------------------------------------
// Tool config objects — pure data, no UI dependencies.
// tools.jsx reads these and constructs full Tool instances with real icons,
// lazy content components, and footers.
// ---------------------------------------------------------------------------

export const toolsHome = {
  titleKeyword: "navbar_tools",
  descriptionKeyword: "",
  category: TOOLS_CATEGORIES.ALL,
  rolesIcons: null,
  rolesNeeded: null,
  path: "tools",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const videoAnalysis = {
  titleKeyword: "navbar_analysis_video",
  descriptionKeyword: "navbar_analysis_description",
  category: TOOLS_CATEGORIES.VIDEO,
  rolesIcons: null,
  rolesNeeded: null,
  path: "analysis",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    linksAccepted: [
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.FACEBOOK,
      KNOWN_LINKS.SNAPCHAT,
      KNOWN_LINKS.OWN,
    ],
    exceptions: [],
    useInputUrl: true,
    text: "video_analysis_text",
  },
};

export const keyframes = {
  titleKeyword: "navbar_keyframes",
  descriptionKeyword: "navbar_keyframes_description",
  category: TOOLS_CATEGORIES.VIDEO,
  rolesIcons: null,
  rolesNeeded: null,
  path: "keyframes",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    linksAccepted: [
      KNOWN_LINKS.TWITTER,
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.FACEBOOK,
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.YOUTUBESHORTS,
      KNOWN_LINKS.LIVELEAK,
      KNOWN_LINKS.SNAPCHAT,
      KNOWN_LINKS.OWN,
    ],
    exceptions: [],
    useInputUrl: true,
    text: "keyframes_text",
  },
};

export const thumbnails = {
  titleKeyword: "navbar_thumbnails",
  descriptionKeyword: "navbar_thumbnails_description",
  category: TOOLS_CATEGORIES.VIDEO,
  rolesIcons: null,
  rolesNeeded: null,
  path: "thumbnails",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    linksAccepted: [KNOWN_LINKS.YOUTUBE, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: true,
    text: "thumbnails_text",
  },
};

export const videoMetadata = {
  titleKeyword: "navbar_metadata_video",
  descriptionKeyword: "navbar_metadata_description",
  category: TOOLS_CATEGORIES.VIDEO,
  rolesIcons: null,
  rolesNeeded: null,
  path: "metadata",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [
      /(pbs.twimg.com)|(youtu.be|youtube)|(instagram)|(fbcdn.net)|(vimeo)|(snapchat)|(tiktok.com)/,
    ],
    useInputUrl: false,
    text: "metadata_text",
  },
};

export const videoDeepfake = {
  titleKeyword: "navbar_deepfake_video",
  descriptionKeyword: "navbar_deepfake_video_description",
  category: TOOLS_CATEGORIES.VIDEO,
  rolesIcons: [TOOL_STATUS_ICON.EXPERIMENTAL],
  rolesNeeded: [ROLES.BETA_TESTER],
  path: "deepfakeVideo",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.TWITTER,
      KNOWN_LINKS.TELEGRAM,
      KNOWN_LINKS.YOUTUBESHORTS,
      KNOWN_LINKS.DAILYMOTION,
      KNOWN_LINKS.MISC,
      KNOWN_LINKS.OWN,
    ],
    exceptions: [],
    useInputUrl: false,
    text: "deepfake_video_text",
    resetUrl: resetDeepfake,
    setUrl: (resultUrl) => setDeepfakeUrlVideo({ url: resultUrl }),
  },
};

export const poiForensic = {
  titleKeyword: "navbar_poiforensics",
  descriptionKeyword: "navbar_poiforensics_description",
  category: TOOLS_CATEGORIES.VIDEO,
  rolesIcons: [TOOL_STATUS_ICON.LOCK],
  rolesNeeded: [ROLES.EXTRA_FEATURE],
  path: "poiforensic",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.TWITTER,
      KNOWN_LINKS.TELEGRAM,
      KNOWN_LINKS.YOUTUBESHORTS,
      KNOWN_LINKS.DAILYMOTION,
      KNOWN_LINKS.MISC,
      KNOWN_LINKS.OWN,
    ],
    exceptions: [],
    useInputUrl: false,
    text: "deepfake_video_text",
    resetUrl: resetPoiForensics,
    setUrl: (resultUrl) => setPoiForensicsUrl({ url: resultUrl }),
  },
};

export const imageMagnifier = {
  titleKeyword: "navbar_magnifier",
  descriptionKeyword: "navbar_magnifier_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: null,
  rolesNeeded: null,
  path: "magnifier",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.BBC, KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "magnifier_text",
  },
};

export const imageMetadata = {
  titleKeyword: "navbar_metadata_image",
  descriptionKeyword: "navbar_metadata_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: null,
  rolesNeeded: null,
  path: "metadata_image",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.BBC, KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [
      /(pbs.twimg.com)|(youtu.be|youtube)|(instagram)|(fbcdn.net)|(vimeo)|(snapchat)|(tiktok.com)/,
    ],
    useInputUrl: false,
    text: "metadata_text",
  },
};

export const imageForensic = {
  titleKeyword: "navbar_forensic",
  descriptionKeyword: "navbar_forensic_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: null,
  rolesNeeded: null,
  path: "forensic",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.BBC, KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "forensic_text",
  },
};

export const imageOcr = {
  titleKeyword: "navbar_ocr",
  descriptionKeyword: "navbar_ocr_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: null,
  rolesNeeded: null,
  path: "ocr",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.BBC, KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "ocr_text",
  },
};

export const imageGif = {
  titleKeyword: "navbar_gif",
  descriptionKeyword: "navbar_gif_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: [TOOL_STATUS_ICON.LOCK],
  rolesNeeded: [ROLES.REGISTERED_USER],
  path: "gif",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.BBC, KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "gif_text",
  },
};

export const imageSyntheticDetection = {
  titleKeyword: "navbar_synthetic_image_detection",
  descriptionKeyword: "navbar_synthetic_image_detection_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: [
    TOOL_STATUS_ICON.NEW,
    TOOL_STATUS_ICON.EXPERIMENTAL,
    TOOL_STATUS_ICON.LOCK,
  ],
  rolesNeeded: [ROLES.BETA_TESTER],
  path: "syntheticImageDetection",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.BBC, KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "synthetic_image_detection_text",
    resetUrl: resetSyntheticImageDetectionImage,
    setUrl: (resultUrl) => setSyntheticImageDetectionUrl({ url: resultUrl }),
  },
};

export const imageGeolocation = {
  titleKeyword: "navbar_geolocation",
  descriptionKeyword: "navbar_geolocation_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  rolesNeeded: [ROLES.BETA_TESTER],
  path: "geolocation",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.BBC, KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "geolocation_text",
    resetUrl: resetGeolocationImage,
    setUrl: setGeolocationUrl,
  },
};

export const audioHiya = {
  titleKeyword: "navbar_hiya",
  descriptionKeyword: "navbar_hiya_description",
  category: TOOLS_CATEGORIES.AUDIO,
  rolesIcons: [
    TOOL_STATUS_ICON.NEW,
    TOOL_STATUS_ICON.EXPERIMENTAL,
    TOOL_STATUS_ICON.LOCK,
  ],
  rolesNeeded: [ROLES.BETA_TESTER],
  path: "hiya",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const searchTwitter = {
  titleKeyword: "navbar_twitter",
  descriptionKeyword: "navbar_twitter_description",
  category: TOOLS_CATEGORIES.SEARCH,
  rolesIcons: null,
  rolesNeeded: null,
  path: "twitter",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const searchSemantic = {
  titleKeyword: "navbar_semantic_search",
  descriptionKeyword: "navbar_semantic_search_description",
  category: TOOLS_CATEGORIES.SEARCH,
  rolesIcons: [
    TOOL_STATUS_ICON.EXPERIMENTAL,
    TOOL_STATUS_ICON.NEW,
    TOOL_STATUS_ICON.LOCK,
  ],
  rolesNeeded: [ROLES.REGISTERED_USER],
  path: "semanticSearch",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const searchCovid = {
  titleKeyword: "navbar_covidsearch",
  descriptionKeyword: "navbar_covidsearch_description",
  category: TOOLS_CATEGORIES.SEARCH,
  rolesIcons: null,
  rolesNeeded: null,
  path: "factcheck",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const searchXnetwork = {
  titleKeyword: "navbar_xnetwork",
  descriptionKeyword: "navbar_xnetwork_description",
  category: TOOLS_CATEGORIES.SEARCH,
  rolesIcons: null,
  rolesNeeded: null,
  path: "xnetwork",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const machineGeneratedText = {
  titleKeyword: "navbar_mgt",
  descriptionKeyword: "navbar_mgt_description",
  category: TOOLS_CATEGORIES.SEARCH,
  rolesIcons: [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW],
  rolesNeeded: [ROLES.BETA_TESTER],
  path: "mgt",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const dataAnalysisSna = {
  titleKeyword: "navbar_twitter_sna",
  descriptionKeyword: "navbar_twitter_sna_description",
  category: TOOLS_CATEGORIES.DATA_ANALYSIS,
  rolesIcons: [TOOL_STATUS_ICON.LOCK],
  rolesNeeded: null,
  path: "twitterSna",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const dataAnalysisCrowdtangle = {
  titleKeyword: "navbar_twitter_crowdtangle",
  descriptionKeyword: "navbar_twitter_crowdtangle_description",
  category: TOOLS_CATEGORIES.DATA_ANALYSIS,
  rolesIcons: null,
  rolesNeeded: null,
  path: "csvSna",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const newSna = {
  titleKeyword: "navbar_sna",
  descriptionKeyword: "navbar_sna_description",
  category: TOOLS_CATEGORIES.DATA_ANALYSIS,
  rolesIcons: [TOOL_STATUS_ICON.LOCK],
  rolesNeeded: [ROLES.BETA_TESTER, ROLES.EVALUATION],
  path: "Sna",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const disinfoDeck = {
  titleKeyword: "navbar_disinfo_deck",
  descriptionKeyword: "navbar_disinfo_deck_description",
  category: TOOLS_CATEGORIES.DATA_ANALYSIS,
  rolesIcons: [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW],
  rolesNeeded: [
    ROLES.BETA_TESTER,
    ROLES.EVALUATION,
    ROLES.EXTRA_FEATURE,
    ROLES.AFP_C2PA_GOLD,
  ],
  path: "disinfoDeck",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const archiving = {
  titleKeyword: "navbar_archiving",
  descriptionKeyword: "navbar_archiving_description",
  category: TOOLS_CATEGORIES.OTHER,
  rolesIcons: [
    TOOL_STATUS_ICON.EXPERIMENTAL,
    TOOL_STATUS_ICON.NEW,
    TOOL_STATUS_ICON.LOCK,
  ],
  rolesNeeded: [ROLES.ARCHIVE],
  path: "archive",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const chatbot = {
  titleKeyword: "navbar_chatbot",
  descriptionKeyword: "navbar_chatbot_description",
  category: TOOLS_CATEGORIES.OTHER,
  rolesIcons: [TOOL_STATUS_ICON.NEW],
  rolesNeeded: [ROLES.EXTRA_FEATURE],
  path: "chatbot",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {},
};

export const afpDigitalCourses = {
  titleKeyword: "",
  descriptionKeyword: "",
  category: null,
  rolesIcons: null,
  rolesNeeded: null,
  path: "afpDigitalCourses",
  toolGroup: TOOL_GROUPS.MORE,
  assistantProps: {},
};

export const about = {
  titleKeyword: "navbar_about",
  descriptionKeyword: "",
  category: null,
  rolesIcons: null,
  rolesNeeded: null,
  path: "about",
  toolGroup: TOOL_GROUPS.MORE,
  assistantProps: {},
};

export const c2paData = {
  titleKeyword: "navbar_c2pa",
  descriptionKeyword: "navbar_c2pa_description",
  category: TOOLS_CATEGORIES.IMAGE,
  rolesIcons: [TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.LOCK],
  rolesNeeded: [ROLES.REGISTERED_USER],
  path: "c2pa",
  toolGroup: TOOL_GROUPS.VERIFICATION,
  assistantProps: {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "c2pa_text",
    resetUrl: resetC2paState,
    setUrl: c2paUrlSet,
  },
};

export const toolConfigs = Object.freeze([
  toolsHome,
  videoAnalysis,
  keyframes,
  thumbnails,
  videoMetadata,
  videoDeepfake,
  poiForensic,
  imageMagnifier,
  imageMetadata,
  imageForensic,
  imageOcr,
  imageGif,
  imageSyntheticDetection,
  imageGeolocation,
  audioHiya,
  searchTwitter,
  searchSemantic,
  searchCovid,
  searchXnetwork,
  machineGeneratedText,
  dataAnalysisSna,
  dataAnalysisCrowdtangle,
  newSna,
  disinfoDeck,
  archiving,
  chatbot,
  afpDigitalCourses,
  about,
  c2paData,
]);
