import React, { useRef } from "react";
import Box from "@mui/material/Box";
import { Button, ButtonGroup, Grid2, TextField } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";

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
}) => {
  const fileRef = useRef(null);

  return (
    <Box>
      <Grid2 container direction="row" spacing={3} alignItems="center">
        <Grid2 size="grow">
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
          />
        </Grid2>
        <Grid2>
          <LoadingButton
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
          </LoadingButton>
        </Grid2>
      </Grid2>
      <Grid2 mt={2}>
        <ButtonGroup
          variant="outlined"
          disabled={isParentLoading || urlInput !== ""}
        >
          <Button startIcon={<FolderOpenIcon />} sx={{ textTransform: "none" }}>
            <label htmlFor="file">
              {fileInput ? fileInput.name : localFileKeyword}
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept={fileInputTypesAccepted}
              hidden={true}
              ref={fileRef}
              onChange={async (e) => {
                e.preventDefault();
                const newFile = preprocessLocalFile
                  ? await preprocessLocalFile(e.target.files[0])
                  : e.target.files[0];
                setFileInput(newFile);
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
      </Grid2>
    </Box>
  );
};

export default StringFileUploadField;
