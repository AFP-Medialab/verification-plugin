/**
 * Credibility signal identifiers — used as the `credibilitySignal` prop
 * passed between AssistantTextResult and AssistantTextClassification
 */
export const CREDIBILITY_SIGNAL_TITLES = {
  NEWS_FRAMING: "news_framing_title",
  NEWS_GENRE: "news_genre_title",
  PERSUASION: "persuasion_techniques_title",
  SUBJECTIVITY: "subjectivity_title",
  MACHINE_GENERATED_TEXT: "machine_generated_text_title",
};

/**
 * Stance categories used by the multilingual stance classifier
 */
export const STANCE_CATEGORIES = ["support", "query", "deny", "comment"];

/**
 * Maps stance category values to MUI Chip color names
 */
export const STANCE_COLOR_MAP = {
  support: "success",
  deny: "error",
  query: "warning",
  comment: "inherit",
};

/**
 * Colour assigned to each named-entity type in the tag cloud and category buttons
 */
export const NE_TYPE_COLORS = {
  person: "#648FFF",
  location: "#DC267F",
  organization: "#FFB000",
  hashtag: "#FE6100",
  userid: "#785EF0",
};

/**
 * Ordered category list for the machine-generated text classifier.
 * Used as the default value for the `orderedCategories` config prop.
 */
export const MGT_ORDERED_CATEGORIES = [
  "highly_likely_human",
  "likely_human",
  "likely_machine",
  "highly_likely_machine",
];

/**
 * Gauge arc lengths for the subjectivity classifier chart
 */
export const SUBJECTIVITY_ARC_LENGTHS = [0.4, 0.25, 0.35];

/**
 * Gauge arc lengths for the machine-generated text classifier chart
 */
export const MGT_ARC_LENGTHS = [0.05, 0.45, 0.45, 0.05];

/**
 * i18n keys for the gauge scale explanation modal — subjectivity
 */
export const DETECTION_EXPLANATION_KEYWORDS_SUB = [
  "gauge_scale_modal_explanation_rating_1_sub",
  "gauge_scale_modal_explanation_rating_2_sub",
  "gauge_scale_modal_explanation_rating_3_sub",
];

/**
 * i18n keys for the gauge scale explanation modal — machine-generated text
 */
export const DETECTION_EXPLANATION_KEYWORDS_MGT = [
  "gauge_scale_modal_explanation_rating_1_mgt",
  "gauge_scale_modal_explanation_rating_2_mgt",
  "gauge_scale_modal_explanation_rating_3_mgt",
  "gauge_scale_modal_explanation_rating_4_mgt",
];
