import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import TwitterResults from "./Results/TwitterResults";
import { useAnalysisWrapper } from "../Analysis/Hooks/useAnalysisWrapper";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";
import Iframe from "react-iframe";
import useGenerateApiUrl from "../Analysis/Hooks/useGenerateApiUrl";
import AFacebookResults from "../Analysis/Results/AFacebookResults";
import FacebookImageDescription from "./Results/FacebookImageDescription";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { useParams } from "react-router-dom";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Grid2 } from "@mui/material";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import {
  cleanAnalysisState,
  setAnalysisComments,
  setAnalysisLinkComments,
  setAnalysisLoading,
  setAnalysisResult,
  setAnalysisVerifiedComments,
} from "../../../../redux/actions/tools/image_analysisActions";
import { imageAnalysis } from "../../../../constants/tools";

const Analysis = () => {
  const caa_analysis_url = process.env.REACT_APP_CAA_ANALYSIS_URL;
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Analysis");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const dispatch = useDispatch();
  const resultUrl = useSelector((state) => state.analysisImage.url);
  const resultData = useSelector((state) => state.analysisImage.result);
  const isLoading = useSelector((state) => state.analysisImage.loading);
  const imageFB = useSelector((state) => state.analysisImage.image);

  const [input, setInput] = useState(resultUrl ? resultUrl : "");
  const [urlDetected, setUrlDetected] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState(undefined);
  const [reprocess, setReprocess] = useState(false);
  const serviceUrl = caa_analysis_url + "images";
  const client_id = getclientId();
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

  const reprocessToggle = () => {
    setReprocess(!reprocess);
  };
  useTrackEvent(
    "submission",
    "analysis",
    "image caa analysis",
    input.trim(),
    client_id,
    submittedUrl,
  );
  const submitForm = () => {
    /*trackEvent(
                          "submission",
                          "analysis",
                          "image caa analysis",
                          input.trim(),
                          client_id
                        );*/
    setSubmittedUrl(input.trim());
    dispatch(cleanAnalysisState());
  };

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
      const uri = url !== null ? decodeURIComponent(url) : undefined;
      setInput(uri);
      setUrlDetected(true);
    }
  }, [url]);

  const processUrl = useSelector((state) => state.assistant.processUrl);
  useEffect(() => {
    if (processUrl) {
      setInput(processUrl);
      setUrlDetected(true);
    }
  }, [processUrl]);

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_analysis_image")}
        description={keywordAllTools("navbar_analysis_image_description")}
        icon={<imageAnalysis.icon sx={{ fill: "#00926c", fontSize: "40px" }} />}
      />

      <Card>
        <CardHeader
          title={keyword("image_card_header")}
          className={classes.headerUploadedImage}
        />
        <div className={classes.root2}>
          <form>
            <Grid2 container direction="row" spacing={3} alignItems="center">
              <Grid2 size="grow">
                <TextField
                  id="standard-full-width"
                  label={keyword("api_input_image")}
                  placeholder={keyword("api_input_placeholder")}
                  fullWidth
                  disabled={isLoading}
                  value={input}
                  variant="outlined"
                  onChange={(e) => setInput(e.target.value)}
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
        </div>
        {isLoading && <LinearProgress />}
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

      {
        //(resultData !== null && resultUrl != null && resultUrl.startsWith("https://twitter.com/")) ?
        resultData && resultData.platform.startsWith("twitter") ? (
          <TwitterResults report={resultData} />
        ) : null
      }
      {
        //(resultData !== null && resultUrl != null && resultUrl.startsWith("https://www.facebook.com/")) ?
        resultData && resultData.platform.startsWith("facebook") ? (
          <AFacebookResults
            report={resultData}
            image={imageFB}
            cleanAnalysisState={cleanAnalysisState}
            setAnalysisComments={setAnalysisComments}
            setAnalysisLinkComments={setAnalysisLinkComments}
            setAnalysisVerifiedComments={setAnalysisVerifiedComments}
          >
            <FacebookImageDescription
              classes={classes}
              keyword={keyword}
              report={resultData}
            />
          </AFacebookResults>
        ) : null
      }
    </div>
  );
};
export default memo(Analysis);
