import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createChatBotApi,
  fetchModels,
  formatMessagesForAPI,
} from "./chatBotApiService";
import { PROMPTS_CONFIG } from "./promptConfig";

/**
 * Custom hook for interacting with OpenAI-like chat completion API
 *
 * Expected API endpoints:
 * - GET /v1/models - Returns list of available models
 * - POST /v1/chat/completions - Creates chat completion
 *
 * @param {string} apiBaseUrl - Base URL for the API (defaults to env var or localhost:8000)
 * @returns {Object} Hook state and methods
 */
const useChatBot = (
  apiBaseUrl = process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:8000",
) => {
  const [selectedModel, setSelectedModel] = useState("");
  const [error, setError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  // Pre-defined prompts from configuration
  const [prompts] = useState(PROMPTS_CONFIG);

  // Fetch available models using React Query
  const {
    data: modelsData,
    isLoading: isModelsLoading,
    error: modelsError,
    refetch: refetchModels,
  } = useQuery({
    queryKey: ["models", apiBaseUrl],
    queryFn: () => fetchModels(apiBaseUrl),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const models = modelsData || [];

  // Auto-select first model if none selected
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].id);
    }
  }, [models, selectedModel]);

  // Create API instance with current dependencies
  const api = useMemo(
    () => createChatBotApi(apiBaseUrl, selectedModel),
    [apiBaseUrl, selectedModel],
  );

  // Unified mutation for all chat operations
  const chatMutation = useMutation({
    mutationFn: api.performChatCompletion,
    onError: (error) => {
      setError(error.message);
      console.error("Chat operation failed:", error);
    },
    onSuccess: () => setError(null),
  });

  // Public API functions
  const sendMessage = useCallback(
    async (messages, options = {}) =>
      chatMutation.mutateAsync({
        messages: formatMessagesForAPI(messages),
        options,
      }),
    [chatMutation],
  );

  const sendTextMessage = useCallback(
    async (userMessage, conversationHistory = [], options = {}) => {
      // If conversationHistory already includes the current user message, use it as is
      // Otherwise, add the current user message to the history
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      const messages =
        lastMessage &&
        lastMessage.text === userMessage &&
        lastMessage.sender === "user"
          ? conversationHistory
          : [
              ...conversationHistory,
              {
                text: userMessage,
                sender: "user",
                timestamp: new Date().toLocaleTimeString(),
              },
            ];
      return sendMessage(messages, options);
    },
    [sendMessage],
  );

  const executePrompt = useCallback(
    async (
      promptId,
      options = {},
      content = null,
      conversationHistory = [],
    ) => {
      const prompt = prompts.find((req) => req.id === promptId);
      if (!prompt?.messages) throw new Error("Invalid prompt selected");

      let messages = [...prompt.messages];

      // Build messages in chronological order
      let fullMessages = [];

      if (conversationHistory.length > 0) {
        // For pre-requests with conversation history, we need to maintain proper order:
        // 1. Pre-request template (system message, initial prompts)
        // 2. Conversation history in chronological order
        // 3. Final user message with new content

        if (content && prompt.requiresContent) {
          // Find the last message in prompt template (usually contains CONTENT_TO_PROCESS)
          const lastPromptIndex = messages.length - 1;
          const lastPromptMessage = messages[lastPromptIndex];

          // Add prompt messages except the last one
          fullMessages = messages.slice(0, lastPromptIndex);

          // Add conversation history in chronological order
          fullMessages = [
            ...fullMessages,
            ...formatMessagesForAPI(conversationHistory),
          ];

          // Add the final user message with content
          fullMessages.push({
            ...lastPromptMessage,
            content: lastPromptMessage.content.replace(
              "CONTENT_TO_PROCESS",
              content,
            ),
          });
        } else {
          // No content replacement needed, just add history before prompt messages
          fullMessages = [
            ...formatMessagesForAPI(conversationHistory),
            ...messages,
          ];
        }
      } else {
        // No conversation history, just process the prompt messages
        if (content && prompt.requiresContent) {
          fullMessages = messages.map((msg) => ({
            ...msg,
            content: msg.content.replace("CONTENT_TO_PROCESS", content),
          }));
        } else {
          fullMessages = messages;
        }
      }

      return chatMutation.mutateAsync({
        messages: fullMessages,
        options,
        promptName: prompt.name,
      });
    },
    [chatMutation, prompts],
  );

  return {
    // State
    models,
    selectedModel,
    isLoading: chatMutation.isPending,
    isModelsLoading,
    error: error || modelsError?.message || chatMutation.error?.message,
    prompts,
    selectedPrompt,

    // Actions
    fetchModels: refetchModels,
    setSelectedModel,
    sendMessage,
    sendTextMessage,
    executePrompt,
    setSelectedPrompt,

    // Utils
    clearError: () => {
      setError(null);
      chatMutation.reset();
    },
    isReady: models.length > 0 && selectedModel && !isModelsLoading,

    // React Query specific states (optional, for advanced usage)
    mutation: chatMutation,
  };
};

export default useChatBot;
