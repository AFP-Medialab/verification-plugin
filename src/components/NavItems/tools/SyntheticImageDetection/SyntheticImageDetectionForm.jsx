import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";

import { ROLES } from "@/constants/roles";
import { setError } from "@/redux/reducers/errorReducer";
import {
  resetSyntheticImageDetectionImage,
  setSyntheticImageDetectionLoading,
} from "@/redux/reducers/tools/syntheticImageDetectionReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "@Shared/StringFileUploadField";
import {
  preprocessFileUpload,
  resizeImageWithWorker,
} from "@Shared/Utils/fileUtils";

/**
 * Form component for triggering synthetic image detection via URL or local image file.
 *
 * @param {Object} props
 * @param {function} props.resetState - Function to reset input and file states.
 * @param {string} props.input - The current string input value (URL).
 * @param {function} props.setInput - Setter for the URL input field.
 * @param {File|null} props.imageFile - The current image file selected/uploaded.
 * @param {function} props.setImageFile - Setter for the image file.
 * @param {function} props.startDetection - Function to trigger detection logic (returns a Promise).
 */
const SyntheticImageDetectionForm = ({
  resetState,
  input,
  setInput,
  imageFile,
  setImageFile,
  startDetection,
}) => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlParam = urlParams.get("url");

  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector(
    (state) => state.syntheticImageDetection.loading,
  );

  const role = useSelector((state) => state.userSession.user.roles);
  const url = useSelector((state) => state.syntheticImageDetection.url);
  const result = useSelector((state) => state.syntheticImageDetection.result);

  const dispatch = useDispatch();

  const [autoResizeLocalFile, setAutoResizeLocalFile] = useState(true);

  /**
   * Callback when preprocessing succeeds. Returns and stores the processed file.
   * @param {File} file
   * @returns {File}
   */
  const preprocessingSuccess = (file) => {
    setImageFile(file);
    return file;
  };

  /**
   * Callback for preprocessing errors. Dispatches a localized error message.
   */
  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  /**
   * Preprocesses an uploaded image file based on user role and size limits.
   * @param {File} file
   * @returns {File|null|undefined}
   */
  const preprocessImage = async (file) => {
    return preprocessFileUpload(
      file,
      role,
      await preprocessImageTypeFilter(file),
      preprocessingSuccess,
      preprocessingError,
    );
  };
  const EXT_EXCLUSION = ["image/heic", "image/heif"];
  const preprocessImageTypeFilter = async (file) => {
    if (EXT_EXCLUSION.includes(file.type)) {
      dispatch(setError(keywordWarning("warning_file_format_not_supported")));
      return Error(keywordWarning("warning_file_format_not_supported"));
    }
    return file;
  };

  /**
   * Toggles the auto-resize option for local image uploads.
   */
  const toggleAutoResizeLocalFile = () => {
    setAutoResizeLocalFile((prev) => !prev);
  };

  const IMAGE_FROM = {
    URL: "url",
    UPLOAD: "local",
  };

  useEffect(() => {
    if (urlParam && !input) {
      setInput(urlParam);
      handleSubmit(urlParam);
    }
  }, []);

  useEffect(() => {
    if (url && input && !result) {
      handleSubmit(input);
    }
  }, [url, input, result]);

  /**
   * Handles form submission for synthetic image detection. Determines an input type,
   * optionally resizes the image, and triggers the detection process.
   *
   * @param {string} url - Optional URL to override current input.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (url) => {
    const processedFile =
      autoResizeLocalFile && imageFile
        ? role.includes(ROLES.BETA_TESTER)
          ? await resizeImageWithWorker(imageFile)
          : imageFile
        : imageFile;

    if (autoResizeLocalFile && processedFile) {
      setImageFile(processedFile);
    }

    dispatch(resetSyntheticImageDetectionImage());

    const urlInput = url ? url : input;

    const type =
      urlInput && typeof urlInput === "string"
        ? IMAGE_FROM.URL
        : IMAGE_FROM.UPLOAD;

    dispatch(setSyntheticImageDetectionLoading(true));

    await startDetection({
      type: type,
      url: urlInput,
      imageFile: processedFile,
    });
  };

  return (
    <Card variant="outlined">
      <Box
        sx={{
          p: 4,
        }}
      >
        <Stack direction="column" spacing={2}>
          <form>
            <StringFileUploadField
              labelKeyword={keyword("synthetic_image_detection_link")}
              placeholderKeyword={keyword(
                "synthetic_image_detection_placeholder",
              )}
              submitButtonKeyword={keyword("submit_button")}
              localFileKeyword={keyword("button_localfile")}
              urlInput={input}
              setUrlInput={setInput}
              fileInput={imageFile}
              setFileInput={setImageFile}
              handleSubmit={handleSubmit}
              fileInputTypesAccepted={"image/*"}
              handleCloseSelectedFile={resetState}
              preprocessLocalFile={preprocessImage}
              isParentLoading={isLoading}
              handleClearUrl={resetState}
            />
          </form>

          {role.includes(ROLES.BETA_TESTER) && imageFile && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoResizeLocalFile}
                    onChange={toggleAutoResizeLocalFile}
                    size="small"
                    disabled={isLoading}
                  />
                }
                label="Auto-Resize"
              />
            </FormGroup>
          )}

          {isLoading && (
            <Box
              sx={{
                mt: 3,
              }}
            >
              <LinearProgress />
            </Box>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default SyntheticImageDetectionForm;
