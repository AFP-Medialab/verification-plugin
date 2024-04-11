import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSyntheticImageDetectionImage,
  setSyntheticImageDetectionLoading,
  setSyntheticImageDetectionResult,
} from "../../../../redux/actions/tools/syntheticImageDetectionActions";

import axios from "axios";
import {
  Alert,
  Box,
  Card,
  CardHeader,
  Grid,
  LinearProgress,
} from "@mui/material";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { Gradient } from "@mui/icons-material";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { isValidUrl } from "../../../Shared/Utils/URLUtils";
import SyntheticImageDetectionResults from "./syntheticImageDetectionResults";

import { setError } from "redux/reducers/errorReducer";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import { preprocessFileUpload } from "../../../Shared/Utils/fileUtils";

const SyntheticImageDetection = () => {
  const classes = useMyStyles();
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
  const [input, setInput] = useState(url ? url : "");
  const [imageFile, setImageFile] = useState(undefined);
  const [type, setType] = useState("");

  const dispatch = useDispatch();

  const getSyntheticImageScores = async (
    url,
    processURL,
    dispatch,
    type,
    image,
  ) => {
    if (!processURL || (!url && !image)) {
      return;
    }

    let modeURL = "";
    let services = "";

    dispatch(setSyntheticImageDetectionLoading(true));
    modeURL = "images/";
    services = "gan,unina,progan_r50_grip,adm_r50_grip";

    if (!modeURL) {
      return;
    }

    const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;

    const getUserFriendlyError = (error) => {
      // Default error
      if (!error) {
        return keyword("synthetic_image_detection_error_generic");
      }

      if (
        error.includes("Received status code 400") ||
        error.includes("Cannot open image from")
      )
        return keyword("synthetic_image_detection_error_400");

      return keyword("synthetic_image_detection_error_generic");
    };

    const handleError = (e) => {
      dispatch(setError(e));
      dispatch(setSyntheticImageDetectionLoading(false));
    };

    if (!isValidUrl(url) && !image) {
      handleError(keywordWarning("error_invalid_url"));
      return;
    }

    let res;
    const bodyFormData = new FormData();

    try {
      switch (type) {
        case "local":
          bodyFormData.append("file", image);
          res = await axios.post(baseURL + modeURL + "jobs", bodyFormData, {
            method: "post",
            params: { services: services },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          break;

        default:
          res = await axios.post(baseURL + modeURL + "jobs", null, {
            params: { url: url, services: services },
          });
          break;
      }
    } catch (error) {
      const processedError = getUserFriendlyError(
        error?.response?.data?.message ?? "error_" + error.status,
      );
      handleError(processedError);
    }

    const getResult = async (id) => {
      let response;
      try {
        response = await axios.get(baseURL + modeURL + "reports/" + id);
      } catch (error) {
        handleError("error_" + error.status);
      }

      if (response && response.data != null)
        dispatch(
          setSyntheticImageDetectionResult({
            url: image ? URL.createObjectURL(image) : url,
            result: response.data,
          }),
        );
    };

    const waitUntilFinish = async (id) => {
      let response;

      try {
        response = await axios.get(baseURL + modeURL + "jobs/" + id);
      } catch (error) {
        handleError("error_" + error.status);
      }

      if (response && response.data && response.data.status === "PROCESSING") {
        await sleep(waitUntilFinish, id);
      } else if (
        response &&
        response.data &&
        response.data.status === "COMPLETED"
      ) {
        await getResult(id);
      } else {
        handleError("error_" + response.data.status);
      }
    };

    if (!res || !res.data) return;
    await waitUntilFinish(res.data.id);
  };

  function sleep(fn, param) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fn(param)), 3000);
    });
  }

  const handleClose = () => {
    setInput("");
    setImageFile("");
    dispatch(resetSyntheticImageDetectionImage());
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

  const handleSubmit = async () => {
    dispatch(resetSyntheticImageDetectionImage());
    await getSyntheticImageScores(input, true, dispatch, type, imageFile);
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_synthetic_image_detection")}
        description={keywordAllTools(
          "navbar_synthetic_image_detection_description",
        )}
        icon={
          <Gradient
            style={{ fill: "#00926c", height: "75px", width: "auto" }}
          />
        }
      />

      <Alert severity="warning">
        {keywordWarning("warning_beta_synthetic_image_detection")}
      </Alert>

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
              <span>{keyword("synthetic_image_detection_link")}</span>
            </Grid>
          }
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
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
              handleCloseSelectedFile={handleClose}
              preprocessLocalFile={preprocessImage}
            />
          </form>

          {isLoading && (
            <Box mt={3}>
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Card>

      <Box m={3} />

      {result && (
        <SyntheticImageDetectionResults
          result={result}
          url={url}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default SyntheticImageDetection;
