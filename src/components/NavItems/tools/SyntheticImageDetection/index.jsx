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
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import tsvWarning from "../../../../LocalDictionary/components/Shared/OnWarningInfo.tsv";

import { Gradient } from "@mui/icons-material";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/SyntheticImageDetection.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";

import { isValidUrl } from "../../../Shared/Utils/URLUtils";
import SyntheticImageDetectionResults from "./syntheticImageDetectionResults";

//TODO: Matomo analytics

const SyntheticImageDetection = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/SyntheticImageDetection.tsv",
    tsv,
  );
  const keywordAllTools = useLoadLanguage(
    "components/NavItems/tools/Alltools.tsv",
    tsvAlltools,
  );
  const keywordWarning = useLoadLanguage(
    "components/Shared/OnWarningInfo.tsv",
    tsvWarning,
  );

  const [input, setInput] = useState("");

  const isLoading = useSelector(
    (state) => state.syntheticImageDetection.loading,
  );
  const result = useSelector((state) => state.syntheticImageDetection.result);
  const url = useSelector((state) => state.syntheticImageDetection.url);

  const dispatch = useDispatch();

  const useGetSyntheticImageScores = async (url, processURL, dispatch) => {
    if (!processURL || !url) {
      return;
    }

    let modeURL = "";
    let services = "";

    dispatch(setSyntheticImageDetectionLoading(true));
    modeURL = "images/";
    services = "gan,diffusion,unina";

    if (!modeURL) {
      return;
    }

    const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;

    let res;

    const handleError = () => {
      // dispatch(setError(e));
      dispatch(setSyntheticImageDetectionLoading(false));
    };

    if (!isValidUrl(url)) {
      handleError("Error: not a valid url");
      return;
    }

    try {
      res = await axios.post(baseURL + modeURL + "jobs", null, {
        params: { url: url, services: services },
      });
      console.log(res);
    } catch (error) {
      // handleError("error_" + error.status);
    }

    const getResult = async (id) => {
      let response;
      try {
        response = await axios.get(baseURL + modeURL + "reports/" + id);
        await axios.get(baseURL + modeURL + "reports/" + id);
      } catch (error) {
        handleError("error_" + error.status);
      }

      if (response.data != null)
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

    waitUntilFinish(res.data.id);
  };

  const submitUrl = () => {
    useGetSyntheticImageScores(input, true, dispatch);
  };

  function sleep(fn, param) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fn(param)), 2000);
    });
  }

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
          className={classes.headerUpladedImage}
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
                      onClick={(e) => {
                        e.preventDefault(), submitUrl();
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

      {result && <SyntheticImageDetectionResults result={result} url={url} />}
    </div>
  );
};

export default SyntheticImageDetection;
