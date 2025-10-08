import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ClearIcon from "@mui/icons-material/Clear";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendIcon from "@mui/icons-material/Send";

import {
  addMessage,
  clearSession,
  clearStreamingMessage,
  setActivePrompt,
  setSelectedPrompt,
  setStreamingMessage,
  setUserInput,
  updateStreamingMessage,
} from "@/redux/reducers/chatBotReducer";
import { styled } from "@mui/system";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import MessageContent from "./MessageContent";
import useChatBot from "./useChatBot";

const ChatBotUI = () => {
  const dispatch = useDispatch();
  const messagesContainerRef = useRef(null);
  const keyword = i18nLoadNamespace("components/NavItems/tools/ChatBot");
  const [temperature, setTemperature] = useState(0.7);

  // Helper functions to reduce code duplication
  const createMessage = (text, sender = "user") => ({
    id: Date.now(),
    text,
    sender,
    timestamp: new Date().toLocaleTimeString(),
  });

  const createStreamingMessage = () => {
    const streamingId = Date.now() + 1;
    dispatch(
      setStreamingMessage({
        id: streamingId,
        text: "",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
        isStreaming: true,
      }),
    );
    return streamingId;
  };

  const createChunkHandler = () => (chunk) =>
    dispatch(
      updateStreamingMessage({
        text: chunk.fullContent,
        isStreaming: !chunk.isComplete,
      }),
    );

  const handle404Error = (err, previousInput) => {
    if (err.status === 404 && previousInput)
      dispatch(setUserInput(previousInput));
  };

  const handleCopyMessage = async (messageText) => {
    try {
      await navigator.clipboard.writeText(messageText);
      console.log("Message copied to clipboard");
    } catch (err) {
      console.error("Failed to copy message: ", err);
      const textArea = document.createElement("textarea");
      textArea.value = messageText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const finalizeStreaming = (botResponse, streamingId, userMessage = null) => {
    if (userMessage) dispatch(addMessage(userMessage));
    dispatch(addMessage({ ...botResponse, id: streamingId }));
    dispatch(clearStreamingMessage());
  };

  // Styled message bubble component
  const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== "sent",
  })(({ sent }) => ({
    maxWidth: "70%",
    padding: "10px 15px",
    borderRadius: sent ? "15px 15px 0 15px" : "15px 15px 15px 0",
    backgroundColor: sent ? "#00926c" : "#fff",
    color: sent ? "#fff" : "#000",
    marginBottom: "10px",
    alignSelf: sent ? "flex-end" : "flex-start",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
  }));

  // Reusable message footer component
  const MessageFooter = ({ timestamp, messageText, showCopy = false }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {timestamp}
      </Typography>
      {showCopy && messageText && (
        <Tooltip title="Copy message">
          <IconButton
            onClick={() => handleCopyMessage(messageText)}
            size="small"
            sx={{
              padding: "2px",
              ml: 1,
              backgroundColor: "rgba(0,0,0,0.1)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
            }}
          >
            <ContentCopyIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  // Reusable message content renderer
  const MessageRenderer = ({ message, isStreaming = false }) => {
    const isUser = message.sender === "user";
    return (
      <MessageBubble sent={isUser}>
        <Box sx={{ mb: 0.5 }}>
          <MessageContent
            content={message.text || ""}
            sender={message.sender}
          />
          {isStreaming && message.isStreaming && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: "8px",
                height: "20px",
                backgroundColor: "#00926c",
                marginLeft: "2px",
                animation: "blink 1s infinite",
                "@keyframes blink": {
                  "0%, 50%": { opacity: 1 },
                  "51%, 100%": { opacity: 0 },
                },
              }}
            />
          )}
        </Box>
        <MessageFooter
          timestamp={message.timestamp}
          messageText={message.text}
          showCopy={!isUser}
        />
      </MessageBubble>
    );
  };

  // Redux state selectors
  const {
    userInput,
    messages,
    streamingMessage,
    selectedPrompt,
    activePrompt,
    isSessionActive,
  } = useSelector((state) => state.chatBot);

  const {
    models,
    selectedModel,
    isLoading,
    isModelsLoading,
    error,
    prompts,
    fetchModels,
    setSelectedModel,
    sendTextMessage,
    executePrompt,
    clearError,
    isReady,
  } = useChatBot();

  // Auto-scroll to bottom function - only scrolls the message container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // Track only bot messages for auto-scroll
  const lastBotMessage = useMemo(() => {
    // Find the last message from bot/assistant
    const botMessages = messages.filter(
      (msg) => msg.sender === "bot" || msg.sender === "assistant",
    );
    return botMessages[botMessages.length - 1];
  }, [messages]);

  // Auto-scroll only when bot messages or streaming message changes
  useEffect(() => {
    scrollToBottom();
  }, [lastBotMessage, streamingMessage]);

  const handleInputChange = (event) => {
    dispatch(setUserInput(event.target.value));
  };

  const handleTemperatureChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 1) {
      setTemperature(value);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      dispatch(setUserInput(userInput + text));
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleClearInput = () => {
    dispatch(setUserInput(""));
  };

  const clearChat = () => {
    dispatch(clearSession());
    clearError();
  };

  const handlePromptChange = (event) => {
    const promptId = event.target.value;
    dispatch(setSelectedPrompt(promptId));

    // Store the active prompt for persistent display
    if (promptId && promptId !== "") {
      const selectedPromptObj = prompts.find((req) => req.id === promptId);
      dispatch(setActivePrompt({ prompt: selectedPromptObj }));

      // If it's a prompt that doesn't require content, execute immediately
      if (selectedPromptObj && !selectedPromptObj.requiresContent) {
        executeSelectedPrompt(promptId);
      }
    }
  };

  const executeSelectedPrompt = async (promptId, content = null) => {
    try {
      if (content) {
        dispatch(addMessage(createMessage(content)));
        dispatch(setUserInput(""));
      }

      const streamingId = createStreamingMessage();
      const botResponse = await executePrompt(
        promptId,
        { onChunk: createChunkHandler(), temperature },
        content,
        messages,
      );

      finalizeStreaming(botResponse, streamingId);
    } catch (err) {
      handle404Error(err, content);
      console.error("Failed to execute prompt:", err);
      dispatch(clearStreamingMessage());
      throw err;
    }
  };

  // Initialize models on component mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // check if directed from assistant
  let text = useSelector((state) => state.assistant.urlText);
  const { url } = useParams();
  useEffect(() => {
    //takes in text parameter from url
    if (url) {
      const uri = decodeURIComponent(url);
      if (uri === "assistantText" && text) {
        text = text.replaceAll("\n", " ");

        // set model (defaults to first in list)
        // wait for models to load up
        const apiBaseUrl =
          process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:8000";
        let models = null;
        const loadModels = async () => {
          models = await fetchModels(apiBaseUrl);
        };
        loadModels();
        console.log("models=", models);
        //dispatch(setSelectedModel(models[0].id));
        console.log("selectedModel=", selectedModel);

        // set temperature (defaults to 0.7)
        console.log("temperature=", temperature);

        // set predefined prompt
        const promptId = "rhetorical-analysis_en";
        dispatch(setSelectedPrompt(promptId));
        console.log("selectedPrompt=", selectedPrompt);
        const selectedPromptObj = prompts.find((req) => req.id === promptId);
        dispatch(setActivePrompt({ prompt: selectedPromptObj }));
        console.log("activePrompt=", activePrompt);

        // set text to analyse
        dispatch(setUserInput(text));
        console.log("text=", text);
        console.log("userInput=", userInput);

        // ready
        console.log("isReady=", isReady), console.log("models=", models);
        console.log("isModelsLoading=", isModelsLoading);

        // send message
        handleSendMessage();
      }
    }
  }, [url, text]);

  // // models
  // console.log("models=", models);
  // console.log("selectedModel=", selectedModel);
  // // set temperature (defaults to 0.7)
  // console.log("temperature=", temperature);
  // // set predefined prompt
  // console.log("selectedPrompt=", selectedPrompt)
  // console.log("activePrompt=", activePrompt)
  // // set text to analyse
  // console.log("userInput=", userInput)
  // // ready
  // console.log("isReady=", isReady),
  // console.log("models=", models);
  // console.log("isModelsLoading=", isModelsLoading);

  const handleSendMessage = async () => {
    console.log("here1");
    if (!userInput.trim() || !isReady) {
      console.log("here1a");
      return;
    }

    console.log("here2");
    const previousUserInput = userInput;

    // Handle prompt flow
    if (selectedPrompt && selectedPrompt !== "") {
      console.log("here");
      const selectedPromptObj = prompts.find(
        (req) => req.id === selectedPrompt,
      );
      if (selectedPromptObj?.requiresContent) {
        try {
          await executeSelectedPrompt(selectedPrompt, userInput);
          dispatch(setUserInput(""));
        } catch (err) {
          handle404Error(err, previousUserInput);
        }
      }
      return;
    }

    // Regular chat flow
    const newUserMessage = createMessage(userInput);
    dispatch(setUserInput(""));
    clearError();

    try {
      const streamingId = createStreamingMessage();
      const fullConversationHistory = [...messages, newUserMessage];

      const botResponse = await sendTextMessage(
        userInput,
        fullConversationHistory,
        {
          onChunk: createChunkHandler(),
          temperature,
        },
      );

      finalizeStreaming(botResponse, streamingId, newUserMessage);
    } catch (err) {
      handle404Error(err, previousUserInput);
      console.error("Failed to send message:", err);
      dispatch(clearStreamingMessage());
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{keyword("models_label")}</InputLabel>
              <Select
                value={selectedModel}
                label={keyword("models_label")}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isModelsLoading}
              >
                {models.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Temperature"
              type="number"
              value={temperature}
              onChange={handleTemperatureChange}
              inputProps={{
                min: 0,
                max: 1,
                step: 0.1,
              }}
              sx={{ width: 100 }}
              variant="outlined"
            />
          </Box>
        }
      />
      <CardContent>
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {/* Loading Models */}
        {isModelsLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {keyword("load_models")}
          </Alert>
        )}

        {/* Prompt Selection */}
        {prompts.length > 1 && (
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{keyword("preprompt_label")}</InputLabel>
              <Select
                value={selectedPrompt || ""}
                label={keyword("preprompt_label")}
                onChange={handlePromptChange}
                disabled={
                  isLoading ||
                  !isReady ||
                  messages.length > 0 ||
                  streamingMessage
                }
              >
                {prompts.map((prompt) => (
                  <MenuItem
                    key={prompt.id}
                    value={prompt.id}
                    disabled={prompt.disabled}
                  >
                    <Tooltip
                      title={
                        prompt.messages && prompt.messages[1]
                          ? prompt.messages[1].content
                          : ""
                      }
                      arrow
                      placement="right"
                      enterDelay={500}
                    >
                      <span>
                        {prompt.id === "none"
                          ? keyword(prompt.name)
                          : prompt.name}
                      </span>
                    </Tooltip>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Show active prompt status - persistent throughout session */}
            {activePrompt && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <strong>
                  {keyword("prompt_selected")} {activePrompt.name}&nbsp;
                </strong>
                {messages.length === 0
                  ? activePrompt.requiresContent
                    ? keyword("active_prompt1")
                    : keyword("active_prompt2")
                  : keyword("active_prompt3")}
              </Alert>
            )}

            {/* Show prompt required message */}
            {messages.length === 0 &&
              (!selectedPrompt || selectedPrompt === "") && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>{keyword("prompt_required_1")}</strong>{" "}
                  {keyword("prompt_required_2")}
                </Alert>
              )}
          </Box>
        )}

        {/* Chat Messages Area */}
        <Paper
          ref={messagesContainerRef}
          elevation={1}
          sx={{
            height: 400,
            overflow: "auto",
            p: 2,
            mb: 2,
            backgroundColor: "#f5f5f5",
          }}
        >
          {messages.length === 0 ? (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "center", mt: 2 }}
            >
              Start a conversation with the chatbot...
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {messages.map((message) => (
                <MessageRenderer key={message.id} message={message} />
              ))}
              {streamingMessage && (
                <MessageRenderer message={streamingMessage} isStreaming />
              )}
            </Box>
          )}

          {isLoading && !streamingMessage && (
            <MessageRenderer
              message={{
                text: keyword("chatbot_typing"),
                sender: "bot",
                timestamp: new Date().toLocaleTimeString(),
              }}
            />
          )}
        </Paper>

        {/* Input Area */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "stretch" }}>
          <Tooltip title={keyword("clear_session")}>
            <span>
              <IconButton
                onClick={clearChat}
                disabled={
                  messages.length === 0 && !userInput && !isSessionActive
                }
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 1,
                  backgroundColor: "#7b1fa2",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#6a1b9a",
                  },
                  "&:disabled": {
                    backgroundColor: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                <RestartAltIcon />
              </IconButton>
            </span>
          </Tooltip>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={
              messages.length === 0 && !activePrompt
                ? keyword("chatbot_start")
                : activePrompt?.requiresContent && messages.length === 0
                  ? keyword("prompt_content_placeholder") ||
                    keyword("content_analysis")
                  : keyword("chatbot_type_here")
            }
            variant="outlined"
            disabled={isLoading || (messages.length === 0 && !activePrompt)}
            helperText={
              messages.length === 0 && !activePrompt
                ? keyword("chatbot_disable")
                : activePrompt?.requiresContent && messages.length === 0
                  ? `${activePrompt.name}: ${keyword("content_analysis")}`
                  : activePrompt
                    ? `${keyword("active_session")} ${activePrompt.name}`
                    : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {userInput && (
                    <Tooltip title={keyword("clear_input")}>
                      <IconButton
                        onClick={handleClearInput}
                        edge="end"
                        size="small"
                        disabled={isLoading}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={keyword("paste_from_clipboard")}>
                    <IconButton
                      onClick={handlePaste}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      <ContentPasteIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={
              !userInput.trim() ||
              isLoading ||
              !isReady ||
              (messages.length === 0 && !activePrompt)
            }
            sx={{ minWidth: 56, height: 56 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChatBotUI;
