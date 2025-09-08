import { useCallback, useState } from "react";

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
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPreRequest, setSelectedPreRequest] = useState("");

  // Pre-defined requests from configuration
  const [preRequests] = useState(PRE_REQUESTS_CONFIG);

  // Handle streaming response chunks
  const handleStreamingResponse = useCallback(
    async (response, options = {}) => {
      if (!response.body) {
        throw new Error("Response body is not available for streaming");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let messageData = {
        id: null,
        model: null,
        usage: null,
      };

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine === "" || trimmedLine === "data: [DONE]") {
              continue;
            }

            if (trimmedLine.startsWith("data: ")) {
              try {
                const jsonData = JSON.parse(trimmedLine.slice(6)); // Remove 'data: ' prefix

                // Store metadata from first chunk
                if (!messageData.id && jsonData.id) {
                  messageData.id = jsonData.id;
                  messageData.model = jsonData.model;
                }

                // Check for completion
                if (jsonData.choices && jsonData.choices[0]) {
                  const choice = jsonData.choices[0];

                  if (choice.finish_reason === "stop") {
                    // Stream is complete
                    if (jsonData.usage) {
                      messageData.usage = jsonData.usage;
                    }
                    break;
                  }

                  // Accumulate content from delta
                  if (choice.delta && choice.delta.content) {
                    fullContent += choice.delta.content;

                    // Call onChunk callback if provided
                    if (options.onChunk) {
                      options.onChunk({
                        content: choice.delta.content,
                        fullContent: fullContent,
                        isComplete: false,
                      });
                    }
                  }
                }
              } catch (e) {
                console.warn(
                  "Failed to parse streaming chunk:",
                  trimmedLine,
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
      } catch (err) {
        console.error("Error reading streaming response:", err);
        throw err;
      } finally {
        reader.releaseLock();
      }
    },
    [],
  );

  // Fetch available models from GET /v1/models
  const fetchModels = useCallback(async () => {
    setIsModelsLoading(true);
    setError(null);

    try {
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
      setModels(data.data || []);

      // Auto-select first model if none selected
      if (data.data && data.data.length > 0 && !selectedModel) {
        setSelectedModel(data.data[0].id);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching models:", err);
    } finally {
      setIsModelsLoading(false);
    }
  }, [apiBaseUrl, selectedModel]);

  // Send chat completion request to POST /v1/chat/completions
  const sendMessage = useCallback(
    async (messages, options = {}) => {
      if (!selectedModel) {
        throw new Error("No model selected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const requestBody = {
          model: selectedModel,
          messages: messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          stream: options.stream !== false, // Default to streaming unless explicitly disabled
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

        // Handle streaming response
        if (requestBody.stream) {
          return await handleStreamingResponse(response, options);
        }

        // Handle non-streaming response (fallback)
        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
          throw new Error("No response generated");
        }

        return {
          id: data.id,
          text: data.choices[0].message.content,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          model: data.model,
          usage: data.usage,
        };
      } catch (err) {
        setError(err.message);
        console.error("Error sending message:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, selectedModel],
  );

  // Send a simple text message (helper function)
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

      return await sendMessage(messages, options);
    },
    [sendMessage],
  );

  // Execute a pre-defined request
  const executePreRequest = useCallback(
    async (preRequestId, options = {}, content = null) => {
      const preRequest = preRequests.find((req) => req.id === preRequestId);
      if (!preRequest || !preRequest.messages) {
        throw new Error("Invalid pre-request selected");
      }

      setIsLoading(true);
      setError(null);

      try {
        // Process messages and replace CONTENT_TO_PROCESS placeholder if content is provided
        let processedMessages = preRequest.messages;
        if (content && preRequest.requiresContent) {
          processedMessages = preRequest.messages.map((msg) => ({
            ...msg,
            content: msg.content.replace("CONTENT_TO_PROCESS", content),
          }));
        }

        const requestBody = {
          model: selectedModel,
          messages: processedMessages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          stream: options.stream !== false, // Default to streaming unless explicitly disabled
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
            `Pre-request failed: ${response.status} ${response.statusText}`,
          );
        }

        // Handle streaming response
        if (requestBody.stream) {
          const result = await handleStreamingResponse(response, options);
          return {
            ...result,
            preRequestUsed: preRequest.name,
          };
        }

        // Handle non-streaming response (fallback)
        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
          throw new Error("No response generated for pre-request");
        }

        return {
          id: data.id,
          text: data.choices[0].message.content,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
          model: data.model,
          usage: data.usage,
          preRequestUsed: preRequest.name,
        };
      } catch (err) {
        setError(err.message);
        console.error("Error executing pre-request:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl, selectedModel, preRequests],
  );

  return {
    // State
    models,
    selectedModel,
    isLoading,
    isModelsLoading,
    error,
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
    clearError: () => setError(null),
    isReady: models.length > 0 && selectedModel && !isModelsLoading,
  };
};

export default useChatBot;
