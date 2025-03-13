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
 * @property {number} endTime - The time in seconds for the end of the frame.
 * @property {number} shot - The shot number.
 */
