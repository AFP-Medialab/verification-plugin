import React, { useEffect, useRef, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { useDispatch, useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Close, Download, ExpandMore } from "@mui/icons-material";

import { styled } from "@mui/system";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
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
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const ChatbotInterface = (props) => {
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );
  const [formInput, setFormInput] = useState("");

  const [chatbotMessages, setChatbotMessages] = useState([]);

  const sendMessage = () => {
    chatbotMessages.push({
      id: chatbotMessages.length + 1,
      sent: 1,
      text: formInput,
      class: "greeting",
    });
    dispatch(submitUserChatbotMessage(formInput));
    chatbotMessages.push({
      id: chatbotMessages.length + 1,
      sent: 0,
      text: "Hi! I am a chatbot assistant. How can I help you today?",
    });
    setFormInput("");
    setChatbotMessages(chatbotMessages);
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
                <Typography variant="body1">{msg.text}</Typography>
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
