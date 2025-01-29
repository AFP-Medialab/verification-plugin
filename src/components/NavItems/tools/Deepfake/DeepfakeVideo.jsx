import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid2 from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import { preprocessFileUpload } from "components/Shared/Utils/fileUtils";
import { setError } from "redux/reducers/errorReducer";

import { videoDeepfake } from "../../../../constants/tools";
import { resetDeepfake } from "../../../../redux/actions/tools/deepfakeVideoActions";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResultsVideo from "./Results/DeepfakeResultsVideo";

const Deepfake = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Deepfake");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector((state) => state.deepfakeVideo.loading);
  const result = useSelector((state) => state.deepfakeVideo.result);
  const url = useSelector((state) => state.deepfakeVideo.url);
  const role = useSelector((state) => state.userSession.user.roles);
  const [input, setInput] = useState(url ? url : "");
  const [type, setType] = useState("");
  const [videoFile, setVideoFile] = useState(undefined);
  //Selecting mode
  //============================================================================================
  const [selectedMode, setSelectedMode] = useState("");

  if (selectedMode !== "VIDEO") {
    setSelectedMode("VIDEO");
  }

  //Submiting the URL
  //============================================================================================

  const dispatch = useDispatch();

  const submitUrl = async () => {
    await UseGetDeepfake(
      keyword,
      input,
      true,
      selectedMode,
      dispatch,
      role,
      keywordWarning("error_invalid_url"),
      type,
      videoFile,
    );
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

  const handleSubmit = async () => {
    dispatch(resetDeepfake());
    await submitUrl();
  };

  const handleClose = () => {
    setInput("");
    setVideoFile(undefined);
    setType("");
    dispatch(resetDeepfake());
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_deepfake_video")}
        description={keywordAllTools("navbar_deepfake_video_description")}
        icon={<videoDeepfake.icon sx={{ fill: "#00926c", fontSize: "40px" }} />}
      />

      <Alert severity="warning">{keywordWarning("warning_beta")}</Alert>

      <Box m={3} />

      <Card>
        <CardHeader
          title={
            <Grid2
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("deepfake_video_link")}</span>
            </Grid2>
          }
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
          {selectedMode !== "" && (
            <div>
              <Box>
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
                    handleCloseSelectedFile={handleClose}
                    preprocessLocalFile={preprocessVideo}
                    isParentLoading={isLoading}
                  />
                </form>
                <Box m={2} />
                {isLoading && (
                  <Box mt={3}>
                    <LinearProgress />
                  </Box>
                )}
              </Box>
            </div>
          )}
        </Box>
      </Card>

      <Box m={3} />

      {result && (
        <DeepfakeResultsVideo
          result={result}
          url={url}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};
export default Deepfake;
