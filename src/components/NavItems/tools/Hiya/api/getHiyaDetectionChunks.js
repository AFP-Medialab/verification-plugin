/**
 * Retrieves detection chunks from the Hiya service for a completed analysis
 *
 * @param {string} detectionHandle - The detection handle returned from the detection endpoint
 * @param {Function} authenticatedRequest - The authenticated request function from useAuthenticatedRequest hook
 * @param {number} [pageSize=1000] - Maximum number of chunks to retrieve per request
 * @returns {Promise<Object>} Promise that resolves to the chunks response containing analysis chunk data
 * @throws {Error} When chunks retrieval fails, no data is returned, or request times out
 *
 * @example
 * ```javascript
 * import { getHiyaDetectionChunks } from './getHiyaDetectionChunks';
 * import useAuthenticatedRequest from 'components/Shared/Authentication/useAuthenticatedRequest';
 *
 * const authenticatedRequest = useAuthenticatedRequest();
 * const detectionHandle = 'your-detection-handle';
 *
 * try {
 *   const chunksResult = await getHiyaDetectionChunks(detectionHandle, authenticatedRequest);
 *   console.log('Chunks data:', chunksResult.data);
 *   console.log('Number of chunks:', chunksResult.data.length);
 * } catch (error) {
 *   console.error('Chunks retrieval failed:', error.message);
 * }
 * ```
 */
export const getHiyaDetectionChunks = async (
  detectionHandle,
  authenticatedRequest,
  pageSize = 1000,
) => {
  if (!detectionHandle) {
    throw new Error("Detection handle is required");
  }

  if (!authenticatedRequest) {
    throw new Error("Authenticated request function is required");
  }

  const chunksRequestConfig = {
    method: "get",
    maxBodyLength: Infinity,
    url:
      process.env.REACT_APP_LOCCUS_URL +
      `/detection/${detectionHandle}/chunks?page-size=${pageSize}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 180000,
    signal: AbortSignal.timeout(180000),
  };

  let chunksResponse;

  try {
    chunksResponse = await authenticatedRequest(chunksRequestConfig);
  } catch (error) {
    // Only catch network/request errors here
    if (
      error.message.includes("canceled") ||
      error.message.includes("timeout")
    ) {
      console.log("Chunks request timed out, rethrowing...");
      throw new Error("Chunks request timed out");
    }

    throw error;
  }

  if (!chunksResponse || !chunksResponse.data) {
    throw new Error("No data received from chunks endpoint");
  }

  return chunksResponse;
};
