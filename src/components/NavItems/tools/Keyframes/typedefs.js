/**
 * This defines the returned data by KSE
 * @typedef {Object} KeyframesData
 * @property {string} session - The job ID.
 * @property {string} url - The video URL.
 * @property {string} duration - The video duration.
 * @property {number} framerate - The video framerate.
 * @property {Keyframe[]} keyframes - List of keyframe image URLs.
 * @property {Keyframe[]} keyframesXtra - A bigger list of keyframe image URLs.
 * @property {Shot[]} shots - List of keyframes shots.
 * @property {Subshot[]} subshots - A bigger list of keyframes shots.
 * @property {string} zipFileUrl - The URL to download the keyframes as a .zip file.
 */

/**
 * This defines a single Keyframe
 * @typedef {Object} Keyframe
 * @property {number} frame - The frame number.
 * @property {number} keyframeTime - The keyframe time in seconds.
 * @property {string} keyframeUrl - The keyframe url.
 * @property {number} shot - The keyframe shot.
 * @property {number} subshot - The keyframe subshot.
 */

/**
 * This defines a single shot
 * @typedef {Object} Shot
 * @property {number} shotNumber - The shot number.
 * @property {number} beginFrame - The frame start number.
 * @property {number} beginTime - The time in seconds for the beginning of the frame.
 * @property {number} endFrame - The frame end number.
 * @property {number} endTime - The time in seconds for the end of the frame.
 */

/**
 * This defines a single subshot
 * @typedef {Object} Subshot
 * @property {number} subshotNumber - The subshot number.
 * @property {number} beginFrame - The frame start number.
 * @property {number} beginTime - The time in seconds for the beginning of the frame.
 * @property {number} endFrame - The frame end number.
 * @property {number} endTime - The time in seconds for the end of the frame.
 * @property {number} shot - The shot number.
 */

/**
 * This defines an image item which along with other items share a similar feature (text, face).
 * @typedef {Object} ImageItem
 * @property {number} frame - The frame number.
 * @property {number} frameTime - The time in seconds for the frame.
 * @property {string} imageUrl - The image URL.
 */

/**
 * This defines an image which represents a feature (text, face) found in a group of frames.
 * @typedef {Object} ImageRepresentative
 * @property {number} index - The image index.
 * @property {string} imageUrl - The image URL.
 */

/**
 * This defines a group of images sharing the same feature (text or faces).
 * The representative image is the image selected or enhanced by the keyframes service.
 * @typedef {Object} ImagesFeature
 * @property {ImageItem[]} items - The list of images sharing the same feature
 * @property {ImageRepresentative} representative - The image selected to represent the group sharing the feature
 */

/**
 * This defines the features found in the keyframes (text or faces).
 * @typedef {Object} KeyframesFeatures
 * @property {ImagesFeature[]} faces - The list of detected faces
 * @property {ImagesFeature[]} texts - The list of detected texts
 */
