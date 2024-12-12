import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import useVideoRightsTreatment from "./Hooks/useVideoRightsTreatment";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import VideoRightsResults from "./Results/VideoRightsResults";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
//import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { useParams } from "react-router-dom";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import VideoRightsIcon from "../../../NavBar/images/SVG/Video/Video_rights.svg";
import { setVideoRightsLoading } from "../../../../redux/actions/tools/videoRightsActions";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { Grid2 } from "@mui/material";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";

const VideoRights = () => {
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/VideoRights");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const resultUrl = useSelector((state) => state.videoRights.url);
  const resultResult = useSelector((state) => state.videoRights.result);
  const isLoading = useSelector((state) => state.videoRights.loading);

  const [input, setInput] = useState(resultUrl);
  const [urlDetected, setUrlDetected] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  useVideoRightsTreatment(submitted, keyword);
  const dispatch = useDispatch();

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;
  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "videorights",
    "video rights",
    input,
    client_id,
    submitted,
    uid,
  );

  const submitForm = () => {
    if (!isLoading) {
      /*trackEvent(
              "submission",
              "videorights",
              "video rights",
              input,
              client_id,
              uid
            );*/
      setSubmitted(input);
      dispatch(setVideoRightsLoading(true));
    }
  };

  useEffect(() => {
    if (urlDetected) {
      submitForm();
    }
  }, [urlDetected]);

  useEffect(() => {
    if (url && url !== KNOWN_LINKS.OWN) {
      const uri = url !== null ? decodeURIComponent(url) : undefined;
      setInput(uri);
      setUrlDetected(true);
    }
  }, [url]);

  useEffect(() => {
    if (submitted) {
      setSubmitted(null);
    }
  }, [submitted]);

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
        name={keywordAllTools("navbar_rights")}
        description={keywordAllTools("navbar_rights_description")}
        icon={
          <VideoRightsIcon
            style={{ fill: "#00926c" }}
            width="40px"
            height="40px"
          />
        }
      />
      <Card>
        <CardHeader
          title={keyword("cardheader_link")}
          className={classes.headerUploadedImage}
        />
        <form className={classes.root2}>
          <Grid2 container direction="row" spacing={3} alignItems="center">
            <Grid2 size="grow">
              <TextField
                value={input}
                id="standard-full-width"
                label={keyword("copyright_input")}
                placeholder={keyword("copyright_input_placeholder")}
                fullWidth
                disabled={isLoading}
                variant="outlined"
                onChange={(e) => setInput(e.target.value)}
              />
            </Grid2>
            <Grid2>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                onClick={submitForm}
              >
                {keyword("button_submit")}
              </Button>
            </Grid2>
          </Grid2>
          {isLoading && (
            <>
              <Box m={3} />
              <LinearProgress />
            </>
          )}
        </form>
      </Card>

      <Box m={3} />

      {resultResult && <VideoRightsResults result={resultResult} />}
    </div>
  );
};
export default VideoRights;
