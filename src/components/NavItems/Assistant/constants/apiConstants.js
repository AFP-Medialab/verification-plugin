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
  URL_DOMAIN_ANALYSIS: "gcloud/source-credibility",
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
