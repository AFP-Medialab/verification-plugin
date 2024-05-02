export const setOcrInput = (url) => {
  return {
    type: "SET_OCR_INPUT",
    payload: {
      url: url,
    },
  };
};
export const setb64InputFile = (b64Content) => {
  return {
    type: "SET_B64_CONTENT",
    payload: {
      b64Content: b64Content,
    },
  };
};

export const setOcrBinaryImage = (binaryImage) => {
  return {
    type: "SET_IMAGE_BINARY",
    payload: {
      binaryImage: binaryImage,
    },
  };
};

export const setOcrResult = (loading, fail, done, result, fullText) => {
  return {
    type: "SET_OCR_RESULT",
    payload: {
      loading: loading,
      fail: fail,
      done: done,
      result: result,
      fullText: fullText,
    },
  };
};

export const setOcrErrorKey = (errorKey) => {
  return {
    type: "SET_OCR_ERROR_KEY",
    payload: {
      errorKey: errorKey,
    },
  };
};

export const loadOcrScripts = () => {
  return {
    type: "OCR_LOAD_SCRIPTS",
  };
};

export const setOcrScripts = (scripts) => {
  return {
    type: "SET_SCRIPTS",
    payload: {
      scripts: scripts,
    },
  };
};

export const setSelectedScript = (script) => {
  return {
    type: "SET_SELECTED_SCRIPT",
    payload: {
      selectedScript: script,
    },
  };
};

export const resetOcrState = () => {
  return {
    type: "RESET_OCR_STATE",
  };
};

export const setOcrReprocess = (boundingBox) => {
  return {
    type: "OCR_REPROCESS",
    payload: {
      boundingBox: boundingBox,
    },
  };
};

export const setReprocessLoading = (loading) => {
  return {
    type: "SET_REPROCESS_LOADING",
    payload: {
      reprocessBlockLoading: loading,
    },
  };
};

export const setReprocessOpen = (open) => {
  return {
    type: "SET_REPROCESS_OPEN",
    payload: {
      reprocessBlockOpen: open,
    },
  };
};
