import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import YoutubeResults from "./Results/YoutubeResults";
import TwitterResults from "./Results/TwitterResults";
import { useAnalysisWrapper } from "./Hooks/useAnalysisWrapper";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Iframe from "react-iframe";
import useGenerateApiUrl from "./Hooks/useGenerateApiUrl";
import AFacebookResults from "./Results/AFacebookResults";
import FacebookVideoDescription from "./Results/FacebookVideoDescription";
import {
  cleanAnalysisState,
  setAnalysisComments,
  setAnalysisLinkComments,
  setAnalysisLoading,
  setAnalysisResult,
  setAnalysisVerifiedComments,
} from "../../../../redux/actions/tools/analysisActions";
import { useParams } from "react-router-dom";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import AnalysisIcon from "../../../NavBar/images/SVG/Video/Video_analysis.svg";
import { Grid2 } from "@mui/material";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import styles from "./Results/layout.module.css";
import Alert from "@mui/material/Alert";
import _ from "lodash";
import { getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const Analysis = () => {
  const caa_analysis_url = process.env.REACT_APP_CAA_ANALYSIS_URL;
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Analysis");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const dispatch = useDispatch();

  const resultUrl = useSelector((state) => state.analysis.url);
  const resultData = useSelector((state) => state.analysis.result);
  const isLoading = useSelector((state) => state.analysis.loading);

  const [input, setInput] = useState(resultUrl ? resultUrl : "");
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
    // eslint-disable-next-line
  }, [urlDetected]);

  useEffect(() => {
    if (url && url !== KNOWN_LINKS.OWN) {
      //("url effect if", url);
      const uri = url !== null ? decodeURIComponent(url) : undefined;
      setInput(uri);
      setUrlDetected(true);
    }
  }, [url]);

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_analysis_video")}
        description={keywordAllTools("navbar_analysis_description")}
        icon={
          <AnalysisIcon
            style={{ fill: "#00926c" }}
            width="40px"
            height="40px"
          />
        }
      />
      <Card>
        <CardHeader
          title={keyword("video_card_header")}
          className={classes.headerUploadedImage}
        />
        <form className={classes.root2}>
          <Grid2 container direction="row" spacing={3} alignItems="center">
            <Grid2 size="grow">
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
            </Grid2>
            <Grid2>
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
            </Grid2>

            <Grid2>
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
            </Grid2>
            <Box m={1} />
          </Grid2>
        </form>
        {isLoading ? <LinearProgress hidden={!isLoading} /> : null}
      </Card>
      <Box m={3} />
      {showFacebookIframe && (
        <Box m={4}>
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
