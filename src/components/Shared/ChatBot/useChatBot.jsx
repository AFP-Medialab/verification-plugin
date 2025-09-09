import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { PRE_REQUESTS_CONFIG } from "./preRequestsConfig";

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
  const [selectedPreRequest, setSelectedPreRequest] = useState("");

  // Pre-defined requests from configuration
  const [preRequests] = useState(PRE_REQUESTS_CONFIG);

  // Fetch available models using React Query
  const {
    data: modelsData,
    isLoading: isModelsLoading,
    error: modelsError,
    refetch: fetchModels,
  } = useQuery({
    queryKey: ["models", apiBaseUrl],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/v1/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch models: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data.data || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const models = modelsData || [];

  // Auto-select first model if none selected
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].id);
    }
  }, [models, selectedModel]);

  // Call completions endpoint for continued generation
  const callCompletionsEndpoint = useCallback(
    async (currentContent, originalMessages, options = {}) => {
      if (!selectedModel) throw new Error("No model selected");

      // Filter out content between <think></think> tags
      const filteredPrompt = currentContent
        .replace(/<think>[\s\S]*?<\/think>/g, "")
        .trim();

      const requestBody = {
        model: selectedModel,
        prompt: filteredPrompt,
        stream: true,
      };

      const response = await fetch(`${apiBaseUrl}/v1/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Completions endpoint failed: ${response.status} ${response.statusText}`,
        );
      }

      if (requestBody.stream) {
        return await handleStreamingCompletionsResponse(
          response,
          options,
          currentContent,
        );
      } else {
        const data = await response.json();
        if (!data.choices?.length) throw new Error("No response generated");

        return {
          id: data.id,
          text: currentContent + data.choices[0].text,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          model: data.model,
          usage: data.usage,
        };
      }
    },
    [apiBaseUrl, selectedModel],
  );

  // Handle streaming response from completions endpoint
  const handleStreamingCompletionsResponse = useCallback(
    async (response, options = {}, initialContent = "") => {
      if (!response.body)
        throw new Error("Response body is not available for streaming");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = initialContent;
      let messageData = { id: null, model: null, usage: null };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder.decode(value, { stream: true }).split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;

            if (trimmed.startsWith("data: ")) {
              try {
                const data = JSON.parse(trimmed.slice(6));
                if (!messageData.id && data.id) {
                  messageData.id = data.id;
                  messageData.model = data.model;
                }

                const choice = data.choices?.[0];
                if (choice?.finish_reason === "stop") {
                  if (data.usage) messageData.usage = data.usage;
                  break;
                }

                if (choice?.text) {
                  fullContent += choice.text;
                  options.onChunk?.({
                    content: choice.text,
                    fullContent,
                    isComplete: false,
                  });
                }
              } catch (e) {
                console.warn(
                  "Failed to parse completions streaming chunk:",
                  trimmed,
                  e,
                );
              }
            }
          }
        }

        return {
          id: messageData.id || Date.now().toString(),
          text: fullContent,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          model: messageData.model,
          usage: messageData.usage,
        };
      } finally {
        reader.releaseLock();
      }
    },
    [],
  );

  // Handle streaming response chunks
  const handleStreamingResponse = useCallback(
    async (response, options = {}, originalMessages = []) => {
      if (!response.body)
        throw new Error("Response body is not available for streaming");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let messageData = { id: null, model: null, usage: null };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder.decode(value, { stream: true }).split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;

            if (trimmed.startsWith("data: ")) {
              try {
                const data = JSON.parse(trimmed.slice(6));
                if (!messageData.id && data.id) {
                  messageData.id = data.id;
                  messageData.model = data.model;
                }

                const choice = data.choices?.[0];
                if (choice?.finish_reason === "stop") {
                  if (data.usage) messageData.usage = data.usage;
                  break;
                }

                if (choice?.finish_reason === "length") {
                  if (data.usage) messageData.usage = data.usage;
                  // Continue with completions endpoint
                  const continuedResponse = await callCompletionsEndpoint(
                    fullContent,
                    originalMessages,
                    options,
                  );
                  return continuedResponse;
                }

                if (choice?.delta?.content) {
                  fullContent += choice.delta.content;
                  options.onChunk?.({
                    content: choice.delta.content,
                    fullContent,
                    isComplete: false,
                  });
                }
              } catch (e) {
                console.warn("Failed to parse streaming chunk:", trimmed, e);
              }
            }
          }
        }

        return {
          id: messageData.id || Date.now().toString(),
          text: fullContent,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          model: messageData.model,
          usage: messageData.usage,
        };
      } finally {
        reader.releaseLock();
      }
    },
    [callCompletionsEndpoint],
  );

  // Generic chat completion function
  const performChatCompletion = useCallback(
    async ({ messages, options = {}, preRequestName = null }) => {
      if (!selectedModel) throw new Error("No model selected");

      const requestBody = {
        model: selectedModel,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        stream: options.stream !== false,
        ...options,
      };

      const response = await fetch(`${apiBaseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Chat completion failed: ${response.status} ${response.statusText}`,
        );
      }

      let result;
      if (requestBody.stream) {
        result = await handleStreamingResponse(response, options, messages);
      } else {
        const data = await response.json();
        if (!data.choices?.length) throw new Error("No response generated");

        result = {
          id: data.id,
          text: data.choices[0].message.content,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          model: data.model,
          usage: data.usage,
        };
      }

      return preRequestName
        ? { ...result, preRequestUsed: preRequestName }
        : result;
    },
    [apiBaseUrl, selectedModel, handleStreamingResponse],
  );

  // Unified mutation for all chat operations
  const chatMutation = useMutation({
    mutationFn: performChatCompletion,
    onError: (error) => {
      setError(error.message);
      console.error("Chat operation failed:", error);
    },
    onSuccess: () => setError(null),
  });

  // Public API functions
  const sendMessage = useCallback(
    async (messages, options = {}) => {
      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));
      return chatMutation.mutateAsync({ messages: formattedMessages, options });
    },
    [chatMutation],
  );

  const sendTextMessage = useCallback(
    async (userMessage, conversationHistory = [], options = {}) => {
      const messages = [
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

  const executePreRequest = useCallback(
    async (preRequestId, options = {}, content = null) => {
      const preRequest = preRequests.find((req) => req.id === preRequestId);
      if (!preRequest?.messages)
        throw new Error("Invalid pre-request selected");

      let messages = preRequest.messages;
      if (content && preRequest.requiresContent) {
        messages = messages.map((msg) => ({
          ...msg,
          content: msg.content.replace("CONTENT_TO_PROCESS", content),
        }));
      }

      return chatMutation.mutateAsync({
        messages,
        options,
        preRequestName: preRequest.name,
      });
    },
    [chatMutation, preRequests],
  );

  return {
    // State
    models,
    selectedModel,
    isLoading: chatMutation.isPending,
    isModelsLoading,
    error: error || modelsError?.message || chatMutation.error?.message,
    preRequests,
    selectedPreRequest,

    // Actions
    fetchModels,
    setSelectedModel,
    sendMessage,
    sendTextMessage,
    executePreRequest,
    setSelectedPreRequest,

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
