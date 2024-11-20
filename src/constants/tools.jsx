import React from "react";

import { SvgIcon } from "@mui/material";
import {
  Archive as ArchiveIcon,
  AudioFile,
  Gradient,
  ManageSearch,
} from "@mui/icons-material";

import ToolsIcon from "../components/NavBar/images/SVG/Navbar/Tools.svg";

import AnalysisIcon from "../components/NavBar/images/SVG/Video/Video_analysis.svg";
import KeyframesIcon from "../components/NavBar/images/SVG/Video/Keyframes.svg";
import ThumbnailsIcon from "../components/NavBar/images/SVG/Video/Thumbnails.svg";
import VideoRightsIcon from "../components/NavBar/images/SVG/Video/Video_rights.svg";

import MetadataIcon from "../components/NavBar/images/SVG/Image/Metadata.svg";
import DeepfakeIcon from "../components/NavBar/images/SVG/Image/Deepfake.svg";
import ImageAnalysisIcon from "../components/NavBar/images/SVG/Image/Image_analysis.svg";
import MagnifierIcon from "../components/NavBar/images/SVG/Image/Magnifier.svg";
import ForensicIcon from "../components/NavBar/images/SVG/Image/Forensic.svg";
import OcrIcon from "../components/NavBar/images/SVG/Image/OCR.svg";
import GifIcon from "../components/NavBar/images/SVG/Image/Gif.svg";
import GeolocationIcon from "../components/NavBar/images/SVG/Image/Geolocation.svg";
import C2paIcon from "../components/NavBar/images/SVG/Image/C2pa.svg";

import TwitterSearchIcon from "../components/NavBar/images/SVG/Search/Twitter_search.svg";
import CovidSearchIcon from "../components/NavBar/images/SVG/Search/Covid19.svg";
import XnetworkIcon from "../components/NavBar/images/SVG/Search/Xnetwork.svg";

import TwitterSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/Twitter_sna.svg";
import CsvSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/CSV_SNA.svg";
import AboutIcon from "../components/NavBar/images/SVG/Navbar/About.svg";
import ToolsMenu from "../components/NavItems/tools/Alltools/ToolsMenu";
import Analysis from "../components/NavItems/tools/Analysis/Analysis";
import { Footer, FOOTER_TYPES } from "../components/Shared/Footer/Footer";
import Keyframes from "../components/NavItems/tools/Keyframes/Keyframes";
import Thumbnails from "../components/NavItems/tools/Thumbnails/Thumbnails";
import VideoRights from "../components/NavItems/tools/VideoRights/VideoRights";
import Metadata from "../components/NavItems/tools/Metadata/Metadata";
import DeepfakeVideo from "../components/NavItems/tools/Deepfake/DeepfakeVideo";
import AnalysisImg from "../components/NavItems/tools/Analysis_images/Analysis";
import Magnifier from "../components/NavItems/tools/Magnifier/Magnifier";
import Forensic from "../components/NavItems/tools/Forensic/Forensic";
import OCR from "../components/NavItems/tools/OCR/OCR";
import CheckGif from "../components/NavItems/tools/Gif/CheckGif";
import SyntheticImageDetection from "../components/NavItems/tools/SyntheticImageDetection";
import DeepfakeImage from "../components/NavItems/tools/Deepfake/DeepfakeImage";
import Geolocation from "../components/NavItems/tools/Geolocation/Geolocation";
import Loccus from "../components/NavItems/tools/Loccus";
import TwitterAdvancedSearch from "../components/NavItems/tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import SemanticSearch from "../components/NavItems/tools/SemanticSearch";
import TwitterSna from "../components/NavItems/tools/TwitterSna/TwitterSna";
import Archive from "../components/NavItems/tools/Archive";
import About from "../components/NavItems/About/About";
import { ROLES } from "./roles";
import C2paData from "components/NavItems/tools/C2pa/C2pa";

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
  }
}

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

const videoRightsSvgIcon = (props) => {
  return <SvgIcon component={VideoRightsIcon} inheritViewBox {...props} />;
};

const metadataSvgIcon = (props) => {
  return <SvgIcon component={MetadataIcon} inheritViewBox {...props} />;
};

const deepfakeSvgIcon = (props) => {
  return <SvgIcon component={DeepfakeIcon} inheritViewBox {...props} />;
};

const imageAnalysisSvgIcon = (props) => {
  return <SvgIcon component={ImageAnalysisIcon} inheritViewBox {...props} />;
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

const twitterSnaSvgIcon = (props) => {
  return <SvgIcon component={TwitterSnaIcon} inheritViewBox {...props} />;
};

const csvSnaSvgIcon = (props) => {
  return <SvgIcon component={CsvSnaIcon} inheritViewBox {...props} />;
};

const archiveSvgIcon = (props) => {
  return <ArchiveIcon inheritViewBox {...props} />;
};

const aboutSvgIcon = (props) => {
  return <SvgIcon component={AboutIcon} inheritViewBox {...props} />;
};

const c2paSvgIcon = (props) => {
  return <SvgIcon component={C2paIcon} inheritViewBox {...props} />;
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
);

export const videoRights = new Tool(
  "navbar_rights",
  "navbar_rights_description",
  videoRightsSvgIcon,
  TOOLS_CATEGORIES.VIDEO,
  null,
  null,
  "copyright",
  TOOL_GROUPS.VERIFICATION,
  <VideoRights />,
  <Footer type={FOOTER_TYPES.GRIHO} />,
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
  <Metadata mediaType={"video"} />,
  <Footer type={FOOTER_TYPES.AFP} />,
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
);

/**
 * Image tools
 **/

export const imageAnalysis = new Tool(
  "navbar_analysis_image",
  "navbar_analysis_image_description",
  imageAnalysisSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  null,
  null,
  "analysisImage",
  TOOL_GROUPS.VERIFICATION,
  <AnalysisImg />,
  <Footer type={FOOTER_TYPES.ITI} />,
);

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
  <Metadata mediaType={"image"} />,
  <Footer type={FOOTER_TYPES.AFP} />,
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
);

const imageGif = new Tool(
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
);

export const imageDeepfake = new Tool(
  "navbar_deepfake_image",
  "navbar_deepfake_image_description",
  deepfakeSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "deepfakeImage",
  TOOL_GROUPS.VERIFICATION,
  <DeepfakeImage />,
  <Footer type={FOOTER_TYPES.ITI} />,
);

const imageGeolocation = new Tool(
  "navbar_geolocation",
  "navbar_geolocation_description",
  geolocationSvgIcon,
  TOOLS_CATEGORIES.IMAGE,
  [TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "geolocation",
  TOOL_GROUPS.VERIFICATION,
  <Geolocation />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

/**
 * Audio tools
 **/

const audioLoccus = new Tool(
  "navbar_loccus",
  "navbar_loccus_description",
  audioFileSvgIcon,
  TOOLS_CATEGORIES.AUDIO,
  [TOOL_STATUS_ICON.NEW, TOOL_STATUS_ICON.EXPERIMENTAL, TOOL_STATUS_ICON.LOCK],
  [ROLES.BETA_TESTER],
  "loccus",
  TOOL_GROUPS.VERIFICATION,
  <Loccus />,
  <Footer type={FOOTER_TYPES.LOCCUS} />,
);

/**
 * Search tools
 **/

const searchTwitter = new Tool(
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

/**
 * Data Analysis tools
 **/

const dataAnalysisSna = new Tool(
  "navbar_twitter_sna",
  "navbar_twitter_sna_description",
  twitterSnaSvgIcon,
  TOOLS_CATEGORIES.DATA_ANALYSIS,
  [TOOL_STATUS_ICON.LOCK],
  [ROLES.REGISTERED_USER],
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

/**
 * Other tools
 **/

const archiving = new Tool(
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

/**
 *
 * Other Group tools
 */
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
  null,
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
);

export const tools = Object.freeze([
  toolsHome,
  videoAnalysis,
  keyframes,
  thumbnails,
  videoRights,
  videoMetadata,
  videoDeepfake,
  imageAnalysis,
  imageMagnifier,
  imageMetadata,
  imageForensic,
  imageOcr,
  imageGif,
  imageSyntheticDetection,
  imageDeepfake,
  imageGeolocation,
  audioLoccus,
  searchTwitter,
  searchSemantic,
  searchCovid,
  searchXnetwork,
  dataAnalysisSna,
  dataAnalysisCrowdtangle,
  archiving,
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
