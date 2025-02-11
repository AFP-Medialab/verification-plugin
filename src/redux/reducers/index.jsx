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
import deepfakeReducerImage from "./tools/deepfakeImageReducer";
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
  language: languageReducer,
  defaultLanguage: defaultLanguageReducer,
  dictionary: dictionaryReducer,
  nav: navReducer,
  tool: toolReducer,
  humanRightsCheckBox: humanRightsCheckBoxReducer,
  interactiveExplanation: interactiveExplanationReducer,
  error: errorReducer,
  userSession: authenticationReducer,
  analysis: analysisReducer,
  forensic: forensicReducer,
  keyframes: keyframesReducer,
  magnifier: magnifierReducer,
  metadata: metadataReducer,
  thumbnails: thumbnailsReducer,
  twitterSna: twitterSnaReducer,
  videoRights: videoRightsReducer,
  cookies: cookiesReducer,
  assistant: assistantReducer,
  ocr: ocrReducer,
  gif: gifReducer,
  syntheticImageDetection: syntheticImageDetectionReducer,
  syntheticAudioDetection: loccusReducer,
  deepfakeImage: deepfakeReducerImage,
  deepfakeVideo: deepfakeReducerVideo,
  geolocation: geolocationReducer,
  languagesSupport: languageSupportReducer,
  c2pa: c2paReducer,
  archive: archiveReducer,
});

export default allReducers;
