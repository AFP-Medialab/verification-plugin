import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

import StringFileUploadField from "@/components/Shared/StringFileUploadField";
import { preprocessFileUpload } from "@/components/Shared/Utils/fileUtils";
import { videoDeepfake } from "@/constants/tools";
import { resetDeepfake } from "@/redux/actions/tools/deepfakeVideoActions";
import { setError } from "@/redux/reducers/errorReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { useUrlOrFile } from "Hooks/useUrlOrFile";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResultsVideo from "./Results/DeepfakeResultsVideo";

const Deepfake = () => {
  const [searchParams] = useSearchParams();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Deepfake");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.deepfakeVideo.loading);
  const result = useSelector((state) => state.deepfakeVideo.result);
  const url = useSelector((state) => state.deepfakeVideo.url);
  const role = useSelector((state) => state.userSession.user.roles);
  const [type, setType] = useState("");
  const [input = url || "", setInput, videoFile, setVideoFile] = useUrlOrFile();
  const fromAssistant = searchParams.has("fromAssistant");

  const dispatch = useDispatch();

  const submitUrl = async () => {
    if (fromAssistant && videoFile) {
      await UseGetDeepfake(
        keyword,
        "",
        true,
        "VIDEO",
        dispatch,
        role,
        keywordWarning("error_invalid_url"),
        "local",
        videoFile,
      );
    } else {
      await UseGetDeepfake(
        keyword,
        input,
        true,
        "VIDEO",
        dispatch,
        role,
        keywordWarning("error_invalid_url"),
        type,
        videoFile,
      );
    }
  };

  const preprocessingSuccess = (file) => {
    setVideoFile(file);
    setType("local");
    return file;
  };

  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };
  const preprocessVideo = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  useEffect(() => {
    if (url && input && !result) {
      handleSubmit(input);
    }
  }, [url, input, result]);

  useEffect(() => {
    if (fromAssistant && (input || videoFile)) {
      handleSubmit();
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    dispatch(resetDeepfake());
    await submitUrl();
  };

  const resetState = () => {
    setInput("");
    setVideoFile(undefined);
    setType("");
    dispatch(resetDeepfake());
  };

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_deepfake_video")}
          description={keywordAllTools("navbar_deepfake_video_description")}
          icon={
            <videoDeepfake.icon
              sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
            />
          }
        />

        <Alert severity="warning">
          {keywordWarning("warning_beta_deepfake_video")}
        </Alert>

        <Card variant="outlined">
          <Box
            sx={{
              p: 4,
            }}
          >
            <form>
              <StringFileUploadField
                labelKeyword={keyword("deepfake_video_link")}
                placeholderKeyword={keyword("deepfake_placeholder")}
                submitButtonKeyword={keyword("submit_button")}
                localFileKeyword={keyword("button_localfile")}
                urlInput={input}
                setUrlInput={setInput}
                fileInput={videoFile}
                setFileInput={setVideoFile}
                handleSubmit={handleSubmit}
                fileInputTypesAccepted={"video/*"}
                handleCloseSelectedFile={resetState}
                preprocessLocalFile={preprocessVideo}
                isParentLoading={isLoading}
                handleClearUrl={resetState}
              />
            </form>
          </Box>
        </Card>

        {result && (
          <DeepfakeResultsVideo
            result={result}
            url={url}
            handleClose={resetState}
          />
        )}
      </Stack>
    </Box>
  );
};
export default Deepfake;
