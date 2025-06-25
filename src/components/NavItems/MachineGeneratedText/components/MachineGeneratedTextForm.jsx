import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { ClearIcon } from "@mui/x-date-pickers";

/**
 * A form component for submitting text to be analyzed for machine-generated content.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.searchString - The current text input by the user.
 * @param {Function} props.setSearchString - Function to update the input text.
 * @param {Function} props.onSubmit - Callback to handle form submission.
 * @param {Object} props.mutationChunks - Mutation object for chunk-based detection.
 * @param {Object} props.mutationSentences - Mutation object for sentence-based detection.
 * @returns {JSX.Element}
 */
const MachineGeneratedTextForm = ({
  mutationChunks,
  mutationSentences,
  searchString,
  setSearchString,
  onSubmit,
}) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/MachineGeneratedText",
  );

  const isLoading =
    mutationChunks.status === "pending" ||
    mutationSentences.status === "pending";

  return (
    <Card variant="outlined">
      <Box
        sx={{
          p: 4,
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
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
              disabled={isLoading}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
              onKeyDown={(e) => {
                const isMac = navigator.userAgent.includes("Mac");
                const shouldSubmit = isMac ? e.metaKey : e.ctrlKey;

                if (e.key === "Enter" && shouldSubmit) {
                  e.preventDefault();
                  onSubmit();
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
                            disabled={isLoading}
                            sx={{ p: 1 }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Paste text">
                          <IconButton
                            onClick={async () => {
                              const text = await navigator.clipboard.readText();
                              setSearchString(text);
                            }}
                            edge="end"
                            aria-label="paste text"
                            disabled={isLoading}
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
              disabled={isLoading || !searchString}
              loading={isLoading}
            >
              {keyword("mgt_form_submit_button")}
            </Button>
          </Stack>
        </form>
      </Box>
    </Card>
  );
};

export default MachineGeneratedTextForm;
