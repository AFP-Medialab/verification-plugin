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

export const addChatbotMessage = (message, sent) => {
  return {
    type: "ADD_CHATBOT_MESSAGE",
    payload: {
      message: message,
      sent: sent,
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
    },
  };
};

export const setInputSourceCredDetails = (
  positiveSC,
  cautionSC,
  mixedSC,
  extractedSC,
  trafficLights,
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

export const setMachineGeneratedTextDetails = (
  mgtResult,
  mgtLoading,
  mgtDone,
  mgtFail,
) => {
  return {
    type: "SET_MACHINE_GENERATED_TEXT_DETAILS",
    payload: {
      machineGeneratedTextResult: mgtResult,
      machineGeneratedTextLoading: mgtLoading,
      machineGeneratedTextDone: mgtDone,
      machineGeneratedTextFail: mgtFail,
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

export const submitUserChatbotMessage = (message, email, archiveURL) => {
  return {
    type: "SUBMIT_USER_CHATBOT_MESSAGE",
    payload: {
      email: email,
      message: message,
      archiveURL: archiveURL,
    },
  };
};

export const submitUpload = (contentType) => {
  return {
    type: "SUBMIT_UPLOAD",
    payload: {
      contentType: contentType,
    },
  };
};

export const cleanAssistantState = () => {
  return {
    type: "CLEAN_STATE",
  };
};
