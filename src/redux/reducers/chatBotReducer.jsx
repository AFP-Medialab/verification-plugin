import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Session Configuration
  selectedModel: "",
  selectedPreRequest: "",
  activePreRequest: null,

  // Chat History
  messages: [],
  streamingMessage: null,

  // UI State
  userInput: "",
  isSessionActive: false,

  // API State
  models: [],
  isLoading: false,
  isModelsLoading: false,
  error: null,

  // Session Metadata
  sessionId: null,
  sessionStartTime: null,
  lastMessageTime: null,
};

const chatBotSlice = createSlice({
  name: "chatBot",
  initialState,
  reducers: {
    setModels: (state, action) => {
      state.models = action.payload.models;
      state.isModelsLoading = false;
    },

    setModelsLoading: (state, action) => {
      state.isModelsLoading = action.payload;
    },

    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },

    setSelectedPreRequest: (state, action) => {
      state.selectedPreRequest = action.payload;
    },

    setActivePreRequest: (state, action) => {
      state.activePreRequest = action.payload.preRequest;
      state.isSessionActive = true;
      state.sessionId = action.payload.sessionId || Date.now().toString();
      state.sessionStartTime =
        action.payload.sessionStartTime || new Date().toISOString();
    },

    setUserInput: (state, action) => {
      state.userInput = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.lastMessageTime = new Date().toISOString();
    },

    updateMessages: (state, action) => {
      state.messages = action.payload;
    },

    setStreamingMessage: (state, action) => {
      state.streamingMessage = action.payload;
    },

    updateStreamingMessage: (state, action) => {
      if (state.streamingMessage) {
        state.streamingMessage = {
          ...state.streamingMessage,
          ...action.payload,
        };
      }
    },

    clearStreamingMessage: (state) => {
      state.streamingMessage = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    updateSessionMetadata: (state, action) => {
      Object.assign(state, action.payload);
    },

    clearSession: (state) => {
      // Keep models and loading states, reset session data
      state.selectedPreRequest = "";
      state.activePreRequest = null;
      state.messages = [];
      state.streamingMessage = null;
      state.userInput = "";
      state.isSessionActive = false;
      state.error = null;
      state.sessionId = null;
      state.sessionStartTime = null;
      state.lastMessageTime = null;
    },

    restoreSession: (state, action) => {
      Object.assign(state, action.payload);
    },

    resetAll: () => {
      return initialState;
    },
  },
});

export const {
  setModels,
  setModelsLoading,
  setSelectedModel,
  setSelectedPreRequest,
  setActivePreRequest,
  setUserInput,
  addMessage,
  updateMessages,
  setStreamingMessage,
  updateStreamingMessage,
  clearStreamingMessage,
  setLoading,
  setError,
  clearError,
  updateSessionMetadata,
  clearSession,
  restoreSession,
  resetAll,
} = chatBotSlice.actions;

export default chatBotSlice.reducer;
