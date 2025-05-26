import React, { useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { green } from "@mui/material/colors";
import { useColorScheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import { ClearIcon } from "@mui/x-date-pickers";
import accept from "attr-accept";

import { prettifyLargeString } from "../../NavItems/tools/Archive/utils";
import { i18nLoadNamespace } from "../Languages/i18nLoadNamespace";

/**
 * A reusable form component with a textfield and a local file with optional processing
 *
 * @param labelKeyword {String} The translation for the Textfield label
 * @param placeholderKeyword {String} The translation for the Textfield placeholder
 * @param submitButtonKeyword {String} The translation for the Submit Button text
 * @param localFileKeyword {String} The translation for the Local File Button text
 * @param localFileKeyword {String} The translation for the Local File Button text
 * @param urlInput {String} The value of the url string in the Textfield
 * @param setUrlInput {any} Function to call when the url input changes
 * @param fileInput {File} The File selected
 * @param setFileInput {any} Function to call when the File selected changes
 * @param fileInputTypesAccepted {string} Accepted file input types for upload control
 * @param handleSubmit {any}
 * @param handleCloseSelectedFile {any} An optional handler function to execute when clearing the file selected
 * @param preprocessLocalFile {any} Optional preprocessing function to process a local file
 * @param isParentLoading {?Boolean | undefined} Optional boolean to change the loading state of the component from a parent component
 @param handleClearUrl {any} An optional handler function to execute when clearing the text field input
 */
const StringFileUploadField = ({
  labelKeyword,
  placeholderKeyword,
  submitButtonKeyword,
  localFileKeyword,
  urlInput,
  setUrlInput,
  fileInput,
  setFileInput,
  handleSubmit,
  fileInputTypesAccepted,
  handleCloseSelectedFile,
  preprocessLocalFile,
  isParentLoading,
  handleClearUrl,
}) => {
  const fileRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [validDrop, setValidDrop] = useState(false);

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  const dropColor = resolvedMode === "light" ? green[50] : green[900];

  const keyword = i18nLoadNamespace("components/Shared/StringFileUploadField");

  /**
   *
   * @param e {DragEvent}
   */
  const onDragOver = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    setIsDragging(true);

    if (file && accept(file, fileInputTypesAccepted)) {
      setValidDrop(true);
    } else {
      setValidDrop(false);
    }
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFile = async (file) => {
    if (preprocessLocalFile) {
      file = await preprocessLocalFile(file);
    }
    setFileInput(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setValidDrop(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && accept(file, fileInputTypesAccepted)) {
      handleFile(file);
    }
  };

  return (
    <Box
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      sx={{
        position: "relative",
      }}
    >
      {isDragging && (
        <Stack
          sx={{
            height: "100%",
            border: "4px dashed var(--mui-palette-primary-main)",
            backgroundColor: dropColor,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        >
          <Typography>{keyword("droppable_zone")}</Typography>
        </Stack>
      )}
      <Box
        sx={{
          visibility: isDragging ? "hidden" : "visible",
        }}
      >
        <Grid
          container
          direction="row"
          spacing={3}
          sx={{
            alignItems: "center",
          }}
        >
          <Grid size="grow">
            <TextField
              type="url"
              id="standard-full-width"
              label={labelKeyword}
              placeholder={placeholderKeyword}
              fullWidth
              value={urlInput}
              variant="outlined"
              disabled={isParentLoading || fileInput instanceof Blob}
              onChange={(e) => setUrlInput(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: urlInput ? (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setUrlInput("");
                        if (handleClearUrl) handleClearUrl();
                      }}
                      disabled={isParentLoading}
                    >
                      <ClearIcon />
                    </IconButton>
                  ) : undefined,
                },
              }}
            />
          </Grid>
          <Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={async (e) => {
                e.preventDefault();
                urlInput ? await handleSubmit(urlInput) : await handleSubmit(e);
              }}
              loading={isParentLoading}
              disabled={(urlInput === "" && !fileInput) || isParentLoading}
            >
              {submitButtonKeyword}
            </Button>
          </Grid>
        </Grid>
        <Grid
          sx={{
            mt: 2,
          }}
        >
          <ButtonGroup
            variant="outlined"
            disabled={isParentLoading || urlInput !== ""}
          >
            <Button
              startIcon={<FolderOpenIcon />}
              style={
                isDragging
                  ? { cursor: validDrop ? "copy" : "no-drop" }
                  : undefined
              }
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <label htmlFor="file">
                {fileInput
                  ? prettifyLargeString(fileInput.name, 24)
                  : localFileKeyword}
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept={fileInputTypesAccepted}
                hidden={true}
                ref={fileRef}
                onChange={(e) => {
                  e.preventDefault();
                  handleFile(e.target.files[0]);
                  e.target.value = null;
                }}
              />
            </Button>
            {fileInput instanceof Blob && (
              <Button
                size="small"
                aria-label="remove selected file"
                onClick={(e) => {
                  e.preventDefault();
                  handleCloseSelectedFile();
                  fileRef.current.value = null;
                  setFileInput(null);
                }}
              >
                <CloseIcon fontSize="small" />
              </Button>
            )}
          </ButtonGroup>
        </Grid>
      </Box>
    </Box>
  );
};

export default StringFileUploadField;
