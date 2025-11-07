import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";

/**
 * Enum for keyframe input types.
 * @readonly
 * @enum {string}
 */
export const KeyframeInputType = {
  URL: "url",
  FILE: "file",
};

/**
 * Set of valid keyframe input types for quick validation.
 * @type {Set<string>}
 */
export const validKeyframeTypes = new Set(Object.values(KeyframeInputType));

/**
 * Helper function to apply options by invoking a callback for each defined option value.
 * @param {Object} options - The options object.
 * @param {function} callback - The callback to invoke with key and value.
 */
const applyOptions = (options, callback) => {
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      callback(key, value);
    }
  });
};

/**
 * API URLs for each keyframe input type.
 */
const API_URLS = {
  [KeyframeInputType.FILE]: process.env.REACT_APP_KEYFRAME_API_FILE,
  [KeyframeInputType.URL]: process.env.REACT_APP_KEYFRAME_API,
};

/**
 * Creates a keyframe extraction job by sending a request to the keyframe API.
 * Supports input via URL or file (file mode to be implemented).
 *
 * @param {function} authenticatedRequest - The authenticated request function to send API requests.
 * @param {string} type - The type of keyframe input must be one of KeyframeInputType.
 * @param {string | File} value - The URL or the File to process.
 * @param {Object} [options={}] - Optional parameters for the keyframe job.
 * @param {number} [options.download_max_height] - Maximum height for download.
 * @param {number} [options.process_level] - Processing level.
 * @param {boolean} [options.audio] - Whether to include audio.
 * @param {number} [options.sensitivity] - Sensitivity setting.
 * @returns {Promise<string>} The session ID of the created keyframe job.
 * @throws {Error} Will throw an error if the input type is invalid or if the API response does not contain a valid session ID.
 */
export const createKeyframeJobApi = async (
  authenticatedRequest,
  type,
  value,
  options = {},
) => {
  if (!validKeyframeTypes.has(type)) {
    throw new Error(`Invalid keyframe type ${type}`);
  }

  const defaultConfig = {
    maxBodyLength: Infinity,
  };

  let config;

  if (type === KeyframeInputType.FILE) {
    const formData = new FormData();
    formData.append("file", value);

    applyOptions(options, (key, val) => {
      formData.append(key, val);
    });

    config = {
      method: "post",
      url: API_URLS[KeyframeInputType.FILE],
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      ...defaultConfig,
    };
  } else {
    // URL mode: Prepare the request payload with the video URL and optional parameters.
    const payload = {
      video: value,
    };

    applyOptions(options, (key, val) => {
      payload[key] = val;
    });

    const d = JSON.stringify(payload);

    // Configure the POST request to the keyframe API endpoint.
    config = {
      method: "post",
      url: API_URLS[KeyframeInputType.URL],
      headers: {
        "Content-Type": "application/json",
      },
      data: d,
      ...defaultConfig,
      timeout: 30000,
    };
  }

  // Send the request and wait for the response.
  const response = await authenticatedRequest(config);

  // Validate the response to ensure it contains a valid session ID.
  if (
    !response.data ||
    !response.data.session ||
    typeof response.data.session !== "string" ||
    response.data.session === ""
  ) {
    throw new Error("Invalid KSE session");
  }

  // Return the session ID for the created keyframe job.
  return response.data.session;
};

/**
 * React hook to get a function for creating keyframe extraction jobs.
 * Uses the authenticated request hook internally.
 *
 * @returns {(type: string, value: string | File, options?: Object) => Promise<string>}
 * A function that creates a keyframe job given the type, value, and optional parameters.
 */
export const useCreateKeyframeJob = () => {
  const authenticatedRequest = useAuthenticatedRequest();

  return (type, value, options = {}) =>
    createKeyframeJobApi(authenticatedRequest, type, value, options);
};
