/**
 * Pre-defined chat requests configuration
 *
 * Each pre-request should have:
 * - id: unique identifier
 * - name: display name for the select box
 * - description: optional description
 * - messages: array of OpenAI-format messages to send to the API
 * - disabled: optional boolean to disable the option
 */

export const PRE_REQUESTS_CONFIG = [
  {
    id: "",
    name: "Select a pre-request...",
    disabled: true,
  },
  {
    id: "fact-check-analysis",
    name: "Fact-Check Article Analysis",
    description: "Analyze an article for bias, one-sidedness, and propaganda",
    requiresContent: true,
    contentPlaceholder: "Paste the article content you want to analyze...",
    messages: [
      {
        role: "system",
        content:
          "You are a factchecker working in an international news agency",
      },
      {
        role: "user",
        content:
          "Analyse the following article and tell me if it is one-sided, opinionated, propaganda. Outline the sentences that will support your assessment. ! Justify by quoting sentences in the article",
      },
      {
        role: "assistant",
        content:
          "Ok I will do it, what is the article you want me to analyse ?",
      },
      {
        role: "user",
        content: "CONTENT_TO_PROCESS",
      },
    ],
  },
  {
    id: "rhetorical-analysis",
    name: "Rhetorical & Linguistic Analysis",
    description:
      "Deep analysis of rhetorical processes, linguistic construction, and propaganda techniques",
    requiresContent: true,
    contentPlaceholder:
      "Paste the text/article you want to analyze rhetorically...",
    messages: [
      {
        role: "system",
        content:
          "You are a factchecker working in an international news agency",
      },
      {
        role: "user",
        content:
          "Analyze the relationship between the source and the recipient of the text. How is this relationship linguistically constructed? Is it factual or unilateral, or even biased? Identify the rhetorical processes used to persuade or convince the audience. How are these processes implemented? What are the dominant lexical fields? Are there any particular conjectures, repetitions, connotations, fallacious logics, metaphors? Which words or arguments are the most repeated? How do these recurring signs influence the interpretation of the text? Is this propaganda? Justify by quoting sentences in the article.",
      },
      {
        role: "assistant",
        content:
          "Ok I will do it, what is the article you want me to analyse ?",
      },
      {
        role: "user",
        content: "CONTENT_TO_PROCESS",
      },
    ],
  },
];

/**
 * Helper function to add a new pre-request
 * @param {Object} preRequest - The pre-request configuration object
 */
export const addPreRequest = (preRequest) => {
  PRE_REQUESTS_CONFIG.push(preRequest);
};

/**
 * Helper function to get a pre-request by ID
 * @param {string} id - The pre-request ID
 * @returns {Object|undefined} The pre-request object or undefined if not found
 */
export const getPreRequestById = (id) => {
  return PRE_REQUESTS_CONFIG.find((req) => req.id === id);
};

/**
 * Helper function to get all available pre-requests (excluding disabled ones)
 * @returns {Array} Array of enabled pre-requests
 */
export const getAvailablePreRequests = () => {
  return PRE_REQUESTS_CONFIG.filter((req) => !req.disabled);
};
