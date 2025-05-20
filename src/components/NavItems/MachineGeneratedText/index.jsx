import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { useColorScheme } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import CopyButton from "@Shared/CopyButton";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { ClearIcon } from "@mui/x-date-pickers";

import assistantApiCalls from "../Assistant/AssistantApiHandlers/useAssistantApi";

const JsonBlock = ({ children }) => {
  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  return (
    <Typography
      component="pre"
      sx={{
        backgroundColor: resolvedMode === "dark" ? "#1e1e1e" : "#f5f5f5",
        padding: 2,
        borderRadius: 2,
        overflowX: "auto",
        fontFamily: "monospace",
        flexGrow: 1,
        marginRight: 2,
      }}
    >
      {children}
    </Typography>
  );
};

const MachineGeneratedText = () => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/MachineGeneratedText",
  );

  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  const [searchString, setSearchString] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [activeTab, setActiveTab] = useState("sentences");

  const getMachineGeneratedTextChunksScores = async (text) => {
    return await assistantApiCalls().callMachineGeneratedTextChunksService(
      text,
    );
  };

  const getMachineGeneratedTextSentencesScores = async (text) => {
    return await assistantApiCalls().callMachineGeneratedTextSentencesService(
      text,
    );
  };

  const mutationChunks = useMutation({
    mutationFn: (text) => getMachineGeneratedTextChunksScores(text),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutationSentences = useMutation({
    mutationFn: (text) => getMachineGeneratedTextSentencesScores(text),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const HighlightedText = ({ text, chunks }) => {
    const getColor = (score) => {
      if (score < 0.1) return "#4CAF50";
      if (score < 0.5) return "#8BC34A";
      return "#FF9800";
    };

    return (
      <Box>
        {chunks.entities.Important_Sentence.map((chunk, index) => {
          const chunkText = text.slice(chunk.indices[0], chunk.indices[1]);
          // const color = getColor(chunk.score);
          const color = resolvedMode === "light" ? chunk.rgb : chunk.rgbDark;
          const scorePercentage = Math.round(chunk.score * 100);

          return (
            <Tooltip
              key={index}
              title={`Score: ${scorePercentage}%`}
              placement="top"
              arrow
            >
              <Typography
                sx={{
                  backgroundColor: `rgb(${color.join(" ")})`,
                  display: "inline",
                  padding: "0 2px",
                  margin: "0 2px",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    filter: "brightness(1.2)",
                  },
                }}
              >
                {chunkText}
              </Typography>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <Stack direction={"column"} spacing={4}>
      <Card variant="outlined">
        <Box
          sx={{
            p: 4,
          }}
        >
          <form>
            <Stack
              direction="column"
              spacing={2}
              sx={{
                height: "100%",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <TextField
                fullWidth
                value={searchString}
                label={keyword("mgt_form_textfield_placeholder")}
                placeholder={keyword("mgt_form_textfield_placeholder")}
                multiline
                minRows={2}
                maxRows={10}
                variant="outlined"
                disabled={mutationChunks.status === "pending"}
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
                onKeyDown={(e) => {
                  const isMac = navigator.userAgent.includes("Mac");
                  const shouldSubmit = isMac ? e.metaKey : e.ctrlKey;

                  if (e.key === "Enter" && shouldSubmit) {
                    e.preventDefault();
                    setSubmittedText(searchString);
                    mutationChunks.mutate(searchString);
                    mutationSentences.mutate(searchString);
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {searchString ? (
                          <Tooltip title="Clear text">
                            <IconButton
                              onClick={() => setSearchString("")}
                              edge="end"
                              aria-label="clear text"
                              sx={{ p: 1 }}
                            >
                              <ClearIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Paste text">
                            <IconButton
                              onClick={async () => {
                                const text =
                                  await navigator.clipboard.readText();
                                setSearchString(text);
                              }}
                              edge="end"
                              aria-label="paste text"
                              sx={{ p: 1 }}
                            >
                              <ContentPasteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={mutationChunks.status === "pending" || !searchString}
                loading={mutationChunks.status === "pending"}
                onClick={(e) => {
                  e.preventDefault();
                  setSubmittedText(searchString);
                  mutationChunks.mutate(searchString);
                  mutationSentences.mutate(searchString);
                }}
              >
                {keyword("mgt_form_submit_button")}
              </Button>
            </Stack>
          </form>
        </Box>
      </Card>

      {mutationChunks.status === "pending" ||
        (mutationSentences.status === "pending" && (
          <Alert icon={<CircularProgress size={20} />} severity="info">
            {"Loading..."}
          </Alert>
        ))}

      {mutationChunks.status === "error" ||
        (mutationSentences.status === "error" && (
          <Alert severity="error">
            {"An error happened, try again later"}
            <Box mt={2}>
              <JsonBlock>
                {JSON.stringify(mutationChunks.error, null, 2)}
              </JsonBlock>
            </Box>
          </Alert>
        ))}

      {mutationChunks.data && mutationSentences.data && (
        <Stack direction="column" spacing={4}>
          <Card variant="outlined">
            <Box p={4} sx={{ position: "relative" }}>
              <Stack direction="column" spacing={4}>
                <Typography>
                  {"Detection score (chunks): " +
                    Math.round(
                      mutationChunks.data.entities.mgt_overall_score[0].score *
                        100,
                    ) +
                    "%"}
                </Typography>

                <Typography>
                  {"Detection score (sentences): " +
                    Math.round(
                      mutationSentences.data.entities.mgt_overall_score[0]
                        .score * 100,
                    ) +
                    "%"}
                </Typography>

                <Tabs
                  value={activeTab}
                  onChange={(event, newValue) => setActiveTab(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="data selection tabs"
                >
                  <Tab label="Sentences" value="sentences" />
                  <Tab label="Chunks" value="chunks" />
                </Tabs>

                <HighlightedText
                  text={submittedText}
                  chunks={
                    activeTab === "sentences"
                      ? mutationSentences.data
                      : mutationChunks.data
                  }
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <JsonBlock>
                    {JSON.stringify(
                      activeTab === "sentences"
                        ? mutationSentences.data
                        : mutationChunks.data,
                      null,
                      2,
                    )}
                  </JsonBlock>
                  <CopyButton
                    strToCopy={JSON.stringify(
                      activeTab === "sentences"
                        ? mutationSentences.data
                        : mutationChunks.data,
                      null,
                      2,
                    )}
                    labelBeforeCopy={"Copy JSON"}
                    labelAfterCopy={"Copied!"}
                  />
                </Box>
              </Stack>
            </Box>
          </Card>
        </Stack>
      )}
    </Stack>
  );
};

export default MachineGeneratedText;
