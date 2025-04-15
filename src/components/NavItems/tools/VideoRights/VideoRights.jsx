import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";

import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { videoRights } from "../../../../constants/tools";
import { setVideoRightsLoading } from "../../../../redux/actions/tools/videoRightsActions";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import useVideoRightsTreatment from "./Hooks/useVideoRightsTreatment";
import VideoRightsResults from "./Results/VideoRightsResults";

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
        icon={<videoRights.icon sx={{ fill: "#00926c", fontSize: "40px" }} />}
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
            <Grid>
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
              <Box
                sx={{
                  m: 3,
                }}
              />
              <LinearProgress />
            </>
          )}
        </form>
      </Card>
      <Box
        sx={{
          m: 3,
        }}
      />
      {resultResult && <VideoRightsResults result={resultResult} />}
    </div>
  );
};
export default VideoRights;
