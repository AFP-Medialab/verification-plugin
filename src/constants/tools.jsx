import React from "react";

import SvgIcon from "@mui/material/SvgIcon";

import {
  Archive as ArchiveIcon,
  AudioFile,
  Dashboard,
  Gradient,
  ManageSearch,
  SmartToy,
} from "@mui/icons-material";

import {
  resetDeepfake,
  setDeepfakeUrlVideo,
} from "@//redux/actions/tools/deepfakeVideoActions";
import { c2paUrlSet, resetC2paState } from "@/redux/reducers/tools/c2paReducer";
import {
  resetGeolocation as resetGeolocationImage,
  setGeolocationUrl,
} from "@/redux/reducers/tools/geolocationReducer";
import {
  resetSyntheticImageDetectionImage,
  setSyntheticImageDetectionUrl,
} from "@/redux/reducers/tools/syntheticImageDetectionReducer";
import { FOOTER_TYPES, Footer } from "@Shared/Footer/Footer";

import CsvSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/CSV_SNA.svg";
import TwitterSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/Twitter_sna.svg";
import C2paIcon from "../components/NavBar/images/SVG/Image/C2pa.svg";
import DeepfakeIcon from "../components/NavBar/images/SVG/Image/Deepfake.svg";
import ForensicIcon from "../components/NavBar/images/SVG/Image/Forensic.svg";
import GeolocationIcon from "../components/NavBar/images/SVG/Image/Geolocation.svg";
import GifIcon from "../components/NavBar/images/SVG/Image/Gif.svg";
import MagnifierIcon from "../components/NavBar/images/SVG/Image/Magnifier.svg";
import MetadataIcon from "../components/NavBar/images/SVG/Image/Metadata.svg";
import OcrIcon from "../components/NavBar/images/SVG/Image/OCR.svg";
import AboutIcon from "../components/NavBar/images/SVG/Navbar/About.svg";
import AfpDigitalCoursesIconComponent from "../components/NavBar/images/SVG/Navbar/AfpDigitalCoursesIcon";
import ToolsIcon from "../components/NavBar/images/SVG/Navbar/Tools.svg";
import CovidSearchIcon from "../components/NavBar/images/SVG/Search/Covid19.svg";
import TwitterSearchIcon from "../components/NavBar/images/SVG/Search/Twitter_search.svg";
import XnetworkIcon from "../components/NavBar/images/SVG/Search/Xnetwork.svg";
import KeyframesIcon from "../components/NavBar/images/SVG/Video/Keyframes.svg";
import ThumbnailsIcon from "../components/NavBar/images/SVG/Video/Thumbnails.svg";
import AnalysisIcon from "../components/NavBar/images/SVG/Video/Video_analysis.svg";
import { ROLES } from "./roles";

// Lazy load heavy components
const C2paData = React.lazy(
  () => import("@/components/NavItems/tools/C2pa/C2pa"),
);
const SNA = React.lazy(() => import("@/components/NavItems/tools/SNA/SNA"));

// Lazy load heavy components (continued)
const About = React.lazy(() => import("../components/NavItems/About/About"));
const MachineGeneratedText = React.lazy(
  () => import("../components/NavItems/MachineGeneratedText"),
);
const ToolsMenu = React.lazy(
  () => import("../components/NavItems/tools/Alltools/ToolsMenu"),
);
const Analysis = React.lazy(
  () => import("../components/NavItems/tools/Analysis/Analysis"),
);
const Archive = React.lazy(
  () => import("../components/NavItems/tools/Archive"),
);
const Chatbot = React.lazy(
  () => import("../components/NavItems/tools/Chatbot"),
);
const DeepfakeVideo = React.lazy(
  () => import("../components/NavItems/tools/Deepfake/DeepfakeVideo"),
);
const Forensic = React.lazy(
  () => import("../components/NavItems/tools/Forensic/Forensic"),
);
const Geolocation = React.lazy(
  () => import("../components/NavItems/tools/Geolocation/Geolocation"),
);
const CheckGif = React.lazy(
  () => import("../components/NavItems/tools/Gif/CheckGif"),
);
const Hiya = React.lazy(() => import("../components/NavItems/tools/Hiya"));
const Keyframes = React.lazy(
  () => import("../components/NavItems/tools/Keyframes/Keyframes"),
);
const Magnifier = React.lazy(
  () => import("../components/NavItems/tools/Magnifier/Magnifier"),
);
const Metadata = React.lazy(
  () => import("../components/NavItems/tools/Metadata/Metadata"),
);
const OCR = React.lazy(() => import("../components/NavItems/tools/OCR/OCR"));
const SemanticSearch = React.lazy(
  () => import("../components/NavItems/tools/SemanticSearch"),
);
const SyntheticImageDetection = React.lazy(
  () => import("../components/NavItems/tools/SyntheticImageDetection"),
);
const Thumbnails = React.lazy(
  () => import("../components/NavItems/tools/Thumbnails/Thumbnails"),
);
const TwitterAdvancedSearch = React.lazy(
  () =>
    import(
      "../components/NavItems/tools/TwitterAdvancedSearch/TwitterAdvancedSearch"
    ),
);
const TwitterSna = React.lazy(
  () => import("../components/NavItems/tools/TwitterSna/TwitterSna"),
);

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
  MISC: "general",
};

const ToolsSvgIcon = (props) => {
  return <SvgIcon component={ToolsIcon} inheritViewBox {...props} />;
};

const AnalysisSvgIcon = (props) => {
  return <SvgIcon component={AnalysisIcon} inheritViewBox {...props} />;
};

const KeyframesSvgIcon = (props) => {
  return <SvgIcon component={KeyframesIcon} inheritViewBox {...props} />;
};

const thumbnailsSvgIcon = (props) => {
  return <SvgIcon component={ThumbnailsIcon} inheritViewBox {...props} />;
};

const metadataSvgIcon = (props) => {
  return <SvgIcon component={MetadataIcon} inheritViewBox {...props} />;
};

const deepfakeSvgIcon = (props) => {
  return <SvgIcon component={DeepfakeIcon} inheritViewBox {...props} />;
};

const magnifierSvgIcon = (props) => {
  return <SvgIcon component={MagnifierIcon} inheritViewBox {...props} />;
};

const forensicSvgIcon = (props) => {
  return <SvgIcon component={ForensicIcon} inheritViewBox {...props} />;
};

const ocrSvgIcon = (props) => {
  return <SvgIcon component={OcrIcon} inheritViewBox {...props} />;
};

const gifSvgIcon = (props) => {
  return <SvgIcon component={GifIcon} inheritViewBox {...props} />;
};

const syntheticImageSvgIcon = (props) => {
  return <Gradient inheritViewBox {...props} />;
};

const geolocationSvgIcon = (props) => {
  return <SvgIcon component={GeolocationIcon} inheritViewBox {...props} />;
};

const audioFileSvgIcon = (props) => {
  return <AudioFile inheritViewBox {...props} />;
};

const twitterSearchSvgIcon = (props) => {
  return <SvgIcon component={TwitterSearchIcon} inheritViewBox {...props} />;
};

const manageSearchSvgIcon = (props) => {
  return <ManageSearch inheritViewBox {...props} />;
};

const covidSearchSvgIcon = (props) => {
  return <SvgIcon component={CovidSearchIcon} inheritViewBox {...props} />;
};

const xnetworkSvgIcon = (props) => {
  return <SvgIcon component={XnetworkIcon} inheritViewBox {...props} />;
};

const mgtSvgIcon = (props) => {
  return <ManageSearch {...props} />;
};

const twitterSnaSvgIcon = (props) => {
  return <SvgIcon component={TwitterSnaIcon} inheritViewBox {...props} />;
};

const csvSnaSvgIcon = (props) => {
  return <SvgIcon component={CsvSnaIcon} inheritViewBox {...props} />;
};

const archiveSvgIcon = (props) => {
  return <ArchiveIcon {...props} />;
};

const aboutSvgIcon = (props) => {
  return <SvgIcon component={AboutIcon} inheritViewBox {...props} />;
};

const c2paSvgIcon = (props) => {
  return <SvgIcon component={C2paIcon} inheritViewBox {...props} />;
};

const disinfoDeckIcon = (props) => {
  return <Dashboard {...props} />;
};

const chatbotSvgIcon = (props) => {
  return <SmartToy {...props} />;
};

/**
 * The Homepage that lists all the tools available
 * @type {Tool}
 */
export const toolsHome = new Tool(
  "navbar_tools",
  "",
  ToolsSvgIcon,
  TOOLS_CATEGORIES.ALL,
  null,
  null,
  "tools",
  TOOL_GROUPS.VERIFICATION,
  <ToolsMenu />,
  <div />,
);

/**
 * Video tools
 **/

export const videoAnalysis = new Tool(
  "navbar_analysis_video",
  "navbar_analysis_description",
  AnalysisSvgIcon,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "analysis",
  TOOL_GROUPS.VERIFICATION,
  <Analysis />,
  <Footer type={FOOTER_TYPES.ITI} />,
  {
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
);

export const keyframes = new Tool(
  "navbar_keyframes",
  "navbar_keyframes_description",
  KeyframesSvgIcon,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "keyframes",
  TOOL_GROUPS.VERIFICATION,
  <Keyframes />,
  <Footer type={FOOTER_TYPES.ITI} />,
  {
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
);

export const thumbnails = new Tool(
  "navbar_thumbnails",
  "navbar_thumbnails_description",
  thumbnailsSvgIcon,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "thumbnails",
  TOOL_GROUPS.VERIFICATION,
  <Thumbnails />,
  <Footer type={FOOTER_TYPES.AFP} />,
  {
    linksAccepted: [KNOWN_LINKS.YOUTUBE, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: true,
    text: "thumbnails_text",
  },
);

const videoMetadata = new Tool(
  "navbar_metadata_video",
  "navbar_metadata_description",
  metadataSvgIcon,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "metadata",
  TOOL_GROUPS.VERIFICATION,
  <Metadata />,
  <Footer type={FOOTER_TYPES.AFP} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [
      /(pbs.twimg.com)|(youtu.be|youtube)|(instagram)|(fbcdn.net)|(vimeo)|(snapchat)|(tiktok.com)/,
    ],
    useInputUrl: false,
    text: "metadata_text",
  },
);

export const videoDeepfake = new Tool(
  "navbar_deepfake_video",
  "navbar_deepfake_video_description",
  deepfakeSvgIcon,
  TOOLS_CATEGORIES.VIDEO,
  [TOOL_STATUS_ICON.EXPERIMENTAL],
  [ROLES.BETA_TESTER],
  "deepfakeVideo",
  TOOL_GROUPS.VERIFICATION,
  <DeepfakeVideo />,
  <Footer type={FOOTER_TYPES.ITI} />,
  {
    processLinksAccepted: [
      KNOWN_LINKS.YOUTUBE,
      KNOWN_LINKS.TWITTER,
      // KNOWN_LINKS.INSTAGRAM, // assistant fails to load video (even if logged in); deepfakevideo tool directly works
      // KNOWN_LINKS.FACEBOOK, // assistant fails to load video; deepfakevideo has no face detected, video doesn't load properly
      // KNOWN_LINKS.TIKTOK, // assistant fails to load video; deepfakevideo has no face detected, video doesn't load properly
      KNOWN_LINKS.TELEGRAM,
      KNOWN_LINKS.YOUTUBESHORTS,
      KNOWN_LINKS.DAILYMOTION,
      // KNOWN_LINKS.LIVELEAK, // doesn't exist anymore; assistant works; deepfakevideo has no face detected, video doesn't load properly
      // KNOWN_LINKS.VIMEO, // assistant works; deepfakevideo has no face detected, video doesn't load properly
      // KNOWN_LINKS.MASTODON, // assistant fails to load video; deepfakevideo has no face detected, video doesn't load properly
      // KNOWN_LINKS.VK, // assistant fails to load; deepfakevideo works
      KNOWN_LINKS.MISC,
      KNOWN_LINKS.OWN,
    ],
    exceptions: [],
    useInputUrl: false,
    text: "deepfake_video_text",
    resetUrl: resetDeepfake,
    setUrl: (resultUrl) => setDeepfakeUrlVideo({ url: resultUrl }),
  },
);

/**
 * Image tools
 **/

export const imageMagnifier = new Tool(
  "navbar_magnifier",
  "navbar_magnifier_description",
  magnifierSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  null,
  null,
  "magnifier",
  TOOL_GROUPS.VERIFICATION,
  <Magnifier />,
  <Footer type={FOOTER_TYPES.AFP} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "magnifier_text",
  },
);

export const imageMetadata = new Tool(
  "navbar_metadata_image",
  "navbar_metadata_description",
  metadataSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  null,
  null,
  "metadata_image",
  TOOL_GROUPS.VERIFICATION,
  <Metadata />,
  <Footer type={FOOTER_TYPES.AFP} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [
      /(pbs.twimg.com)|(youtu.be|youtube)|(instagram)|(fbcdn.net)|(vimeo)|(snapchat)|(tiktok.com)/,
    ],
    useInputUrl: false,
    text: "metadata_text",
  },
);

export const imageForensic = new Tool(
  "navbar_forensic",
  "navbar_forensic_description",
  forensicSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  null,
  null,
  "forensic",
  TOOL_GROUPS.VERIFICATION,
  <Forensic />,
  <Footer type={FOOTER_TYPES.ITI_BORELLI_AFP} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "forensic_text",
  },
);

export const imageOcr = new Tool(
  "navbar_ocr",
  "navbar_ocr_description",
  ocrSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  null,
  null,
  "ocr",
  TOOL_GROUPS.VERIFICATION,
  <OCR />,
  <Footer type={FOOTER_TYPES.USFD} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "ocr_text",
  },
);

export const imageGif = new Tool(
  "navbar_gif",
  "navbar_gif_description",
  gifSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.LOCK],
  [ROLES.REGISTERED_USER],
  "gif",
  TOOL_GROUPS.VERIFICATION,
  <CheckGif />,
  <Footer type={FOOTER_TYPES.BORELLI_AFP} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "gif_text",
  },
);

export const imageSyntheticDetection = new Tool(
  "navbar_synthetic_image_detection",
  "navbar_synthetic_image_detection_description",
  syntheticImageSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "syntheticImageDetection",
  TOOL_GROUPS.VERIFICATION,
  <SyntheticImageDetection />,
  <Footer type={FOOTER_TYPES.ITI_UNINA} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "synthetic_image_detection_text",
    resetUrl: resetSyntheticImageDetectionImage,
    setUrl: (resultUrl) => setSyntheticImageDetectionUrl({ url: resultUrl }),
  },
);

export const imageGeolocation = new Tool(
  "navbar_geolocation",
  "navbar_geolocation_description",
  geolocationSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "geolocation",
  TOOL_GROUPS.VERIFICATION,
  <Geolocation />,
  <Footer type={FOOTER_TYPES.ITI} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "geolocation_text",
    resetUrl: resetGeolocationImage,
    setUrl: setGeolocationUrl,
  },
);

/**
 * Audio tools
 **/

export const audioHiya = new Tool(
  "navbar_hiya",
  "navbar_hiya_description",
  audioFileSvgIcon,
  TOOLS_CATEGORIES.AUDIO,
  [TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "hiya",
  TOOL_GROUPS.VERIFICATION,
  <Hiya />,
  <Footer type={FOOTER_TYPES.HIYA} />,
);

/**
 * Search tools
 **/

export const searchTwitter = new Tool(
  "navbar_twitter",
  "navbar_twitter_description",
  twitterSearchSvgIcon,
  TOOLS_CATEGORIES.SEARCH,
  null,
  null,
  "twitter",
  TOOL_GROUPS.VERIFICATION,
  <TwitterAdvancedSearch />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

const searchSemantic = new Tool(
  "navbar_semantic_search",
  "navbar_semantic_search_description",
  manageSearchSvgIcon,
  TOOLS_CATEGORIES.SEARCH,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.LOCK],
  [ROLES.REGISTERED_USER],
  "semanticSearch",
  TOOL_GROUPS.VERIFICATION,
  <SemanticSearch />,
  <Footer type={FOOTER_TYPES.KINIT} />,
);

const searchCovid = new Tool(
  "navbar_covidsearch",
  "navbar_covidsearch_description",
  covidSearchSvgIcon,
  TOOLS_CATEGORIES.SEARCH,
  null,
  null,
  "factcheck",
  TOOL_GROUPS.VERIFICATION,
  null,
  null,
);

const searchXnetwork = new Tool(
  "navbar_xnetwork",
  "navbar_xnetwork_description",
  xnetworkSvgIcon,
  TOOLS_CATEGORIES.SEARCH,
  null,
  null,
  "xnetwork",
  TOOL_GROUPS.VERIFICATION,
  null,
  null,
);

const machineGeneratedText = new Tool(
  "navbar_mgt",
  "navbar_mgt_description",
  mgtSvgIcon,
  TOOLS_CATEGORIES.SEARCH,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW],
  [ROLES.EXTRA_FEATURE],
  "mgt",
  TOOL_GROUPS.VERIFICATION,
  <MachineGeneratedText />,
  <Footer type={FOOTER_TYPES.KINIT} />,
);

/**
 * Data Analysis tools
 **/

export const dataAnalysisSna = new Tool(
  "navbar_twitter_sna",
  "navbar_twitter_sna_description",
  twitterSnaSvgIcon,
  TOOLS_CATEGORIES.DATA_ANALYSIS,
  [TOOL_STATUS_ICON.LOCK],
  null,
  "twitterSna",
  TOOL_GROUPS.VERIFICATION,
  <TwitterSna />,
  <Footer type={FOOTER_TYPES.USFD_AFP_EU_DISINFOLAB} />,
);

const dataAnalysisCrowdtangle = new Tool(
  "navbar_twitter_crowdtangle",
  "navbar_twitter_crowdtangle_description",
  csvSnaSvgIcon,
  TOOLS_CATEGORIES.DATA_ANALYSIS,
  null,
  null,
  "csvSna",
  TOOL_GROUPS.VERIFICATION,
  null,
  null,
);

export const newSna = new Tool(
  "navbar_sna",
  "navbar_sna_description",
  twitterSnaSvgIcon,
  TOOLS_CATEGORIES.DATA_ANALYSIS,
  [TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER, ROLES.EVALUATION],
  "Sna",
  TOOL_GROUPS.VERIFICATION,
  <SNA />,
  <Footer type={FOOTER_TYPES.AFP_URBINO_VIGINUM} />,
);

const disinfoDeck = new Tool(
  "navbar_disinfo_deck",
  "navbar_disinfo_deck_description",
  disinfoDeckIcon,
  TOOLS_CATEGORIES.DATA_ANALYSIS,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW],
  [
    ROLES.BETA_TESTER,
    ROLES.EVALUATION,
    ROLES.EXTRA_FEATURE,
    ROLES.AFP_C2PA_GOLD,
  ],
  "disinfoDeck",
  TOOL_GROUPS.VERIFICATION,
  null,
  null,
);

/**
 * Other tools
 **/

export const archiving = new Tool(
  "navbar_archiving",
  "navbar_archiving_description",
  archiveSvgIcon,
  TOOLS_CATEGORIES.OTHER,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.LOCK],
  [ROLES.ARCHIVE],
  "archive",
  TOOL_GROUPS.VERIFICATION,
  <Archive />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

export const chatbot = new Tool(
  "navbar_chatbot",
  "navbar_chatbot_description",
  chatbotSvgIcon,
  TOOLS_CATEGORIES.OTHER,
  [TOOL_STATUS_ICON.NEW],
  [ROLES.EXTRA_FEATURE],
  "chatbot",
  TOOL_GROUPS.VERIFICATION,
  <Chatbot />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

/**
 *
 * Other Group tools
 */
const afpDigitalCourses = new Tool(
  "",
  "",
  AfpDigitalCoursesIconComponent,
  null,
  null,
  null,
  "afpDigitalCourses",
  TOOL_GROUPS.MORE,
  null,
  null,
);

const about = new Tool(
  "navbar_about",
  "",
  aboutSvgIcon,
  null,
  null,
  null,
  "about",
  TOOL_GROUPS.MORE,
  <About />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

const c2paData = new Tool(
  "navbar_c2pa",
  "navbar_c2pa_description",
  c2paSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.LOCK],
  [ROLES.REGISTERED_USER],
  "c2pa",
  TOOL_GROUPS.VERIFICATION,
  <C2paData />,
  <Footer type={FOOTER_TYPES.AFP} />,
  {
    processLinksAccepted: [KNOWN_LINKS.MISC, KNOWN_LINKS.OWN],
    exceptions: [],
    useInputUrl: false,
    text: "c2pa_text",
    resetUrl: resetC2paState,
    setUrl: c2paUrlSet,
  },
);

export const tools = Object.freeze([
  toolsHome,
  videoAnalysis,
  keyframes,
  thumbnails,
  videoMetadata,
  videoDeepfake,
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
