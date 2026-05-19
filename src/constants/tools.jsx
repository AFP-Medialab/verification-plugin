import CsvSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/CSV_SNA.svg?react";
import TwitterSnaIcon from "../components/NavBar/images/SVG/DataAnalysis/Twitter_sna.svg?react";
import C2paIcon from "../components/NavBar/images/SVG/Image/C2pa.svg?react";
import DeepfakeIcon from "../components/NavBar/images/SVG/Image/Deepfake.svg?react";
import ForensicIcon from "../components/NavBar/images/SVG/Image/Forensic.svg?react";
import GeolocationIcon from "../components/NavBar/images/SVG/Image/Geolocation.svg?react";
import GifIcon from "../components/NavBar/images/SVG/Image/Gif.svg?react";
import MagnifierIcon from "../components/NavBar/images/SVG/Image/Magnifier.svg?react";
import MetadataIcon from "../components/NavBar/images/SVG/Image/Metadata.svg?react";
import OcrIcon from "../components/NavBar/images/SVG/Image/OCR.svg?react";
import AboutIcon from "../components/NavBar/images/SVG/Navbar/About.svg?react";
import ToolsIcon from "../components/NavBar/images/SVG/Navbar/Tools.svg?react";
import CovidSearchIcon from "../components/NavBar/images/SVG/Search/Covid19.svg?react";
import TwitterSearchIcon from "../components/NavBar/images/SVG/Search/Twitter_search.svg?react";
import XnetworkIcon from "../components/NavBar/images/SVG/Search/Xnetwork.svg?react";
import KeyframesIcon from "../components/NavBar/images/SVG/Video/Keyframes.svg?react";
import ThumbnailsIcon from "../components/NavBar/images/SVG/Video/Thumbnails.svg?react";
import AnalysisIcon from "../components/NavBar/images/SVG/Video/Video_analysis.svg?react";
import React from "react";

import SvgIcon from "@mui/material/SvgIcon";

import {
  Archive as ArchiveIcon,
  AudioFile,
  Dashboard,
  FaceRetouchingNatural,
  GeneratingTokensRounded,
  Gradient,
  ManageSearch,
  SmartToy,
} from "@mui/icons-material";

import { FOOTER_TYPES, Footer } from "@Shared/Footer/Footer";

import AfpDigitalCoursesIconComponent from "../components/NavBar/images/SVG/Navbar/AfpDigitalCoursesIcon";
import { Tool } from "./toolsData";
import * as data from "./toolsData";

// Re-export everything from the pure-data module so existing imports of
// @/constants/tools continue to work unchanged. The named Tool instances
// exported below shadow the same-named config objects from toolsData.
export * from "./toolsData";

// ---------------------------------------------------------------------------
// Lazy-loaded tool components
// ---------------------------------------------------------------------------

const C2paData = React.lazy(
  () => import("@/components/NavItems/tools/C2pa/C2pa"),
);
const SNA = React.lazy(() => import("@/components/NavItems/tools/SNA/SNA"));
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
const PoiForensics = React.lazy(
  () => import("../components/NavItems/tools/POIForensics/PoiForensics"),
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

// ---------------------------------------------------------------------------
// Icon wrapper components
// ---------------------------------------------------------------------------

const ToolsSvgIcon = (props) => (
  <SvgIcon component={ToolsIcon} inheritViewBox {...props} />
);
const AnalysisSvgIcon = (props) => (
  <SvgIcon component={AnalysisIcon} inheritViewBox {...props} />
);
const KeyframesSvgIcon = (props) => (
  <SvgIcon component={KeyframesIcon} inheritViewBox {...props} />
);
const ThumbnailsSvgIcon = (props) => (
  <SvgIcon component={ThumbnailsIcon} inheritViewBox {...props} />
);
const MetadataSvgIcon = (props) => (
  <SvgIcon component={MetadataIcon} inheritViewBox {...props} />
);
const DeepfakeSvgIcon = (props) => (
  <SvgIcon component={DeepfakeIcon} inheritViewBox {...props} />
);
const PoiForensicSvgIcon = (props) => (
  <FaceRetouchingNatural inheritViewBox {...props} />
);
const MagnifierSvgIcon = (props) => (
  <SvgIcon component={MagnifierIcon} inheritViewBox {...props} />
);
const ForensicSvgIcon = (props) => (
  <SvgIcon component={ForensicIcon} inheritViewBox {...props} />
);
const OcrSvgIcon = (props) => (
  <SvgIcon component={OcrIcon} inheritViewBox {...props} />
);
const GifSvgIcon = (props) => (
  <SvgIcon component={GifIcon} inheritViewBox {...props} />
);
const SyntheticImageSvgIcon = (props) => <Gradient inheritViewBox {...props} />;
const GeolocationSvgIcon = (props) => (
  <SvgIcon component={GeolocationIcon} inheritViewBox {...props} />
);
const AudioFileSvgIcon = (props) => <AudioFile inheritViewBox {...props} />;
const TwitterSearchSvgIcon = (props) => (
  <SvgIcon component={TwitterSearchIcon} inheritViewBox {...props} />
);
const ManageSearchSvgIcon = (props) => (
  <ManageSearch inheritViewBox {...props} />
);
const CovidSearchSvgIcon = (props) => (
  <SvgIcon component={CovidSearchIcon} inheritViewBox {...props} />
);
const XnetworkSvgIcon = (props) => (
  <SvgIcon component={XnetworkIcon} inheritViewBox {...props} />
);
const MgtSvgIcon = (props) => <GeneratingTokensRounded {...props} />;
const TwitterSnaSvgIcon = (props) => (
  <SvgIcon component={TwitterSnaIcon} inheritViewBox {...props} />
);
const CsvSnaSvgIcon = (props) => (
  <SvgIcon component={CsvSnaIcon} inheritViewBox {...props} />
);
const ArchiveSvgIcon = (props) => <ArchiveIcon {...props} />;
const AboutSvgIcon = (props) => (
  <SvgIcon component={AboutIcon} inheritViewBox {...props} />
);
const C2paSvgIcon = (props) => (
  <SvgIcon component={C2paIcon} inheritViewBox {...props} />
);
const DisinfoDeckIcon = (props) => <Dashboard {...props} />;
const ChatbotSvgIcon = (props) => <SmartToy {...props} />;

// ---------------------------------------------------------------------------
// Tool factory — combines a plain config with its UI-layer components.
// ---------------------------------------------------------------------------

const makeTool = (config, icon, content = null, footer = null) =>
  new Tool(
    config.titleKeyword,
    config.descriptionKeyword,
    icon,
    config.category,
    config.rolesIcons,
    config.rolesNeeded,
    config.path,
    config.toolGroup,
    content,
    footer,
    config.assistantProps,
  );

// ---------------------------------------------------------------------------
// Full Tool instances — these shadow the same-named plain configs re-exported
// via `export * from './toolsData'`, so importing from @/constants/tools
// always yields a complete Tool with icon, content, and footer.
// ---------------------------------------------------------------------------

export const toolsHome = makeTool(
  data.toolsHome,
  ToolsSvgIcon,
  <ToolsMenu />,
  <div />,
);
export const videoAnalysis = makeTool(
  data.videoAnalysis,
  AnalysisSvgIcon,
  <Analysis />,
  <Footer type={FOOTER_TYPES.ITI} />,
);
export const keyframes = makeTool(
  data.keyframes,
  KeyframesSvgIcon,
  <Keyframes />,
  <Footer type={FOOTER_TYPES.ITI} />,
);
export const thumbnails = makeTool(
  data.thumbnails,
  ThumbnailsSvgIcon,
  <Thumbnails />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const videoMetadata = makeTool(
  data.videoMetadata,
  MetadataSvgIcon,
  <Metadata />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const videoDeepfake = makeTool(
  data.videoDeepfake,
  DeepfakeSvgIcon,
  <DeepfakeVideo />,
  <Footer type={FOOTER_TYPES.ITI} />,
);
export const poiForensic = makeTool(
  data.poiForensic,
  PoiForensicSvgIcon,
  <PoiForensics />,
  <Footer type={FOOTER_TYPES.ITI} />,
);
export const imageMagnifier = makeTool(
  data.imageMagnifier,
  MagnifierSvgIcon,
  <Magnifier />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const imageMetadata = makeTool(
  data.imageMetadata,
  MetadataSvgIcon,
  <Metadata />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const imageForensic = makeTool(
  data.imageForensic,
  ForensicSvgIcon,
  <Forensic />,
  <Footer type={FOOTER_TYPES.ITI_BORELLI_AFP} />,
);
export const imageOcr = makeTool(
  data.imageOcr,
  OcrSvgIcon,
  <OCR />,
  <Footer type={FOOTER_TYPES.USFD} />,
);
export const imageGif = makeTool(
  data.imageGif,
  GifSvgIcon,
  <CheckGif />,
  <Footer type={FOOTER_TYPES.BORELLI_AFP} />,
);
export const imageSyntheticDetection = makeTool(
  data.imageSyntheticDetection,
  SyntheticImageSvgIcon,
  <SyntheticImageDetection />,
  <Footer type={FOOTER_TYPES.ITI_UNINA} />,
);
export const imageGeolocation = makeTool(
  data.imageGeolocation,
  GeolocationSvgIcon,
  <Geolocation />,
  <Footer type={FOOTER_TYPES.ITI} />,
);
export const audioHiya = makeTool(
  data.audioHiya,
  AudioFileSvgIcon,
  <Hiya />,
  <Footer type={FOOTER_TYPES.HIYA} />,
);
export const searchTwitter = makeTool(
  data.searchTwitter,
  TwitterSearchSvgIcon,
  <TwitterAdvancedSearch />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const searchSemantic = makeTool(
  data.searchSemantic,
  ManageSearchSvgIcon,
  <SemanticSearch />,
  <Footer type={FOOTER_TYPES.KINIT} />,
);
export const searchCovid = makeTool(data.searchCovid, CovidSearchSvgIcon);
export const searchXnetwork = makeTool(data.searchXnetwork, XnetworkSvgIcon);
export const machineGeneratedText = makeTool(
  data.machineGeneratedText,
  MgtSvgIcon,
  <MachineGeneratedText />,
  <Footer type={FOOTER_TYPES.KINIT} />,
);
export const dataAnalysisSna = makeTool(
  data.dataAnalysisSna,
  TwitterSnaSvgIcon,
  <TwitterSna />,
  <Footer type={FOOTER_TYPES.USFD_AFP_EU_DISINFOLAB} />,
);
export const dataAnalysisCrowdtangle = makeTool(
  data.dataAnalysisCrowdtangle,
  CsvSnaSvgIcon,
);
export const newSna = makeTool(
  data.newSna,
  TwitterSnaSvgIcon,
  <SNA />,
  <Footer type={FOOTER_TYPES.AFP_URBINO_VIGINUM} />,
);
export const disinfoDeck = makeTool(data.disinfoDeck, DisinfoDeckIcon);
export const archiving = makeTool(
  data.archiving,
  ArchiveSvgIcon,
  <Archive />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const chatbot = makeTool(
  data.chatbot,
  ChatbotSvgIcon,
  <Chatbot />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const afpDigitalCourses = makeTool(
  data.afpDigitalCourses,
  AfpDigitalCoursesIconComponent,
);
export const about = makeTool(
  data.about,
  AboutSvgIcon,
  <About />,
  <Footer type={FOOTER_TYPES.AFP} />,
);
export const c2paData = makeTool(
  data.c2paData,
  C2paSvgIcon,
  <C2paData />,
  <Footer type={FOOTER_TYPES.AFP} />,
);

export const tools = Object.freeze([
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
