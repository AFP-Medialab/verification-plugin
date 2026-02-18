import React, { memo, useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { useUrlOrFile } from "@/Hooks/useUrlOrFile";
import { videoAnalysis } from "@/constants/tools";
import { KNOWN_LINKS } from "@/constants/tools";
import {
  cleanAnalysisState,
  setAnalysisComments,
  setAnalysisLinkComments,
  setAnalysisLoading,
  setAnalysisResult,
  setAnalysisVerifiedComments,
} from "@/redux/actions/tools/analysisActions";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import _ from "lodash";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { useAnalysisWrapper } from "./Hooks/useAnalysisWrapper";
import useGenerateApiUrl from "./Hooks/useGenerateApiUrl";
import AFacebookResults from "./Results/AFacebookResults";
import FacebookVideoDescription from "./Results/FacebookVideoDescription";
import TwitterResults from "./Results/TwitterResults";
import YoutubeResults from "./Results/YoutubeResults";
import styles from "./Results/layout.module.css";

const Analysis = () => {
  const caa_analysis_url = import.meta.env.VITE_CAA_ANALYSIS_URL;
  const { url } = useParams();
  const [searchParams] = useSearchParams();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Analysis");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const dispatch = useDispatch();

  const resultUrl = useSelector((state) => state.analysis.url);
  const resultData = useSelector((state) => state.analysis.result);
  const isLoading = useSelector((state) => state.analysis.loading);

  const [input = resultUrl || "", setInput] = useUrlOrFile();
  const [urlDetected, setUrlDetected] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState(undefined);
  const [reprocess, setReprocess] = useState(false);
  const serviceUrl = caa_analysis_url + "videos";
  const [finalUrl, showFacebookIframe] = useGenerateApiUrl(
    serviceUrl,
    submittedUrl,
    reprocess,
  );
  useAnalysisWrapper(
    setAnalysisLoading,
    setAnalysisResult,
    serviceUrl,
    finalUrl,
    submittedUrl,
    keyword,
    isLoading,
  );

  const [warning, setWarning] = useState(false);

  const reprocessToggle = () => {
    setReprocess(!reprocess);
  };
  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "analysis",
    "video caa analysis",
    input.trim(),
    client_id,
    submittedUrl,
  );
  const submitForm = () => {
    /*trackEvent(
                                                      "submission",
                                                      "analysis",
                                                      "video caa analysis",
                                                      input.trim(),
                                                      client_id
                                                    );*/
    setSubmittedUrl(input.trim());
    dispatch(cleanAnalysisState());
  };
  useEffect(() => {
    if (_.isEmpty(resultUrl)) setInput(resultUrl);
  }, [resultUrl]);

  useEffect(() => {
    if (finalUrl !== undefined) {
      setSubmittedUrl(undefined);
    }
  }, [finalUrl]);

  useEffect(() => {
    if (urlDetected) {
      submitForm();
    }
  }, [urlDetected]);

  useEffect(() => {
    if (url && url !== KNOWN_LINKS.OWN) {
      //("url effect if", url);
      const uri = url !== null ? decodeURIComponent(url) : undefined;
      setInput(uri);
      setUrlDetected(true);
    }
  }, [url]);

  useEffect(() => {
    const fromAssistant = searchParams.has("fromAssistant");
    if (fromAssistant && input) {
      setInput(input);
      setUrlDetected(true);
    }
  }, [searchParams]);

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_analysis_video")}
        description={keywordAllTools("navbar_analysis_description")}
        icon={
          <videoAnalysis.icon
            sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
          />
        }
      />
      <Card variant="outlined">
        <form className={classes.root2}>
          <Grid
            container
            direction="row"
            spacing={3}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size="grow">
              <TextField
                id="standard-full-width"
                data-testid="analysis_video_input"
                label={keyword("api_input")}
                placeholder={keyword("api_input_placeholder")}
                fullWidth
                disabled={isLoading}
                value={input}
                variant="outlined"
                onChange={(e) => {
                  setInput(e.target.value);
                  const regex = /fb.watch\//g;
                  //const regex1 = /www.facebook.com\/watch\//g;
                  const found = e.target.value.match(regex);
                  //const found1 =e.target.value.match(regex1);
                  //if(found!==null || found1!==null ){
                  if (found !== null) {
                    setWarning(true);
                  } else {
                    setWarning(false);
                  }
                }}
              />
            </Grid>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={reprocess}
                    onChange={reprocessToggle}
                    disabled={isLoading}
                    value="checkedBox"
                    color="primary"
                  />
                }
                label={keyword("api_repro")}
              />
            </Grid>

            <Grid>
              <Button
                type="submit"
                data-testid="analysis_video_submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  submitForm();
                }}
              >
                {keyword("button_submit")}
              </Button>
            </Grid>
            <Box
              sx={{
                m: 1,
              }}
            />
          </Grid>
        </form>
        {isLoading ? <LinearProgress hidden={!isLoading} /> : null}
      </Card>
      <Box
        sx={{
          m: 3,
        }}
      />
      {showFacebookIframe && (
        <Box
          sx={{
            m: 4,
          }}
        >
          <Iframe
            frameBorder="0"
            url={"https://mever.iti.gr/plugin_login_fb"}
            allow="fullscreen"
            height="400"
            width="100%"
          />
        </Box>
      )}
      {resultData && resultData.platform.startsWith("youtube") ? (
        <YoutubeResults report={resultData} />
      ) : null}
      {resultData && resultData.platform.startsWith("twitter") ? (
        <TwitterResults report={resultData} />
      ) : null}
      {resultData && resultData.platform.startsWith("facebook") ? (
        <AFacebookResults
          report={resultData}
          cleanAnalysisState={cleanAnalysisState}
          setAnalysisComments={setAnalysisComments}
          setAnalysisLinkComments={setAnalysisLinkComments}
          setAnalysisVerifiedComments={setAnalysisVerifiedComments}
        >
          <FacebookVideoDescription
            classes={classes}
            keyword={keyword}
            report={resultData}
          />
        </AFacebookResults>
      ) : null}
      {warning === true && (
        <Alert className={styles.margin1} variant="outlined" severity="warning">
          {keyword("facebook_tip")}
        </Alert>
      )}
    </div>
  );
};
export default memo(Analysis);
