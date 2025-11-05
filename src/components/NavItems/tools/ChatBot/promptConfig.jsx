/**
 * Pre-defined chat prompts configuration
 *
 * Each prompt should have:
 * - id: unique identifier
 * - name: display name for the select box
 * - description: optional description
 * - messages: array of OpenAI-format messages to send to the API
 * - disabled: optional boolean to disable the option
 */
export const PROMPTS_CONFIG = [
  {
    id: "none",
    name: "prompt_select_label",
    disabled: true,
  },
  {
    id: "fact-check-analysis_en",
    name: "Fact-Check Article Analysis",
    description: "Analyze an article for bias, one-sidedness, and propaganda",
    requiresContent: true,
    messages: [
      {
        role: "system",
        content:
          "You are a fact-checker working in an international news agency",
      },
      {
        role: "user",
        content:
          "Analyse the following article and tell me if it is one-sided, opinionated, propaganda. Outline the sentences that will support your assessment. ! Justify by quoting sentences in the article",
      },
      {
        role: "assistant",
        content: "Very well, what is the article you want me to analyse ?",
      },
      {
        role: "user",
        content: "CONTENT_TO_PROCESS",
      },
    ],
  },
  {
    id: "rhetorical-analysis_en",
    name: "Rhetorical & Linguistic Analysis",
    description:
      "Deep analysis of rhetorical processes, linguistic construction, and propaganda techniques",
    requiresContent: true,
    messages: [
      {
        role: "system",
        content:
          "You are a fact-checker working in an international news agency",
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
  {
    id: "claim_to_check_en",
    name: "Claim extractor",
    description: "Extract claims to check from an article",
    requiresContent: true,
    messages: [
      {
        role: "system",
        content:
          "You are a fact-checker working in an international news agency",
      },
      {
        role: "user",
        content:
          "Extract up to 3 potentially biased claims that can be fact-checked in this article.",
      },
      {
        role: "assistant",
        content: "Very well, what is the article you want me to process ?",
      },
      {
        role: "user",
        content: "CONTENT_TO_PROCESS",
      },
    ],
  },
  {
    id: "rhetorical-analysis_fr",
    name: "Analyse rhétorique et linguistique",
    description:
      "Analyse approfondie des processus rhétoriques, de la construction linguistique et des techniques de propagande",
    requiresContent: true,
    messages: [
      {
        role: "system",
        content:
          "Vous êtes un journaliste FactChecker travaillant dans une agence de presse internationale. Votre langage est le français",
      },
      {
        role: "user",
        content:
          "Analysez la relation entre la source et le destinataire du texte. Comment cette relation est-elle construite linguistiquement ? Est-elle factuelle ou unilatérale, voire biaisée ? Identifiez les processus rhétoriques utilisés pour persuader ou convaincre l'auditoire. Comment ces processus sont-ils mis en œuvre ? Quels sont les champs lexicaux dominants ? Y a-t-il des conjectures, des répétitions, des connotations, des logiques fallacieuses, des métaphores particulières ? Quels mots ou arguments sont les plus répétés ? Comment ces signes récurrents influencent-ils l'interprétation du texte ? S'agit-il de propagande ? Justifiez en citant des phrases de l'article.",
      },
      {
        role: "assistant",
        content:
          "Très bien je vais le faire. Quel article voulez-vous que j'analyse ?",
      },
      {
        role: "user",
        content: "CONTENT_TO_PROCESS",
      },
    ],
  },
];

/**
 * Helper function to add a new prompt
 * @param {Object} prompt - The prompt configuration object
 */
export const addPrompt = (prompt) => {
  PROMPTS_CONFIG.push(prompt);
};

/**
 * Helper function to get a prompt by ID
 * @param {string} id - The prompt ID
 * @returns {Object|undefined} The prompt object or undefined if not found
 */
export const getPromptById = (id) => {
  return PROMPTS_CONFIG.find((req) => req.id === id);
};

/**
 * Helper function to get all available prompts (excluding disabled ones)
 * @returns {Array} Array of enabled prompts
 */
export const getAvailablePrompts = () => {
  return PROMPTS_CONFIG.filter((req) => !req.disabled);
};
