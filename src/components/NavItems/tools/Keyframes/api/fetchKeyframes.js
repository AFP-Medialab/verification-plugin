import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";

/**
 * Fetches raw keyframe segmentation results for a given jobId.
 *
 * @param {Function} authenticatedRequest - Function to perform the authenticated API request.
 * @param {string} jobId - The job ID whose keyframe results to retrieve.
 * @returns {Promise<KeyframesData>} An object containing session metadata, keyframes, shots, subshots, and download URL.
 */
export async function fetchKeyframesApi(authenticatedRequest, jobId) {
  const config = {
    method: "get",
    url: `${process.env.REACT_APP_KEYFRAME_API}/json/seg/${jobId}`,
  };

  const response = await authenticatedRequest(config);

  /** @type {Shot[]} */
  const shots =
    response.data.shots?.map((shot, index) => ({
      shotNumber: index,
      beginFrame: shot.beginframe,
      beginTime: shot.begintime,
      endFrame: shot.endframe,
      endTime: shot.endtime,
    })) || [];

  /** @type {Subshot[]} */
  const subshots =
    response.data.subshots?.map((subshot, index) => ({
      subshotNumber: index,
      beginFrame: subshot.beginframe,
      beginTime: subshot.begintime,
      endFrame: subshot.endframe,
      endTime: subshot.endtime,
      shot: subshot.shot,
    })) || [];

  const parseKeyframe = (kf) => ({
    frame: kf.frame,
    keyframeTime: kf.keyframe_time,
    keyframeUrl: kf.keyframe_url,
    shot: kf.shot,
    subshot: kf.subshot,
  });
  /** @type {Keyframe[]} */
  const keyframes = (response.data.keyframes || []).map(parseKeyframe);
  /** @type {Keyframe[]} */
  const keyframesXtra = (response.data.keyframes_xtra || []).map(parseKeyframe);

  return /** @type {KeyframesData} */ {
    session:
      typeof response.data.session === "string" ? response.data.session : "",
    url: typeof response.data.url === "string" ? response.data.url : "",
    duration:
      typeof response.data.duration === "string" ? response.data.duration : "",
    framerate:
      typeof response.data.framerate === "number" ? response.data.framerate : 0,
    keyframes: keyframes,
    keyframesXtra: keyframesXtra,
    shots: shots,
    subshots: subshots,
    zipFileUrl:
      typeof response.data.keyframes_zip === "string"
        ? response.data.keyframes_zip
        : "",
  };
}

/**
 * React hook that returns a function to fetch keyframe result data.
 *
 * @returns {(jobId: string) => Promise<KeyframesData>} A function to fetch and parse keyframe data.
 */
export const useFetchKeyframes = () => {
  const authenticatedRequest = useAuthenticatedRequest();

  return (jobId) => fetchKeyframesApi(authenticatedRequest, jobId);
};
