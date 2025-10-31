/**
 * Detection types used throughout the Hiya audio analysis system
 */
export const DETECTION_TYPES = {
  VOICE_CLONING: "synthesis",
};

/**
 * Threshold values for detection scoring
 * Used to categorize detection results into different risk levels
 */
export const DETECTION_THRESHOLDS = {
  THRESHOLD_1: 10, // Low risk threshold
  THRESHOLD_2: 30, // Medium risk threshold
  THRESHOLD_3: 60, // High risk threshold
};

/**
 * Color codes for different detection levels
 * Maps to the threshold levels for visual representation
 */
export const DETECTION_COLORS = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

/**
 * Keyword mappings for detection explanations
 * Used for internationalization of detection result explanations
 */
export const DETECTION_EXPLANATION_KEYWORDS = [
  "hiya_scale_modal_explanation_rating_1",
  "hiya_scale_modal_explanation_rating_2",
  "hiya_scale_modal_explanation_rating_3",
  "hiya_scale_modal_explanation_rating_4",
];

/**
 * API response labels for audio analysis results
 * Possible values returned by the Hiya API
 */
export const API_RESPONSE_LABELS = {
  VALID_VOICE: "validVoice",
  EXCESSIVE_MUSIC: "excessiveMusic",
  EXCESSIVE_NOISE: "excessiveNoise",
  INSUFFICIENT_VOICE: "insufficientVoice",
};

/**
 * Hardcoded warning messages for different error labels
 * TODO: Move to translation system later
 */
export const ERROR_MESSAGES = {
  [API_RESPONSE_LABELS.EXCESSIVE_MUSIC]:
    "The audio contains too much background music. For accurate voice cloning detection, please use an audio file with clearer voice content and minimal background music.",
  [API_RESPONSE_LABELS.EXCESSIVE_NOISE]:
    "The audio contains too much noise. For accurate voice cloning detection, please use a cleaner audio file with less background noise and clearer voice content.",
  [API_RESPONSE_LABELS.INSUFFICIENT_VOICE]:
    "The audio does not contain enough voice content. For accurate voice cloning detection, please use an audio file with more prominent voice content.",
};

/**
 * Generalized warning messages for different error scenarios
 */
export const GENERAL_ERROR_MESSAGES = {
  ALL_ERRORS:
    "The audio analysis could not be completed due to audio quality issues. Please try with a different audio file that has:",
  PARTIAL_ERRORS:
    "Some parts of the audio had quality issues that may affect accuracy. For better results, use audio with:",
  SUGGESTIONS: {
    [API_RESPONSE_LABELS.EXCESSIVE_MUSIC]: "• Less background music",
    [API_RESPONSE_LABELS.EXCESSIVE_NOISE]: "• Reduced background noise",
    [API_RESPONSE_LABELS.INSUFFICIENT_VOICE]: "• More prominent voice content",
  },
};

/**
 * Utility function to check if chunks contain a majority of error labels
 * @param {Array} chunks - Array of chunk data from the API
 * @returns {boolean} True if more than 50% of chunks have error labels (not validVoice)
 */
export const hasMajorityErrorLabels = (chunks) => {
  if (!chunks || chunks.length === 0) {
    return false;
  }

  const errorChunks = chunks.filter(
    (chunk) => chunk.label && chunk.label !== API_RESPONSE_LABELS.VALID_VOICE,
  );

  return errorChunks.length / chunks.length > 0.5;
};

/**
 * Utility function to check if chunks contain any error labels (for informational purposes)
 * @param {Array} chunks - Array of chunk data from the API
 * @returns {boolean} True if any chunks have error labels (not validVoice)
 */
export const hasAnyErrorLabels = (chunks) => {
  if (!chunks || chunks.length === 0) {
    return false;
  }

  return chunks.some(
    (chunk) => chunk.label && chunk.label !== API_RESPONSE_LABELS.VALID_VOICE,
  );
};
