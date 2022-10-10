import { combineReducers } from 'redux'
import authenticationReducer from './authenticationReducer';
import defaultLanguageReducer from './defaultLanguageReducer';
import dictionaryReducer from './dictionaryReducer';
import errorReducer from './errorReducer';
import languageReducer from './languageReducer'
import navReducer from './navReducer';
import toolReducer from './tools/toolReducer';
import assistantReducer from './assistantReducer';
import humanRightsCheckBoxReducer from './humanRightsCheckBoxReducer';
import interactiveExplanationReducer from './interactiveExplanationReducer';
import analysisReducer from './tools/analysisReducer';
import keyframesReducer from './tools/keyframesReducer';
import thumbnailsReducer from './tools/thumbnailsReducer';
import videoRightsReducer from "./tools/videoRightsReducer";
import metadataReducer from './tools/metadataReducer';
import deepfakeReducerImage from "./tools/deepfakeImageReducer";
import deepfakeReducerVideo from "./tools/deepfakeVideoReducer";
import ImageAnalysisReducer from "./tools/analysisReducerImage";
import magnifierReducer from "./tools/magnifierReducer";
import forensicReducer from './tools/forensicReducer';
import gifReducer from './tools/gifReducer';
import cookiesReducer from './cookiesReducers';
import ocrReducer from './tools/ocrReducer';
import geolocationReducer from './tools/geolocationReducer';

const allReducers = combineReducers({
    language: languageReducer,
    defaultLanguage : defaultLanguageReducer,
    dictionary : dictionaryReducer,
    nav : navReducer,
    tool : toolReducer,
    humanRightsCheckBox : humanRightsCheckBoxReducer,
    interactiveExplanation : interactiveExplanationReducer,
    error : errorReducer,
    userSession : authenticationReducer,
    analysis: analysisReducer,
    analysisImage: ImageAnalysisReducer,
    forensic : forensicReducer,
    keyframes : keyframesReducer,
    magnifier: magnifierReducer,
    metadata : metadataReducer,
    thumbnails : thumbnailsReducer,
    videoRights : videoRightsReducer,
    cookies : cookiesReducer,
    assistant : assistantReducer,
    ocr: ocrReducer,
    gif: gifReducer,
    deepfakeImage: deepfakeReducerImage,
    deepfakeVideo: deepfakeReducerVideo,
    geolocation: geolocationReducer,
})

export default allReducers;