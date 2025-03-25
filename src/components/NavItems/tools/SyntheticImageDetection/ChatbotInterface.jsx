import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { styled } from "@mui/system";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { v4 as uuidv4 } from "uuid";

import {
  clearChatbotMessages,
  submitUserChatbotMessage,
} from "../../../../redux/actions/tools/assistantActions";

const MessageBubble = styled(Box)(({ sent }) => ({
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

const ChatbotInterface = (props) => {
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/Shared/chatbot");
  const [formInput, setFormInput] = useState("");
  const archiveURL = useSelector(
    (state) => state?.syntheticImageDetection?.duplicates?.archive_url ?? null,
  );

  const chatbotMessages = useSelector(
    (state) => state.assistant.chatbotMessages,
  ).filter((msg) => msg.message); // Access the entire state
  const userEmail = useSelector((state) => state.userSession.user.email);
  const [sessionID, setSessionID] = useState(uuidv4());

  const sendMessage = () => {
    dispatch(
      submitUserChatbotMessage(sessionID, formInput, userEmail, archiveURL),
    );
    setFormInput("");
  };

  const resetChatbot = () => {
    dispatch(clearChatbotMessages());
    setSessionID(uuidv4());
    setFormInput("");
    console.log(chatbotMessages);
  };

  // Detect when the tab is closed and send a special request to the chatbot to clear the session history
  useEffect(() => {
    return () => {
      window.addEventListener("beforeunload", function (e) {
        dispatch(submitUserChatbotMessage(sessionID, null, null, null));
      });
    };
  });

  return (
    <form>
      <Stack>
        {/* Conversation */}
        <Stack spacing={2}>
          {chatbotMessages.map((msg) => (
            <Stack
              key={msg.id}
              direction="row"
              justifyContent={msg.sent ? "flex-end" : "flex-start"}
              spacing={1}
            >
              <MessageBubble sent={msg.sent}>
                <Typography variant="body1">{msg.message}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 0.5, opacity: 0.8 }}
                ></Typography>
              </MessageBubble>
            </Stack>
          ))}
        </Stack>

        {/* text box */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            data-testid="chatbot-reset-btn"
            onClick={(e) => {
              e.preventDefault();
              resetChatbot();
            }}
          >
            <Tooltip title="chatbot_new_conversation">
              <Typography>
                <RestartAltIcon />
              </Typography>
            </Tooltip>
          </Button>
          <TextField
            variant="outlined"
            multiline
            label={keyword("chatbot_prompt")}
            style={{ margin: 8 }}
            placeholder={""}
            fullWidth
            value={formInput || ""}
            onChange={(e) => setFormInput(e.target.value)}
            data-testid="chatbot-input"
          />

          {/* submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            data-testid="chatbot-submit-btn"
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            {keyword("chatbot_submit_button")}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default ChatbotInterface;
