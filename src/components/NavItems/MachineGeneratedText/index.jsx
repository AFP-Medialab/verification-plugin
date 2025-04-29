import React, { useState } from "react";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CopyButton from "@Shared/CopyButton";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import assistantApiCalls from "../Assistant/AssistantApiHandlers/useAssistantApi";

const MachineGeneratedText = () => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/MachineGeneratedText",
  );

  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState(null);

  const handleSubmit = async (text) => {
    setIsLoading(true);

    try {
      const dt =
        await assistantApiCalls().callMachineGeneratedTextService(text);
      setResult(dt);
    } catch {
      console.error("error");
    }

    setIsLoading(false);
  };

  const HighlightedText = ({ text, chunks }) => {
    const getColor = (score) => {
      if (score < 0.1) return "#4CAF50";
      if (score < 0.5) return "#8BC34A";
      return "#FF9800";
    };

    return (
      <Box>
        {chunks.map((chunk, index) => {
          const chunkText = text.slice(chunk.startchar, chunk.endchar + 1);
          const color = getColor(chunk.score);
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
                  backgroundColor: color,
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
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                value={searchString}
                label={keyword("mgt_form_textfield_placeholder")}
                placeholder={keyword("mgt_form_textfield_placeholder")}
                multiline
                minRows={2}
                variant="outlined"
                disabled={isLoading}
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !searchString}
                loading={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(searchString);
                }}
              >
                {keyword("mgt_form_submit_button")}
              </Button>
            </Stack>
          </form>
        </Box>
      </Card>

      {result && (
        <Stack direction="column" spacing={4}>
          <Card variant="outlined">
            <Box p={4} sx={{ position: "relative" }}>
              <Stack direction="column" spacing={4}>
                <Typography>
                  {"Detection score: " + Math.round(result.score * 100) + "%"}
                </Typography>

                <HighlightedText text={searchString} chunks={result.chunks} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      backgroundColor:
                        resolvedMode === "dark" ? "#1e1e1e" : "#f5f5f5",
                      padding: 2,
                      borderRadius: 2,
                      overflowX: "auto",
                      fontFamily: "monospace",
                      flexGrow: 1,
                      marginRight: 2,
                    }}
                  >
                    {JSON.stringify(result, null, 2)}
                  </Typography>
                  <CopyButton
                    strToCopy={JSON.stringify(result, null, 2)}
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
