import * as React from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";

import LoadingButton from "@mui/lab/LoadingButton";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const API_URL = process.env.REACT_APP_MY_WEB_HOOK_URL;

const getFeedbackMessage = (email, message, messageType, archiveURL = null) => {
  if (typeof message !== "string" || typeof messageType !== "string")
    throw new Error("Invalid message type");

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "" + messageType + "",
        },
      },
      ...(email
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "<mailto:" + email + ">",
              },
            },
          ]
        : []),
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "" + message + "",
        },
        ...(archiveURL // Conditionally add the accessory
          ? {
              accessory: {
                type: "image",
                image_url: archiveURL.trim(),
                alt_text: "Problematic image",
              },
            }
          : {}), // Important: Return an empty object if archiveURL is not defined
      },
    ],
  };
};

const sendToSlack = async (email, message, messageType, archiveURL = null) => {
  const feedbackMessage = getFeedbackMessage(
    email,
    message,
    messageType,
    archiveURL,
  );
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackMessage),
  });

  if (!response.ok) throw response;

  return response;
};

const Feedback = () => {
  const keyword = i18nLoadNamespace("components/FeedBack");

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [displayCard, setDisplayCard] = useState(false);

  const [messageType, setMessageType] = useState("Bug");

  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");

  const [isEmailAddress, setIsEmailAddress] = useState(false);

  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const [isFeedbackSending, setIsFeedbackSending] = useState(false);

  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const containerRef = React.useRef(null);

  const validateEmail = (email) => {
    if (!email) return true; //allow to proceed if the email is empty
    const re = /\S+@\S+\.\S+/; //match string@string.string
    return re.test(email);
  };

  const handleChange = (e, messageType) => {
    e.preventDefault();
    setMessageType(messageType);
  };

  const handleClick = async (e, message, messageType) => {
    setHasTriedSubmit(true);
    const isEmailValid = validateEmail(email);

    setIsEmailAddress(isEmailValid);

    if (!isEmailValid) return;

    setIsFeedbackSending(true);

    await sendToSlack(email, message, messageType);

    //console.log("submitted");

    setIsFeedbackSending(false);
    setIsFeedbackSent(true);
    setEmail("");
    setMessage("");

    setTimeout(() => {
      setIsFeedbackSent(false);
    }, 1000);
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-end"
      alignItems="flex-end"
      spacing={2}
      sx={{ position: "fixed", bottom: 20, right: 15, zIndex: 9998 }}
    >
      <Box ref={containerRef}>
        <Slide
          direction="up"
          in={displayCard}
          container={containerRef.current}
          timeout={250}
        >
          <Box>
            <Fade
              easing={{ enter: "ease", exit: "ease" }}
              timeout={250}
              in={displayCard}
              unmountOnExit
            >
              {
                <Box width={380}>
                  <Paper
                    component="form"
                    elevation={6}
                    sx={{ overflow: "hidden" }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={0}
                      height={50}
                      pl={1}
                      pr={1}
                    >
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={2}
                      >
                        <QuestionAnswerOutlinedIcon sx={{ color: "white" }} />
                        <Typography color="white">
                          {keyword("title")}
                        </Typography>
                      </Stack>
                      <IconButton
                        key="close"
                        aria-label="close"
                        onClick={() => setDisplayCard(false)}
                      >
                        <CloseIcon sx={{ color: "white" }} />
                      </IconButton>
                    </Stack>

                    <Stack spacing={2} p={2}>
                      <Stack>
                        <Typography color="primary">
                          {keyword("type")}
                        </Typography>
                        <ToggleButtonGroup
                          color="primary"
                          variant="contained"
                          aria-label="outlined primary button group"
                          fullWidth
                          value={messageType}
                          exclusive
                          onChange={handleChange}
                        >
                          <ToggleButton value="Bug">
                            {keyword("bug")}
                          </ToggleButton>
                          <ToggleButton value="Improvement">
                            {keyword("improvement")}
                          </ToggleButton>
                          <ToggleButton value="Feature">
                            {keyword("feature")}
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>
                      {hasTriedSubmit && !isEmailAddress ? (
                        <Stack>
                          <Typography color="primary">
                            {keyword("email")}
                          </Typography>
                          <TextField
                            error
                            id="email_error"
                            type="email"
                            placeholder={keyword("email")}
                            value={email}
                            helperText={keyword("email_error")}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Stack>
                      ) : (
                        <Stack>
                          <Typography color="primary">
                            {keyword("email")}
                          </Typography>
                          <TextField
                            id="email"
                            type="email"
                            placeholder={"john.doe@example.com"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Stack>
                      )}
                      <Stack>
                        <Typography color="primary">
                          {keyword("message")}
                        </Typography>
                        <TextField
                          id="text"
                          multiline
                          rows={6}
                          placeholder={keyword("placeholder")}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </Stack>
                      <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={message && !isFeedbackSending ? false : true}
                        loading={isFeedbackSending}
                        onClick={(e) => {
                          e.preventDefault(),
                            handleClick(e, message, messageType);
                        }}
                      >
                        {isFeedbackSent
                          ? keyword("sent")
                          : keyword("submit_text")}
                      </LoadingButton>
                    </Stack>
                  </Paper>
                </Box>
              }
            </Fade>
          </Box>
        </Slide>
      </Box>
      <Fab
        color="primary"
        variant={isButtonHovered ? "extended" : ""}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        onClick={() => setDisplayCard(!displayCard)}
        sx={{ height: 56 }}
      >
        <QuestionAnswerOutlinedIcon
          sx={isButtonHovered ? { mr: 1 } : { height: 56 }}
        />
        {isButtonHovered ? "Feedback" : null}
      </Fab>
    </Stack>
  );
};

export default Feedback;
export { getFeedbackMessage, sendToSlack }; // Named exports
