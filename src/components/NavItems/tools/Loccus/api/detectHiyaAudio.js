/**
 * Performs audio authenticity detection using the Loccus service
 *
 * @param {string} fileHandle - The file handle returned from the upload endpoint
 * @param {Function} authenticatedRequest - The authenticated request function from useAuthenticatedRequest hook
 * @param {string} [model="digital"] - The detection model to use for analysis
 * @returns {Promise<Object>} Promise that resolves to the detection response containing analysis results
 * @throws {Error} When detection fails, no data is returned, or request times out
 *
 * @example
 * ```javascript
 * import { detectHiyaAudioAuthenticity } from './detectHiyaAudio';
 * import useAuthenticatedRequest from 'components/Shared/Authentication/useAuthenticatedRequest';
 *
 * const authenticatedRequest = useAuthenticatedRequest();
 * const fileHandle = 'your-file-handle-from-upload';
 *
 * try {
 *   const detectionResult = await detectHiyaAudioAuthenticity(fileHandle, authenticatedRequest);
 *   console.log('Detection handle:', detectionResult.data.handle);
 *   console.log('Analysis complete');
 * } catch (error) {
 *   console.error('Detection failed:', error.message);
 * }
 * ```
 */
export const detectHiyaAudioAuthenticity = async (
  fileHandle,
  authenticatedRequest,
  model = "digital",
) => {
  if (!fileHandle) {
    throw new Error("File handle is required");
  }

  if (!authenticatedRequest) {
    throw new Error("Authenticated request function is required");
  }

  const detectionRequestData = JSON.stringify({
    model: model,
    sample: fileHandle,
  });

  const detectionRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.REACT_APP_LOCCUS_URL + "/detection",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: detectionRequestData,
    timeout: 180000,
    signal: AbortSignal.timeout(180000),
  };

  let detectionResponse;

  try {
    detectionResponse = await authenticatedRequest(detectionRequestConfig);
  } catch (error) {
    // Only catch network/request errors here
    if (
      error.message.includes("canceled") ||
      error.message.includes("timeout")
    ) {
      console.log("Detection request timed out, rethrowing...");
      throw new Error("Detection request timed out");
    }

    throw error;
  }

  if (
    !detectionResponse ||
    !detectionResponse.data ||
    detectionResponse.data.message
  ) {
    throw new Error("No data received from detection endpoint");
  }

  return detectionResponse;
};
