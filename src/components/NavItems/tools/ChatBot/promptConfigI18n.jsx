/**
 * @typedef {Object} ChatMessage
 * @property {'system'|'user'|'assistant'} role - The role of the message sender
 * @property {string} content - The content of the message
 */

/**
 * @typedef {Object} PromptConfig
 * @property {string} id - Unique identifier for the prompt
 * @property {string} name - Display name for the select box (i18n key)
 * @property {string} [description] - Optional description (i18n key)
 * @property {boolean} [disabled] - Optional flag to disable the option
 * @property {boolean} [requiresContent] - Whether the prompt requires content to process
 * @property {ChatMessage[]} [messages] - Array of OpenAI-format messages to send to the API
 */
/**
 * Pre-defined chat prompts configuration
 * @type {PromptConfig[]}
 */
export const PROMPTS_CONFIG_I_18_N = [
  {
    id: "none",
    name: "prompt_select_label",
    disabled: true,
  },
  {
    id: "fact-check-analysis",
    name: "fact_check_analysis_title",
    description: "fact_check_analysis_description",
    requiresContent: true,
    messages: [
      {
        role: "system",
        content: "fact_checker_system",
      },
      {
        role: "user",
        content: "fact_check_analysis_user",
      },
      {
        role: "assistant",
        content: "fact_checker_assistant",
      },
      {
        role: "user",
        content: "CONTENT_TO_PROCESS",
      },
    ],
  },
  {
    id: "rhetorical_analysis",
    name: "rhetorical_analysis_title",
    description: "rhetorical_analysis_description",
    requiresContent: true,
    messages: [
      {
        role: "system",
        content: "fact_checker_system",
      },
      {
        role: "user",
        content: "rhetorical_analysis_user",
      },
      {
        role: "assistant",
        content: "fact_checker_assistant",
      },
      {
        role: "user",
        content: "CONTENT_TO_PROCESS",
      },
    ],
  },
  {
    id: "claim_to_check",
    name: "claim_to_check_title",
    description: "claim_to_check_description",
    requiresContent: true,
    messages: [
      {
        role: "system",
        content: "fact_checker_system",
      },
      {
        role: "user",
        content: "claim_to_check_user",
      },
      {
        role: "assistant",
        content: "fact_checker_assistant",
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
 * @param {PromptConfig} prompt - The prompt configuration object
 * @returns {void}
 */
export const addPrompt = (prompt) => {
  PROMPTS_CONFIG_I_18_N.push(prompt);
};

/**
 * Helper function to get a prompt by ID
 * @param {string} id - The prompt ID
 * @returns {PromptConfig|undefined} The prompt object or undefined if not found
 */
export const getPromptById = (id) => {
  return PROMPTS_CONFIG_I_18_N.find((req) => req.id === id);
};

/**
 * Helper function to get all available prompts (excluding disabled ones)
 * @returns {PromptConfig[]} Array of enabled prompts
 */
export const getAvailablePrompts = () => {
  return PROMPTS_CONFIG_I_18_N.filter((req) => !req.disabled);
};
