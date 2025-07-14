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
 * Creates a keyframe extraction job by sending a request to the keyframe API.
 * Supports input via URL or file (file mode to be implemented).
 *
 * @param {function} authenticatedRequest - The authenticated request function to send API requests.
 * @param {string} type - The type of keyframe input must be one of KeyframeInputType.
 * @param {string | File} value - The URL or the File to process.
 * @returns {Promise<string>} The session ID of the created keyframe job.
 * @throws {Error} Will throw an error if the input type is invalid or if the API response does not contain a valid session ID.
 */
export const createKeyframeJobApi = async (
  authenticatedRequest,
  type,
  value,
) => {
  if (!validKeyframeTypes.has(type)) {
    throw new Error(`Invalid keyframe type ${type}`);
  }

  let config;

  if (type === KeyframeInputType.FILE) {
    // TODO: Implement file upload mode for keyframe extraction.
  } else {
    // URL mode: Prepare the request payload with the video URL.
    const d = JSON.stringify({
      video: value,
    });

    // Configure the POST request to the keyframe API endpoint.
    config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.REACT_APP_KEYFRAME_API_2,
      headers: {
        "Content-Type": "application/json",
      },
      data: d,
      timeout: 10000, // Set a timeout of 10 seconds for the request.
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
 * @returns {(type: string, value: string | File) => Promise<string>}
 * A function that creates a keyframe job given the type and value.
 */
export const useCreateKeyframeJob = () => {
  const authenticatedRequest = useAuthenticatedRequest();

  return (type, value) =>
    createKeyframeJobApi(authenticatedRequest, type, value);
};
