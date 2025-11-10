import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";

/**
 * Fetches keyframe audio extraction for a given jobId.
 *
 * @param {Function} authenticatedRequest - Function to perform an authenticated HTTP request.
 * @param {string} jobId - The ID of the completed keyframe job.
 * @returns {Promise<Object>} Parsed audio features.
 */
export async function fetchKeyframeAudioApi(authenticatedRequest, jobId) {
  const config = {
    method: "get",
    // url: `${process.env.REACT_APP_KEYFRAME_API}/json/audio/${jobId}`,
    url: `${process.env.REACT_APP_KEYFRAME_API}/mp3/${jobId}`,
  };

  const response = await authenticatedRequest(config);

  console.log(response.data);

  // return /** @type {KeyframesFeatures} */ {
  //   faces: faces,
  //   texts: texts,
  // };
}

/**
 * React hook that provides a function to fetch keyframe features for a jobId.
 *
 * @returns {(jobId: string) => Promise<KeyframesFeatures>} A function that retrieves parsed keyframe features.
 */
export const useFetchKeyframeAudio = () => {
  const authenticatedRequest = useAuthenticatedRequest();

  return (jobId) => fetchKeyframeAudioApi(authenticatedRequest, jobId);
};
