import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";

import { Gradient } from "@mui/icons-material";

import { useSyntheticImageDetection } from "@/components/NavItems/tools/SyntheticImageDetection/useSyntheticImageDetection";
import { ROLES } from "@/constants/roles";
import { resetSyntheticImageDetectionImage } from "@/redux/actions/tools/syntheticImageDetectionActions";
import {
  preprocessFileUpload,
  resizeImageWithWorker,
} from "@Shared/Utils/fileUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import SyntheticImageDetectionResults from "./syntheticImageDetectionResults";

const SyntheticImageDetection = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlParam = urlParams.get("url");

  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const role = useSelector((state) => state.userSession.user.roles);

  const isLoading = useSelector(
    (state) => state.syntheticImageDetection.loading,
  );
  const result = useSelector((state) => state.syntheticImageDetection.result);
  const url = useSelector((state) => state.syntheticImageDetection.url);
  const nd = useSelector((state) => state.syntheticImageDetection.duplicates);
  const [input, setInput] = useState(url ? url : "");
  const [imageFile, setImageFile] = useState(undefined);

  const [imageType, setImageType] = useState(undefined);

  const [autoResizeLocalFile, setAutoResizeLocalFile] = useState(true);

  const dispatch = useDispatch();

  const IMAGE_FROM = {
    URL: "url",
    UPLOAD: "local",
  };

  const { getSyntheticImageScores } = useSyntheticImageDetection({
    dispatch,
    keyword,
    keywordWarning,
  });

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

  const resetState = () => {
    setInput("");
    setImageFile(undefined);
    dispatch(resetSyntheticImageDetectionImage());
  };

  const preprocessingSuccess = (file) => {
    setImageFile(file);
    return file;
  };

  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const preprocessImage = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  /**
   *
   * @param url {string}
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

    await getSyntheticImageScores(urlInput, true, type, processedFile);
  };

  useEffect(() => {
    if (!result) return;

    if (imageFile && imageFile instanceof File) {
      setImageType(imageFile.type);
    }

    if (
      input &&
      typeof input === "string" &&
      input !== "" &&
      URL.canParse(input)
    ) {
      try {
        fetch(input, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
            Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
          },
        }).then(async (response) => {
          //console.log(response.headers.get("Content-Type"));
          const mimeType = (await response.blob()).type;
          setImageType(mimeType);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [imageFile, input, result]);

  const toggleAutoResizeLocalFile = () => {
    setAutoResizeLocalFile((prev) => !prev);
  };

  return (
    <Box>
      <HeaderTool
        name={keywordAllTools("navbar_synthetic_image_detection")}
        description={keywordAllTools(
          "navbar_synthetic_image_detection_description",
        )}
        icon={
          <Gradient
            style={{
              fill: "var(--mui-palette-primary-main)",
              height: "40px",
              width: "auto",
            }}
          />
        }
      />
      <Stack
        direction="column"
        spacing={2}
        sx={{
          mb: 4,
        }}
      >
        <Alert severity="warning">
          {keywordWarning("warning_beta_synthetic_image_detection")}
        </Alert>
      </Stack>
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
      <Box
        sx={{
          m: 3,
        }}
      />
      {result && (
        <SyntheticImageDetectionResults
          results={result}
          url={url}
          handleClose={resetState}
          nd={nd}
          imageType={imageType}
        />
      )}
    </Box>
  );
};

export default SyntheticImageDetection;
