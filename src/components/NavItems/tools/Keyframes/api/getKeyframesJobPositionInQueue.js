import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";

/**
 * Gets the current position/length of the keyframes job queue.
 *
 * @param {Function} authenticatedRequest - Function to perform the authenticated API request.
 * @param {string} jobId - The ID of the keyframe job to monitor.
 * @returns {Promise<string>} The queue length as a string.
 */
export async function getKeyframesJobPositionInQueueApi(
  authenticatedRequest,
  jobId,
) {
  const config = {
    method: "get",
    url: `${process.env.REACT_APP_KEYFRAME_API}/queue_info/${jobId}`,
  };

  const response = await authenticatedRequest(config);

  // Return the length string from the API response
  return typeof response.data.position === "number"
    ? response.data.position
    : "";
}

/**
 * React hook that returns a function to get the current keyframes job queue position.
 *
 * @returns {() => Promise<string>} A function to fetch the queue length.
 */
export const useGetKeyframesJobPositionInQueue = () => {
  const authenticatedRequest = useAuthenticatedRequest();

  return () => getKeyframesJobPositionInQueueApi(authenticatedRequest);
};
