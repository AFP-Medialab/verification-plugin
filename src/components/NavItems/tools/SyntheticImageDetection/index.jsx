import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSyntheticImageDetectionLoading,
  setSyntheticImageDetectionResult,
} from "../../../../redux/actions/tools/syntheticImageDetectionActions";

import axios from "axios";
import {
  Box,
  TextField,
  Button,
  LinearProgress,
  Card,
  CardHeader,
  Grid,
  Alert,
} from "@mui/material";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { Gradient } from "@mui/icons-material";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { isValidUrl } from "../../../Shared/Utils/URLUtils";
import SyntheticImageDetectionResults from "./syntheticImageDetectionResults";

import { setError } from "redux/actions/errorActions";

const SyntheticImageDetection = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const isLoading = useSelector(
    (state) => state.syntheticImageDetection.loading,
  );
  const result = useSelector((state) => state.syntheticImageDetection.result);
  const url = useSelector((state) => state.syntheticImageDetection.url);
  const [input, setInput] = useState(url ? url : "");
  const dispatch = useDispatch();

  const useGetSyntheticImageScores = async (url, processURL, dispatch) => {
    if (!processURL || !url) {
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

    if (!isValidUrl(url)) {
      handleError(keywordWarning("error_invalid_url"));
      return;
    }

    let res;

    try {
      res = await axios.post(baseURL + modeURL + "jobs", null, {
        params: { url: url, services: services },
      });
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
          setSyntheticImageDetectionResult({ url: url, result: response.data }),
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
          <div>
            <Box>
              <form>
                <Grid container direction="row" spacing={3} alignItems="center">
                  <Grid item xs>
                    <TextField
                      type="url"
                      id="standard-full-width"
                      label={keyword("synthetic_image_detection_link")}
                      placeholder={keyword(
                        "synthetic_image_detection_placeholder",
                      )}
                      fullWidth
                      value={input}
                      variant="outlined"
                      disabled={isLoading}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={async (e) => {
                        e.preventDefault(),
                          await useGetSyntheticImageScores(
                            input,
                            true,
                            dispatch,
                          );
                      }}
                      disabled={input === "" || isLoading}
                    >
                      {"Submit"}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              {isLoading && (
                <Box mt={3}>
                  <LinearProgress />
                </Box>
              )}
            </Box>
          </div>
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
