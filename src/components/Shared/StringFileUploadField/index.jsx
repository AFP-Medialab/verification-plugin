import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import { Button, ButtonGroup, Grid, TextField } from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloseIcon from "@mui/icons-material/Close";

/**
 * A reusable form component with a textfield or a local file with optional processing
 *
 * @param labelKeyword {String} The translation for the Textfield label
 * @param placeholderKeyword {String} The translation for the Textfield placeholder
 * @param submitButtonKeyword {String} The translation for the Submit Button text
 * @param localFileKeyword {String} The translation for the Local File Button text
 * @param localFileKeyword {String} The translation for the Local File Button text
 * @param urlInput {String} The value of the url string in the Textfield
 * @param setUrlInput Function to call when the url input changes
 * @param fileInputTypesAccepted Accepted file input types for upload control
 * @param handleCloseSelectedFile An optional handler function to execute when clearing the file selected
 * @param preprocessLocalFile Optional preprocessing function to process a local file
 * @returns {Element}
 * @constructor
 */
const StringFileUploadField = ({
  labelKeyword,
  placeholderKeyword,
  submitButtonKeyword,
  localFileKeyword,
  urlInput,
  setUrlInput,
  handleSubmit,
  fileInputTypesAccepted,
  handleCloseSelectedFile,
  preprocessLocalFile,
}) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box>
      <Grid container direction="row" spacing={3} alignItems="center">
        <Grid item xs>
          <TextField
            type="url"
            id="standard-full-width"
            label={labelKeyword}
            placeholder={placeholderKeyword}
            fullWidth
            value={urlInput}
            variant="outlined"
            disabled={isLoading || file instanceof Blob}
            onChange={(e) => setUrlInput(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              urlInput ? await handleSubmit(urlInput) : await handleSubmit(e);
              setIsLoading(false);
            }}
            disabled={(urlInput === "" && !file) || isLoading}
          >
            {submitButtonKeyword}
          </Button>
        </Grid>
      </Grid>
      <Grid item mt={2}>
        <ButtonGroup variant="outlined" disabled={isLoading || urlInput !== ""}>
          <Button startIcon={<FolderOpenIcon />} sx={{ textTransform: "none" }}>
            <label htmlFor="file">{file ? file.name : localFileKeyword}</label>
            <input
              id="file"
              name="file"
              type="file"
              accept={fileInputTypesAccepted}
              hidden={true}
              ref={fileRef}
              onChange={async (e) => {
                e.preventDefault();
                console.log(e.target);
                const newFile = preprocessLocalFile
                  ? await preprocessLocalFile(e.target.files[0])
                  : e.target.files[0];
                console.log(newFile);
                setFile(newFile);
              }}
            />
          </Button>
          {file instanceof Blob && (
            <Button
              size="small"
              aria-label="remove selected file"
              onClick={(e) => {
                e.preventDefault();
                handleCloseSelectedFile();
                fileRef.current.value = null;
                setFile(null);
              }}
            >
              <CloseIcon fontSize="small" />
            </Button>
          )}
        </ButtonGroup>
      </Grid>
    </Box>
  );
};

export default StringFileUploadField;
