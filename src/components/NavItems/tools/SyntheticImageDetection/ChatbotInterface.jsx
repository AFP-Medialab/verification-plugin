import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { submitUserChatbotMessage } from "../../../../redux/actions/tools/assistantActions";

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
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );
  const [formInput, setFormInput] = useState("");
  const archiveURL = useSelector(
    (state) => state?.syntheticImageDetection?.duplicates?.archive_url ?? null,
  );

  const chatbotMessages = useSelector(
    (state) => state.assistant.chatbotMessages,
  ).filter((msg) => msg.message); // Access the entire state
  const userEmail = useSelector((state) => state.userSession.user.email);

  const sendMessage = () => {
    dispatch(submitUserChatbotMessage(formInput, userEmail, archiveURL));
    setFormInput("");
  };

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
          <TextField
            variant="outlined"
            multiline
            label={keyword("assistant_chatbot_prompt")}
            style={{ margin: 8 }}
            placeholder={""}
            fullWidth
            value={formInput || ""}
            onChange={(e) => setFormInput(e.target.value)}
            data-testid="assistant-chatbot-input"
          />

          {/* submit button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            data-testid="assistant-url-selected-analyse-btn"
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            {keyword("button_submit")}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default ChatbotInterface;
