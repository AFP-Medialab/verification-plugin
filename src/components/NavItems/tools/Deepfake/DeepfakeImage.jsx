import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import DeepfakeIcon from "../../../NavBar/images/SVG/Image/Deepfake.svg";
import Grid from "@mui/material/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResultsImage from "./Results/DeepfakeResultsImage";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import Alert from "@mui/material/Alert";
import { setError } from "redux/reducers/errorReducer";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import { resetDeepfake } from "../../../../redux/actions/tools/deepfakeImageActions";
import { preprocessFileUpload } from "../../../Shared/Utils/fileUtils";

const Deepfake = () => {
  //const { url } = useParams();
  const classes = useMyStyles();
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
        icon={
          <DeepfakeIcon
            style={{ fill: "#00926c", height: "75px", width: "auto" }}
          />
        }
      />

      <Alert severity="warning">{keywordWarning("warning_beta")}</Alert>

      <Box m={3} />

      <Card>
        <CardHeader
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("deepfake_image_link")}</span>
            </Grid>
          }
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
          {selectedMode !== "" && (
            <div>
              <Box>
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
            </div>
          )}
        </Box>
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
