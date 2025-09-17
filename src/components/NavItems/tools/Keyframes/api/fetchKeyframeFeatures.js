import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";

/**
 * Fetches enhanced keyframe features (faces and text groups) for a given jobId.
 *
 * @param {Function} authenticatedRequest - Function to perform an authenticated HTTP request.
 * @param {string} jobId - The ID of the completed keyframe job.
 * @returns {Promise<KeyframesFeatures>} Parsed features including face and text groups.
 */
export async function fetchKeyframeFeaturesApi(authenticatedRequest, jobId) {
  const config = {
    method: "get",
    url: `${process.env.REACT_APP_KEYFRAME_API}/keyframes_enhance/${jobId}`,
  };

  const response = await authenticatedRequest(config);
  let faces = /** @type {ImagesFeature[]} */ [];
  let texts = /** @type {ImagesFeature[]} */ [];

  for (const imageFeature of response.data.faces_groups || []) {
    const items = /** @type {ImageItem[]} */ [];

    for (const it of imageFeature.items) {
      items.push({
        frame: it.frame,
        frameTime: it.frame_time,
        imageUrl: it.item_url,
      });
    }

    const representative = /** @type {ImageRepresentative} */ {
      index: imageFeature.representative.item_index,
      imageUrl: imageFeature.representative.enhanced_url,
    };

    faces.push({
      items: items,
      representative: representative,
    });
  }

  for (const imageFeature of response.data.text_groups || []) {
    const items = /** @type {ImageItem[]} */ [];

    for (const it of imageFeature.items) {
      items.push({
        frame: it.frame,
        frameTime: it.frame_time,
        imageUrl: it.item_url,
      });
    }

    const representative = /** @type {ImageRepresentative} */ {
      index: imageFeature.representative.item_index,
      imageUrl: imageFeature.representative.enhanced_url,
    };

    texts.push({
      items: items,
      representative: representative,
    });
  }

  return /** @type {KeyframesFeatures} */ {
    faces: faces,
    texts: texts,
  };
}

/**
 * React hook that provides a function to fetch keyframe features for a jobId.
 *
 * @returns {(jobId: string) => Promise<KeyframesFeatures>} A function that retrieves parsed keyframe features.
 */
export const useFetchKeyframeFeatures = () => {
  const authenticatedRequest = useAuthenticatedRequest();

  return (jobId) => fetchKeyframeFeaturesApi(authenticatedRequest, jobId);
};
