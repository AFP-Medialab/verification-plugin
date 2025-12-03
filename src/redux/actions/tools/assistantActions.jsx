export const setUrlMode = (mode) => {
  return {
    type: "SET_MODE",
    payload: {
      urlMode: mode,
    },
  };
};

export const setImageVideoSelected = (imageVideoSelected) => {
  return {
    type: "SET_IMAGE_VIDEO_SELECTED",
    payload: {
      imageVideoSelected: imageVideoSelected,
    },
  };
};

export const setInputUrl = (inputUrl, inputUrlType) => {
  return {
    type: "SET_INPUT_URL",
    payload: {
      inputUrl: inputUrl,
      inputUrlType: inputUrlType,
    },
  };
};

export const setErrorKey = (errorKey) => {
  return {
    type: "SET_ERROR_KEY",
    payload: {
      errorKey: errorKey,
    },
  };
};

export const setProcessUrlActions = (contentType, actions) => {
  return {
    type: "SET_PROCESS_URL_ACTIONS",
    payload: {
      processUrlType: contentType,
      processUrlActions: actions,
    },
  };
};

export const setProcessUrl = (processUrl, processUrlType) => {
  return {
    type: "SET_PROCESS_URL",
    payload: {
      processUrl: processUrl,
      processUrlType: processUrlType,
    },
  };
};

export const setScrapedData = (
  text,
  lang,
  links,
  images,
  videos,
  textHtmlMap,
  collectedComments,
) => {
  return {
    type: "SET_SCRAPED_DATA",
    payload: {
      urlText: text,
      textLang: lang,
      linkList: links,
      imageList: images,
      videoList: videos,
      urlTextHtmlMap: textHtmlMap,
      collectedComments: collectedComments,
    },
  };
};

export const setInputSourceCredDetails = (
  positiveSC,
  cautionSC,
  mixedSC,
  extractedSC,
  trafficLights,
  sourceTypes,
  extractedLks,
  inputSCLoading,
  inputSCDone,
  inputSCFail,
) => {
  return {
    type: "SET_INPUT_SC_DETAILS",
    payload: {
      positiveSourceCred: positiveSC,
      cautionSourceCred: cautionSC,
      mixedSourceCred: mixedSC,
      extractedSourceCred: extractedSC,
      trafficLightColors: trafficLights,
      sourceTypes: sourceTypes,
      extractedLinks: extractedLks,
      inputSCLoading: inputSCLoading,
      inputSCDone: inputSCDone,
      inputSCFail: inputSCFail,
    },
  };
};

export const setAssistantLoading = (loading) => {
  return {
    type: "SET_LOADING",
    payload: {
      loading: loading,
    },
  };
};

export const setMissingMedia = (missingMedia) => {
  return {
    type: "SET_MISSING_MEDIA",
    payload: {
      missingMedia: missingMedia,
    },
  };
};

export const setDbkfTextMatchDetails = (
  textMatch,
  textMatchLoading,
  textMatchDone,
  textMatchFail,
) => {
  return {
    type: "SET_DBKF_TEXT_MATCH_DETAILS",
    payload: {
      dbkfTextMatch: textMatch,
      dbkfTextMatchLoading: textMatchLoading,
      dbkfTextMatchDone: textMatchDone,
      dbkfTextMatchFail: textMatchFail,
    },
  };
};

export const setDbkfImageMatchDetails = (
  imageMatch,
  dbkfMediaMatchLoading,
  dbkfMediaMatchDone,
  dbkfMediaMatchFail,
) => {
  return {
    type: "SET_DBKF_IMAGE_MATCH_DETAILS",
    payload: {
      dbkfImageMatch: imageMatch,
      dbkfMediaMatchLoading: dbkfMediaMatchLoading,
      dbkfMediaMatchDone: dbkfMediaMatchDone,
      dbkfMediaMatchFail: dbkfMediaMatchFail,
    },
  };
};

export const setDbkfVideoMatchDetails = (
  videoMatch,
  dbkfMediaMatchLoading,
  dbkfMediaMatchDone,
  dbkfMediaMatchFail,
) => {
  return {
    type: "SET_DBKF_VIDEO_MATCH_DETAILS",
    payload: {
      dbkfVideoMatch: videoMatch,
      dbkfMediaMatchLoading: dbkfMediaMatchLoading,
      dbkfMediaMatchDone: dbkfMediaMatchDone,
      dbkfMediaMatchFail: dbkfMediaMatchFail,
    },
  };
};

export const setNewsTopicDetails = (ntResult, ntLoading, ntDone, ntFail) => {
  return {
    type: "SET_NEWS_TOPIC_DETAILS",
    payload: {
      newsFramingResult: ntResult,
      newsFramingLoading: ntLoading,
      newsFramingDone: ntDone,
      newsFramingFail: ntFail,
    },
  };
};

export const setNewsGenreDetails = (ngResult, ngLoading, ngDone, ngFail) => {
  return {
    type: "SET_NEWS_GENRE_DETAILS",
    payload: {
      newsGenreResult: ngResult,
      newsGenreLoading: ngLoading,
      newsGenreDone: ngDone,
      newsGenreFail: ngFail,
    },
  };
};

export const setPersuasionDetails = (
  perResult,
  perLoading,
  perDone,
  perFail,
) => {
  return {
    type: "SET_PERSUASION_DETAILS",
    payload: {
      persuasionResult: perResult,
      persuasionLoading: perLoading,
      persuasionDone: perDone,
      persuasionFail: perFail,
    },
  };
};

export const setSubjectivityDetails = (
  subResult,
  subLoading,
  subDone,
  subFail,
) => {
  return {
    type: "SET_SUBJECTIVITY_DETAILS",
    payload: {
      subjectivityResult: subResult,
      subjectivityLoading: subLoading,
      subjectivityDone: subDone,
      subjectivityFail: subFail,
    },
  };
};

export const setPrevFactChecksDetails = (
  pfcResult,
  pfcLoading,
  pfcDone,
  pfcFail,
) => {
  return {
    type: "SET_PREV_FACT_CHECKS_DETAILS",
    payload: {
      prevFactChecksResult: pfcResult,
      prevFactChecksLoading: pfcLoading,
      prevFactChecksDone: pfcDone,
      prevFactChecksFail: pfcFail,
    },
  };
};

export const setMachineGeneratedTextChunksDetails = (
  mgtcResult,
  mgtcLoading,
  mgtcDone,
  mgtcFail,
) => {
  return {
    type: "SET_MACHINE_GENERATED_TEXT_CHUNKS_DETAILS",
    payload: {
      machineGeneratedTextChunksResult: mgtcResult,
      machineGeneratedTextChunksLoading: mgtcLoading,
      machineGeneratedTextChunksDone: mgtcDone,
      machineGeneratedTextChunksFail: mgtcFail,
    },
  };
};

export const setMachineGeneratedTextSentencesDetails = (
  mgtsResult,
  mgtsLoading,
  mgtsDone,
  mgtsFail,
) => {
  return {
    type: "SET_MACHINE_GENERATED_TEXT_SENTENCES_DETAILS",
    payload: {
      machineGeneratedTextSentencesResult: mgtsResult,
      machineGeneratedTextSentencesLoading: mgtsLoading,
      machineGeneratedTextSentencesDone: mgtsDone,
      machineGeneratedTextSentencesFail: mgtsFail,
    },
  };
};

export const setMultilingualStanceDetails = (
  msResult,
  msLoading,
  msDone,
  msFail,
) => {
  return {
    type: "SET_MULTILINGUAL_STANCE_DETAILS",
    payload: {
      multilingualStanceResult: msResult,
      multilingualStanceLoading: msLoading,
      multilingualStanceDone: msDone,
      multilingualStanceFail: msFail,
    },
  };
};

export const setNeDetails = (
  neResultCategory,
  neResultCount,
  neLoading,
  neDone,
  neFail,
) => {
  return {
    type: "SET_NE_DETAILS",
    payload: {
      neResultCategory: neResultCategory,
      neResultCount: neResultCount,
      neLoading: neLoading,
      neDone: neDone,
      neFail: neFail,
    },
  };
};

export const setSingleMediaPresent = (singleMediaPresent) => {
  return {
    type: "SET_SINGLE_MEDIA_PRESENT",
    payload: {
      singleMediaPresent: singleMediaPresent,
    },
  };
};

export const setWarningExpanded = (warningExpanded) => {
  return {
    type: "SET_WARNING_EXPANDED",
    payload: {
      warningExpanded: warningExpanded,
    },
  };
};

export const setAssuranceExpanded = (assuranceExpanded) => {
  return {
    type: "SET_ASSURANCE_EXPANDED",
    payload: {
      assuranceExpanded: assuranceExpanded,
    },
  };
};

export const setStateExpanded = (stateExpanded) => {
  return {
    type: "SET_STATE_EXPANDED",
    payload: {
      stateExpanded: stateExpanded,
    },
  };
};

export const submitInputUrl = (inputUrl) => {
  return {
    type: "SUBMIT_INPUT_URL",
    payload: {
      inputUrl: inputUrl,
    },
  };
};

export const submitUpload = (uploadFileUrl, contentType) => {
  return {
    type: "SUBMIT_UPLOAD",
    payload: {
      uploadFileUrl: uploadFileUrl,
      contentType: contentType,
    },
  };
};

export const setVideoThumbnailUrl = (videoThumbnailUrl) => {
  return {
    type: "SET_VIDEO_THUMBNAIL_URL",
    payload: {
      videoThumbnailUrl: videoThumbnailUrl,
    },
  };
};

export const cleanAssistantState = () => {
  return {
    type: "CLEAN_STATE",
  };
};

export const setImportantSentenceThreshold = (threshold) => {
  return {
    type: "SET_IMPORTANT_SENTENCE_THRESHOLD",
    payload: threshold,
  };
};

export const setCurrentLabel = (currentLabel) => {
  return {
    type: "SET_CURRENT_LABEL",
    payload: currentLabel,
  };
};
