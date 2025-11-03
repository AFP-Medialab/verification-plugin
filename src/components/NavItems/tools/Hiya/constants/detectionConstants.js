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
 * Translation keys for generalized warning messages
 */
export const ERROR_MESSAGE_KEYS = {
  ALL_ERRORS: "hiya_error_all_chunks_failed",
  PARTIAL_ERRORS: "hiya_warning_partial_chunks_failed",
  SUGGESTIONS: {
    [API_RESPONSE_LABELS.EXCESSIVE_MUSIC]: "hiya_suggestion_less_music",
    [API_RESPONSE_LABELS.EXCESSIVE_NOISE]: "hiya_suggestion_less_noise",
    [API_RESPONSE_LABELS.INSUFFICIENT_VOICE]: "hiya_suggestion_more_voice",
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
