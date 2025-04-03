import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";

import { preprocessFileUpload } from "@Shared/Utils/fileUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";

import { imageDeepfake } from "../../../../constants/tools";
import { resetDeepfake } from "../../../../redux/actions/tools/deepfakeImageActions";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResultsImage from "./Results/DeepfakeResultsImage";

const Deepfake = () => {
  //const { url } = useParams();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Deepfake");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");
  //const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.deepfakeImage.loading);
  const result = useSelector((state) => state.deepfakeImage.result);
  const url = useSelector((state) => state.deepfakeImage.url);
  const role = useSelector((state) => state.userSession.user.roles);
  const [input, setInput] = useState(url ? url : "");
  const [type, setType] = useState("");
  const [imageFile, setImageFile] = useState(undefined);
  //Selecting mode
  //============================================================================================

  const [selectedMode, setSelectedMode] = useState("");

  if (selectedMode !== "IMAGE") {
    setSelectedMode("IMAGE");
  }

  const dispatch = useDispatch();

  //Submiting the URL
  //============================================================================================

  const submitUrl = () => {
    UseGetDeepfake(
      keyword,
      input,
      true,
      selectedMode,
      dispatch,
      role,
      keywordWarning("error_invalid_url"),
      type,
      imageFile,
    );
  };

  const preprocessingSuccess = (file) => {
    setImageFile(file);
    setType("local");
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

  useEffect(() => {
    if (url && input && !result) {
      handleSubmit(input);
    }
  }, [url, input, result]);

  const handleSubmit = () => {
    dispatch(resetDeepfake());
    submitUrl();
  };

  const handleClose = () => {
    setInput("");
    setImageFile(undefined);
    setType("");
    dispatch(resetDeepfake());
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_deepfake_image")}
        description={keywordAllTools("navbar_deepfake_image_description")}
        icon={<imageDeepfake.icon sx={{ fill: "#00926c", fontSize: "40px" }} />}
      />

      <Alert severity="warning">{keywordWarning("warning_beta")}</Alert>

      <Box m={3} />

      <Card variant="outlined">
        {selectedMode !== "" && (
          <Box m={4}>
            <form>
              <StringFileUploadField
                labelKeyword={keyword("deepfake_image_link")}
                placeholderKeyword={keyword("deepfake_placeholder")}
                submitButtonKeyword={keyword("submit_button")}
                localFileKeyword={keyword("button_localfile")}
                urlInput={input}
                setUrlInput={setInput}
                fileInput={imageFile}
                setFileInput={setImageFile}
                handleSubmit={handleSubmit}
                fileInputTypesAccepted={"image/*"}
                handleCloseSelectedFile={handleClose}
                preprocessLocalFile={preprocessImage}
              />
            </form>
            <Box m={2} />
            {isLoading && (
              <Box mt={3}>
                <LinearProgress />
              </Box>
            )}
          </Box>
        )}
      </Card>

      <Box m={3} />

      {result && (
        <DeepfakeResultsImage
          result={result}
          url={url}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};
export default Deepfake;
