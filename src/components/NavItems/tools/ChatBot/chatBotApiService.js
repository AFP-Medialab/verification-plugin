/**
 * ChatBot API Service
 *
 * Handles all API calls and responses for the ChatBot functionality.
 * Separated from the main hook for better maintainability and testing.
 */

// Helper functions
export const createErrorWithStatus = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const performFetch = async (url, body, options = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw createErrorWithStatus(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response;
};

export const formatMessagesForAPI = (messages) =>
  messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  }));

// Models API
export const fetchModels = async (apiBaseUrl) => {
  const response = await fetch(`${apiBaseUrl}/v1/models`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw createErrorWithStatus(
      `Failed to fetch models: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  const data = await response.json();
  return data.data || [];
};

// Factory function to create API functions with dependencies
export const createChatBotApi = (apiBaseUrl, selectedModel) => {
  const handleStreamingCompletionsResponse = async (
    response,
    options = {},
    initialContent = "",
  ) => {
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
  };

  const callCompletionsEndpoint = async (
    currentContent,
    originalMessages,
    options = {},
  ) => {
    if (!selectedModel) throw new Error("No model selected");

    const filteredPrompt = currentContent
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();
    const requestBody = {
      model: selectedModel,
      prompt: filteredPrompt,
      temperature: options.temperature || 0.7,
      repeatPenalty: options.repeatPenalty || 1.5,
      max_tokens: options.maxTokens || -1,
      stream: true,
    };

    const response = await performFetch(
      `${apiBaseUrl}/v1/completions`,
      requestBody,
      options,
    );

    return requestBody.stream
      ? await handleStreamingCompletionsResponse(
          response,
          options,
          currentContent,
        )
      : (async () => {
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
        })();
  };

  const handleStreamingResponse = async (
    response,
    options = {},
    originalMessages = [],
  ) => {
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

                return await callCompletionsEndpoint(
                  fullContent,
                  originalMessages,
                  options,
                );
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
  };

  const performChatCompletion = async ({
    messages,
    options = {},
    promptName = null,
  }) => {
    if (!selectedModel) throw new Error("No model selected");

    const requestBody = {
      model: selectedModel,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || -1,
      stream: options.stream !== false,
      ...options,
    };

    const response = await performFetch(
      `${apiBaseUrl}/v1/chat/completions`,
      requestBody,
      options,
    );

    const result = requestBody.stream
      ? await handleStreamingResponse(response, options, messages)
      : await (async () => {
          const data = await response.json();
          if (!data.choices?.length) throw new Error("No response generated");
          return {
            id: data.id,
            text: data.choices[0].message.content,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString(),
            model: data.model,
            usage: data.usage,
          };
        })();

    return promptName ? { ...result, promptUsed: promptName } : result;
  };

  return {
    callCompletionsEndpoint,
    handleStreamingCompletionsResponse,
    handleStreamingResponse,
    performChatCompletion,
  };
};
