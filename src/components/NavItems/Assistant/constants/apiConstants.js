/**
 * Maximum number of times an assistant API call is retried on failure
 */
export const MAX_NUM_RETRIES = 3;

/**
 * Number of DBpedia IRIs sent per request when resolving named entities
 */
export const NE_ENTITY_CHUNK_SIZE = 25;

/**
 * Assistant API endpoint paths (appended to VITE_ASSISTANT_URL)
 */
export const API_ENDPOINTS = {
  NAMED_ENTITY: "gcloud/named-entity",
  OCR: "gcloud/ocr",
  SOURCE_CREDIBILITY: "gcloud/source-credibility",
  NEWS_FRAMING: "gcloud/news-framing-clfr",
  NEWS_GENRE: "gcloud/news-genre-clfr",
  PERSUASION: "gcloud/persuasion-span-clfr",
  SUBJECTIVITY: "dw/subjectivity",
  PREV_FACT_CHECKS: "kinit/prev-fact-checks",
  MGT_CHUNKS: "kinit/machine-generated-text-chunks",
  STANCE: "gcloud/multilingual-stance-classification",
};

/**
 * Maximum number of results returned by the DBKF text-similarity endpoint
 */
export const DBKF_RESULTS_LIMIT = 5;

/**
 * External documentation and partner URLs used throughout the Assistant UI
 */
export const DOCS_URLS = {
  SUPPORTED_TOOLS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools",
  SUPPORTED_URLS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-urls",
  DOMAIN_ANALYSIS: "https://gatenlp.github.io/domain-analysis-lists/",
  NAMED_ENTITY_RECOGNISER:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#named-entity-recogniser",
  CREDIBILITY_SIGNALS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#credibility-signals",
  PREV_FACT_CHECKS:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#previous-fact-checks",
  DBKF: "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#database-of-known-fakes",
  STANCE_CLASSIFIER:
    "https://gatenlp.github.io/we-verify-app-assistant/supported-tools#stance-classifier",
  GATE_SHOPFRONT: "https://cloud.gate.ac.uk/shopfront",
  DEUTSCHE_WELLE: "https://www.dw.com/",
  KINIT: "https://kinit.sk/",
  ONTOTEXT: "https://www.ontotext.com/",
  MDN_IMAGE_TYPES:
    "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types",
  MDN_VIDEO_CODECS:
    "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs",
};
