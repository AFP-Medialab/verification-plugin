import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import useVideoRightsTreatment from "./Hooks/useVideoRightsTreatment";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import VideoRightsResults from "./Results/VideoRightsResults";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/VideoRights.tsv";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
//import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import {
  //trackEvent,
  getclientId,
} from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
//import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { useParams } from "react-router-dom";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import VideoRightsIcon from "../../../NavBar/images/SVG/Video/Video_rights.svg";
import { setVideoRightsLoading } from "../../../../redux/actions/tools/videoRightsActions";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import Grid from "@mui/material/Grid";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";

const VideoRights = () => {
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/VideoRights.tsv",
    tsv
  );
  const keywordAllTools = useLoadLanguage(
    "components/NavItems/tools/Alltools.tsv",
    tsvAlltools
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
  const uid = session && session.user ? session.user.email : null;
  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "videorights",
    "video rights",
    input,
    client_id,
    submitted,
    uid
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

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_rights")}
        description={keywordAllTools("navbar_rights_description")}
        icon={
          <VideoRightsIcon
            style={{ fill: "#51A5B2" }}
            width="40px"
            height="40px"
          />
        }
      />
      <Card>
        <CardHeader
          title={keyword("cardheader_link")}
          className={classes.headerUpladedImage}
        />
        <form className={classes.root2}>
          <Grid container direction="row" spacing={3} alignItems="center">
            <Grid item xs>
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
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                onClick={submitForm}
              >
                {keyword("button_submit")}
              </Button>
            </Grid>
          </Grid>
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
