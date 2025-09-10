import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendIcon from "@mui/icons-material/Send";

import {
  addMessage,
  clearSession,
  clearStreamingMessage,
  setActivePreRequest,
  setSelectedPreRequest,
  setStreamingMessage,
  setUserInput,
  updateStreamingMessage,
} from "@/redux/reducers/chatBotReducer";
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
    const message = {
      id: streamingId,
      text: "",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true,
    };
    dispatch(setStreamingMessage(message));
    return streamingId;
  };

  const createChunkHandler = () => (chunk) => {
    dispatch(
      updateStreamingMessage({
        text: chunk.fullContent,
        isStreaming: !chunk.isComplete,
      }),
    );
  };

  const handle404Error = (err, previousInput) => {
    if (err.status === 404 && previousInput) {
      dispatch(setUserInput(previousInput));
    }
  };

  const finalizeStreaming = (botResponse, streamingId, userMessage = null) => {
    if (userMessage) dispatch(addMessage(userMessage));
    dispatch(addMessage({ ...botResponse, id: streamingId }));
    dispatch(clearStreamingMessage());
  };

  // Redux state selectors
  const {
    userInput,
    messages,
    streamingMessage,
    selectedPreRequest,
    activePreRequest,
    isSessionActive,
  } = useSelector((state) => state.chatBot);

  const {
    models,
    selectedModel,
    isLoading,
    isModelsLoading,
    error,
    preRequests,
    fetchModels,
    setSelectedModel,
    sendTextMessage,
    executePreRequest,
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

  const handlePreRequestChange = (event) => {
    const preRequestId = event.target.value;
    dispatch(setSelectedPreRequest(preRequestId));

    // Store the active pre-request for persistent display
    if (preRequestId && preRequestId !== "") {
      const selectedPreReq = preRequests.find((req) => req.id === preRequestId);
      dispatch(setActivePreRequest({ preRequest: selectedPreReq }));

      // If it's a pre-request that doesn't require content, execute immediately
      if (selectedPreReq && !selectedPreReq.requiresContent) {
        executeSelectedPreRequest(preRequestId);
      }
    }
  };

  const executeSelectedPreRequest = async (preRequestId, content = null) => {
    try {
      if (content) {
        dispatch(addMessage(createMessage(content)));
        dispatch(setUserInput(""));
      }

      const streamingId = createStreamingMessage();
      const botResponse = await executePreRequest(
        preRequestId,
        { onChunk: createChunkHandler(), temperature },
        content,
        messages,
      );

      finalizeStreaming(botResponse, streamingId);
    } catch (err) {
      handle404Error(err, content);
      console.error("Failed to execute pre-request:", err);
      dispatch(clearStreamingMessage());
      throw err;
    }
  };

  // Initialize models on component mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !isReady) return;

    const previousUserInput = userInput;

    // Handle pre-request flow
    if (selectedPreRequest && selectedPreRequest !== "") {
      const selectedPreReq = preRequests.find(
        (req) => req.id === selectedPreRequest,
      );
      if (selectedPreReq?.requiresContent) {
        try {
          await executeSelectedPreRequest(selectedPreRequest, userInput);
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
        title={
          <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
            {keyword("chatbot_title")}
          </Typography>
        }
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
            <Tooltip title={keyword("clear_session")}>
              <IconButton
                onClick={clearChat}
                disabled={
                  messages.length === 0 && !userInput && !isSessionActive
                }
                size="small"
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
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

        {/* Pre-request Selection */}
        {preRequests.length > 1 && (
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{keyword("preprompt_label")}</InputLabel>
              <Select
                value={selectedPreRequest}
                label={keyword("preprompt_label")}
                onChange={handlePreRequestChange}
                disabled={
                  isLoading ||
                  !isReady ||
                  messages.length > 0 ||
                  streamingMessage
                }
              >
                {preRequests.map((preReq) => (
                  <MenuItem
                    key={preReq.id}
                    value={preReq.id}
                    disabled={preReq.disabled}
                  >
                    {keyword(preReq.name)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Show active pre-request status - persistent throughout session */}
            {activePreRequest && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <strong>Selected: {activePreRequest.name}</strong>
                {messages.length === 0
                  ? activePreRequest.requiresContent
                    ? keyword("active_prompt1")
                    : keyword("active_prompt2")
                  : keyword("active_prompt3")}
              </Alert>
            )}

            {/* Show pre-request required message */}
            {messages.length === 0 &&
              (!selectedPreRequest || selectedPreRequest === "") && (
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
            <>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      backgroundColor:
                        message.sender === "user" ? "#1976d2" : "#fff",
                      color: message.sender === "user" ? "#fff" : "#000",
                    }}
                  >
                    <Box sx={{ mb: 0.5 }}>
                      <MessageContent
                        content={message.text}
                        sender={message.sender}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {message.timestamp}
                    </Typography>
                  </Paper>
                </Box>
              ))}

              {/* Display streaming message */}
              {streamingMessage && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      backgroundColor: "#fff",
                      color: "#000",
                      position: "relative",
                    }}
                  >
                    <Box sx={{ mb: 0.5 }}>
                      <MessageContent
                        content={streamingMessage.text || ""}
                        sender={streamingMessage.sender}
                      />
                      {streamingMessage.isStreaming && (
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: "8px",
                            height: "20px",
                            backgroundColor: "#1976d2",
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
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {streamingMessage.timestamp}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </>
          )}

          {isLoading && !streamingMessage && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: "#fff" }}>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  Chatbot is typing...
                </Typography>
              </Paper>
            </Box>
          )}
        </Paper>

        {/* Input Area */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={
              messages.length === 0 && !activePreRequest
                ? keyword("chatbot_start")
                : activePreRequest?.requiresContent && messages.length === 0
                  ? keyword("prompt_content_placeholder") ||
                    keyword("content_analysis")
                  : keyword("chatbot_type_here")
            }
            variant="outlined"
            disabled={isLoading || (messages.length === 0 && !activePreRequest)}
            helperText={
              messages.length === 0 && !activePreRequest
                ? keyword("chatbot_disable")
                : activePreRequest?.requiresContent && messages.length === 0
                  ? `${activePreRequest.name}: ${keyword("content_analysis")}`
                  : activePreRequest
                    ? `${keyword("active_session")} ${activePreRequest.name}`
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
              (messages.length === 0 && !activePreRequest)
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
