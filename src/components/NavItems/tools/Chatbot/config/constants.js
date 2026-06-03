/**
 * Chatbot Configuration Constants
 */

// Default temperature setting for the Chatbot
export const DEFAULT_TEMPERATURE = 0.7;

// Temperature constraints
export const TEMPERATURE_CONSTRAINTS = {
  MIN: 0,
  MAX: 1,
  STEP: 0.1,
};

// Default message roles
export const MESSAGE_ROLES = {
  SYSTEM: "system",
  USER: "user",
  ASSISTANT: "assistant",
  BOT: "bot",
};

// Content placeholder for prompts
export const CONTENT_PLACEHOLDER = "CONTENT_TO_PROCESS";

// Auto-submission delay (in milliseconds)
export const AUTO_SUBMIT_DELAY = 100;

// Default number of retry attempts for failed requests
export const DEFAULT_RETRY_ATTEMPTS = 3;

// API timeout (in milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds

// Message formatting options
export const MESSAGE_OPTIONS = {
  MAX_BUBBLE_WIDTH: "70%",
  USER_COLOR: "#00926c",
  BOT_COLOR: "#fff",
  USER_TEXT_COLOR: "#fff",
  BOT_TEXT_COLOR: "#000",
};

// Animation settings
export const ANIMATION_SETTINGS = {
  CURSOR_BLINK_DURATION: "1s",
  TRANSITION_DURATION: "0.2s",
};

// Chat container settings
export const CHAT_CONTAINER = {
  HEIGHT: 400,
  BACKGROUND_COLOR: "#f5f5f5",
};

// Button sizes and colors
export const UI_SETTINGS = {
  RESTART_BUTTON: {
    WIDTH: 56,
    HEIGHT: 56,
    BACKGROUND_COLOR: "#7b1fa2",
    HOVER_COLOR: "#6a1b9a",
  },
  SEND_BUTTON: {
    MIN_WIDTH: 56,
    HEIGHT: 56,
  },
};
