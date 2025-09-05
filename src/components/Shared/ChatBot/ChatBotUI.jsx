import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";

import MessageContent from "./MessageContent";
import useChatBot from "./useChatBot";

const ChatBotUI = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const {
    models,
    selectedModel,
    isLoading,
    isModelsLoading,
    error,
    preRequests,
    selectedPreRequest,
    fetchModels,
    setSelectedModel,
    sendTextMessage,
    executePreRequest,
    setSelectedPreRequest,
    clearError,
    isReady,
  } = useChatBot();

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const clearChat = () => {
    setMessages([]);
    setUserInput("");
    setSelectedPreRequest("");
    clearError();
  };

  const handlePreRequestChange = (event) => {
    const preRequestId = event.target.value;
    setSelectedPreRequest(preRequestId);

    // If it's a pre-request that doesn't require content, execute immediately
    if (preRequestId && preRequestId !== "") {
      const selectedPreReq = preRequests.find((req) => req.id === preRequestId);
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
        setMessages((prev) => [...prev, userMessage]);
      }

      const botResponse = await executePreRequest(preRequestId, {}, content);
      setMessages((prev) => [...prev, { ...botResponse, id: Date.now() + 1 }]);
      // Reset pre-request selection after execution
      setSelectedPreRequest("");
    } catch (err) {
      console.error("Failed to execute pre-request:", err);
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

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setUserInput("");
    clearError();

    try {
      const botResponse = await sendTextMessage(userInput, messages);
      setMessages((prev) => [...prev, { ...botResponse, id: Date.now() + 1 }]);
    } catch (err) {
      // Error is already handled by the hook, just show it in UI
      console.error("Failed to send message:", err);
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
            Chat Bot Assistant
          </Typography>
        }
        action={
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Model</InputLabel>
              <Select
                value={selectedModel}
                label="Model"
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
            <Tooltip title="Clear chat">
              <IconButton
                onClick={clearChat}
                disabled={messages.length === 0 && !userInput}
                size="small"
              >
                <ClearIcon />
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
            Loading available models...
          </Alert>
        )}

        {/* Pre-request Selection */}
        {preRequests.length > 1 && (
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Pre-defined Requests</InputLabel>
              <Select
                value={selectedPreRequest}
                label="Pre-defined Requests"
                onChange={handlePreRequestChange}
                disabled={messages.length > 0 || isLoading || !isReady}
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

            {/* Show selected pre-request status */}
            {selectedPreRequest && selectedPreRequest !== "" && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                <strong>
                  {
                    preRequests.find((req) => req.id === selectedPreRequest)
                      ?.name
                  }
                </strong>{" "}
                selected.
                {preRequests.find((req) => req.id === selectedPreRequest)
                  ?.requiresContent
                  ? " Regular chat is disabled. Type your content in the chat box below and send it, or clear the chat to cancel."
                  : " Pre-request executed."}
              </Alert>
            )}

            {/* Show pre-request required message */}
            {messages.length === 0 &&
              (!selectedPreRequest || selectedPreRequest === "") && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>Pre-request Required:</strong> Please select a
                  pre-defined request above to start using the chatbot.
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
            messages.map((message) => (
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
            ))
          )}

          {isLoading && (
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
              messages.length === 0 &&
              (!selectedPreRequest || selectedPreRequest === "")
                ? "Please select a pre-defined request above to start..."
                : selectedPreRequest &&
                    selectedPreRequest !== "" &&
                    preRequests.find((req) => req.id === selectedPreRequest)
                      ?.requiresContent
                  ? preRequests.find((req) => req.id === selectedPreRequest)
                      ?.contentPlaceholder || "Enter content for analysis..."
                  : "Type your message here..."
            }
            variant="outlined"
            disabled={
              isLoading ||
              (messages.length === 0 &&
                (!selectedPreRequest || selectedPreRequest === ""))
            }
            helperText={
              messages.length === 0 &&
              (!selectedPreRequest || selectedPreRequest === "")
                ? "Chat is disabled until you select a pre-defined request"
                : selectedPreRequest &&
                    selectedPreRequest !== "" &&
                    preRequests.find((req) => req.id === selectedPreRequest)
                      ?.requiresContent
                  ? "Pre-request mode: Only content for analysis will be processed"
                  : ""
            }
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={
              !userInput.trim() ||
              isLoading ||
              !isReady ||
              (messages.length === 0 &&
                (!selectedPreRequest || selectedPreRequest === "")) ||
              (selectedPreRequest &&
                selectedPreRequest !== "" &&
                !preRequests.find((req) => req.id === selectedPreRequest)
                  ?.requiresContent)
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
