import { combineReducers } from "redux";

import assistantReducer from "./assistantReducer";
import authenticationReducer from "./authenticationReducer";
import cookiesReducer from "./cookiesReducers";
import defaultLanguageReducer from "./defaultLanguageReducer";
import dictionaryReducer from "./dictionaryReducer";
import errorReducer from "./errorReducer";
import humanRightsCheckBoxReducer from "./humanRightsCheckBoxReducer";
import interactiveExplanationReducer from "./interactiveExplanationReducer";
import languageReducer from "./languageReducer";
import languageSupportReducer from "./languageSupportReducer";
import navReducer from "./navReducer";
import analysisReducer from "./tools/analysisReducer";
import archiveReducer from "./tools/archiveReducer";
import c2paReducer from "./tools/c2paReducer";
import deepfakeReducerVideo from "./tools/deepfakeVideoReducer";
import forensicReducer from "./tools/forensicReducer";
import geolocationReducer from "./tools/geolocationReducer";
import gifReducer from "./tools/gifReducer";
import keyframesReducer from "./tools/keyframesReducer";
import loccusReducer from "./tools/loccusReducer";
import magnifierReducer from "./tools/magnifierReducer";
import metadataReducer from "./tools/metadataReducer";
import ocrReducer from "./tools/ocrReducer";
import syntheticImageDetectionReducer from "./tools/syntheticImageDetectionReducer";
import thumbnailsReducer from "./tools/thumbnailsReducer";
import toolReducer from "./tools/toolReducer";
import twitterSnaReducer from "./tools/twitterSnaReducer";
import videoRightsReducer from "./tools/videoRightsReducer";

const allReducers = combineReducers({
  // Global state
  language: languageReducer,
  defaultLanguage: defaultLanguageReducer,
  dictionary: dictionaryReducer,
  languageSupport: languageSupportReducer,
  cookies: cookiesReducer,
  error: errorReducer,
  humanRightsCheckBox: humanRightsCheckBoxReducer,
  interactiveExplanation: interactiveExplanationReducer,

  // Auth
  userSession: authenticationReducer,

  // Navigation
  nav: navReducer,
  tool: toolReducer,

  // Tools
  analysis: analysisReducer,
  forensic: forensicReducer,
  keyframes: keyframesReducer,
  magnifier: magnifierReducer,
  metadata: metadataReducer,
  thumbnails: thumbnailsReducer,
  twitterSna: twitterSnaReducer,
  videoRights: videoRightsReducer,
  assistant: assistantReducer,
  ocr: ocrReducer,
  gif: gifReducer,
  syntheticImageDetection: syntheticImageDetectionReducer,
  syntheticAudioDetection: loccusReducer,
  deepfakeVideo: deepfakeReducerVideo,
  geolocation: geolocationReducer,
  c2pa: c2paReducer,
  archive: archiveReducer,
});

export default allReducers;
