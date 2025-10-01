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
