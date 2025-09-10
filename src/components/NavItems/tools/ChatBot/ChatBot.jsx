import React from "react";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { SmartToy } from "@mui/icons-material";

import HeaderTool from "components/Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import ChatBotUI from "./ChatBotUI";

const ChatBot = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/ChatBot");
  return (
    <div>
      <HeaderTool
        name={keyword("chatbot_title")}
        description={keyword("chatbot_description")}
        icon={
          <SmartToy
            style={{
              fill: "var(--mui-palette-primary-main)",
              height: "40px",
              width: "auto",
            }}
          />
        }
      />
      <Stack direction={"column"} spacing={2}>
        <Alert severity="warning">
          <div
            className={"content"}
            dangerouslySetInnerHTML={{
              __html: keyword("chatbot_settings_alert"),
            }}
          ></div>
        </Alert>
        <ChatBotUI />
      </Stack>
    </div>
  );
};

export default ChatBot;
