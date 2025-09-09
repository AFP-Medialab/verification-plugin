import React, { useEffect, useRef } from "react";
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
  const messagesEndRef = useRef(null);
  const keyword = i18nLoadNamespace("components/NavItems/tools/ChatBot");

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

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages or streaming message changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleInputChange = (event) => {
    dispatch(setUserInput(event.target.value));
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
      // If content is provided, show it as a user message first
      if (content) {
        const userMessage = {
          id: Date.now(),
          text: content,
          sender: "user",
          timestamp: new Date().toLocaleTimeString(),
        };
        dispatch(addMessage(userMessage));
        // Clear input after adding user message
        dispatch(setUserInput(""));
      }

      // Create a streaming message placeholder
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

      const botResponse = await executePreRequest(
        preRequestId,
        {
          onChunk: (chunk) => {
            dispatch(
              updateStreamingMessage({
                text: chunk.fullContent,
                isStreaming: !chunk.isComplete,
              }),
            );
          },
        },
        content,
      );

      // Move streaming message to final messages
      dispatch(addMessage({ ...botResponse, id: streamingId }));
      dispatch(clearStreamingMessage());

      // Don't reset pre-request selection - keep it visible for the session
    } catch (err) {
      console.error("Failed to execute pre-request:", err);
      dispatch(clearStreamingMessage());
    }
  };

  // Initialize models on component mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !isReady) return;

    // If a pre-request is selected, only allow pre-request content
    if (selectedPreRequest && selectedPreRequest !== "") {
      const selectedPreReq = preRequests.find(
        (req) => req.id === selectedPreRequest,
      );
      if (selectedPreReq && selectedPreReq.requiresContent) {
        // Execute pre-request with the user input as content
        executeSelectedPreRequest(selectedPreRequest, userInput);
        setUserInput("");
        return;
      }
      // If pre-request doesn't require content, it should have been executed already
      return;
    }

    // Regular chat message flow (only if no pre-request is selected)
    const newUserMessage = {
      id: Date.now(),
      text: userInput,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    dispatch(addMessage(newUserMessage));
    dispatch(setUserInput(""));
    clearError();

    try {
      // Create a streaming message placeholder
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

      const botResponse = await sendTextMessage(userInput, messages, {
        onChunk: (chunk) => {
          dispatch(
            updateStreamingMessage({
              text: chunk.fullContent,
              isStreaming: !chunk.isComplete,
            }),
          );
        },
      });

      // Move streaming message to final messages
      dispatch(addMessage({ ...botResponse, id: streamingId }));
      dispatch(clearStreamingMessage());
    } catch (err) {
      // Error is already handled by the hook, just show it in UI
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
              <InputLabel>Pre-defined Requests</InputLabel>
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
                    {preReq.name}
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

          {/* Scroll target for auto-scroll functionality */}
          <div ref={messagesEndRef} />
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
                  ? activePreRequest.contentPlaceholder ||
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
