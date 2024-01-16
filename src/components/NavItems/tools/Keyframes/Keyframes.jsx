import React, { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LocalFile from "./LocalFile/LocalFile";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import KeyFramesResults from "./Results/KeyFramesResults";
import { useKeyframeWrapper } from "./Hooks/useKeyframeWrapper";
import { useVideoSimilarity } from "./Hooks/useVideoSimilarity";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { useParams } from "react-router-dom";
import //trackEvent,
//getclientId,
"../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import KeyframesIcon from "../../../NavBar/images/SVG/Video/Keyframes.svg";
import Grid from "@mui/material/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import LinkIcon from "@mui/icons-material/Link";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const Keyframes = () => {
  const { url } = useParams();

  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  // state used to toggle localFile view
  const [localFile, setLocalFile] = useState(false);

  /*
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };
    */

  const resultUrl = useSelector((state) => state.keyframes.url);
  const resultData = useSelector((state) => state.keyframes.result);
  const isLoading = useSelector((state) => state.keyframes.loading);
  const isLoadingSimilarity = useSelector(
    (state) => state.keyframes.similarityLoading,
  );
  const video_id = useSelector((state) => state.keyframes.video_id);

  // State used to load images
  const [input, setInput] = useState(resultUrl ? resultUrl : "");
  const [submittedUrl, setSubmittedUrl] = useState(undefined);
  //const [urlDetected, setUrlDetected] = useState(false)
  useVideoSimilarity(submittedUrl, keyword);
  useKeyframeWrapper(submittedUrl, keyword);
  useTrackEvent(
    "submission",
    "keyframe",
    "video key frame analysis",
    input.trim(),
    null,
    submittedUrl,
  );

  //human right
  const downloadShubshots = useSelector((state) => state.humanRightsCheckBox);
  const keyframe_url = process.env.REACT_APP_KEYFRAME_API;
  //download subshots results
  const downloadAction = () => {
    let downloadlink = keyframe_url + "/keyframes/" + video_id + "/Subshots";
    fetch(downloadlink).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.click();
      });
    });
  };

  //const client_id = getclientId();
  const submitUrl = () => {
    /*trackEvent(
      "submission",
      "keyframe",
      "video key frame analysis",
      input.trim()
    );*/
    setSubmittedUrl(input);
  };

  /*useEffect(()=>{
        console.log("detected");
        if (urlDetected) {
            submitUrl()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlDetected])*/

  useEffect(() => {
    if (url) {
      if (url === KNOWN_LINKS.OWN) {
        setLocalFile(true);
      } else {
        const uri = decodeURIComponent(url);
        setInput(uri);
      }
      submitUrl();
      //setUrlDetected(true)
    }
  }, [url]);

  useEffect(() => {
    setSubmittedUrl(undefined);
  }, [submittedUrl]);

  const [classButtonURL, setClassButtonURL] = useState(null);
  const [classButtonLocal, setClassButtonLocal] = useState(null);

  const [classIconURL, setClassIconURL] = useState(
    classes.bigButtonIconSelectted,
  );
  const [classIconLocal, setClassIconLocal] = useState(classes.bigButtonIcon);

  const [showURL, setShowURL] = useState(true);
  const [showLocal, setShowLocal] = useState(false);

  if (
    showURL &&
    !showLocal &&
    classButtonURL !== classes.bigButtonDivSelectted &&
    classButtonLocal !== classes.bigButtonDiv
  ) {
    setClassButtonURL(classes.bigButtonDivSelectted);
    setClassButtonLocal(classes.bigButtonDiv);
  }

  const clickURL = () => {
    setClassButtonURL(classes.bigButtonDivSelectted);
    setClassIconURL(classes.bigButtonIconSelectted);

    setClassButtonLocal(classes.bigButtonDiv);
    setClassIconLocal(classes.bigButtonIcon);

    setShowURL(true);
    setShowLocal(false);

    setLocalFile(false);
  };

  const clickLocal = () => {
    setClassButtonURL(classes.bigButtonDiv);
    setClassIconURL(classes.bigButtonIcon);

    setClassButtonLocal(classes.bigButtonDivSelectted);
    setClassIconLocal(classes.bigButtonIconSelectted);

    setShowURL(false);
    setShowLocal(true);

    setLocalFile(true);
  };

  /**
   * Resets input
   */
  const handleCloseResult = () => {
    setInput("");
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_keyframes")}
        description={keywordAllTools("navbar_keyframes_description")}
        icon={
          <KeyframesIcon
            style={{ fill: "#00926c" }}
            width="40px"
            height="40px"
          />
        }
      />

      <Card>
        <CardHeader
          title={keyword("cardheader_source")}
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={6}>
              <Box p={3} className={classButtonURL} onClick={clickURL}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.bigButtonResponsive}
                >
                  <Grid item>
                    <Box ml={1} mr={2}>
                      <LinkIcon className={classIconURL} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Grid item>
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          {keyword("linkmode_title")}
                        </Typography>
                      </Grid>

                      <Box mt={1} />

                      <Grid item>
                        <Typography variant="body1">
                          {keyword("linkmode_description")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box p={3} className={classButtonLocal} onClick={clickLocal}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.bigButtonResponsive}
                >
                  <Grid item>
                    <Box ml={1} mr={2}>
                      <FileIcon className={classIconLocal} />
                    </Box>
                  </Grid>

                  <Grid item>
                    <Grid
                      container
                      direction="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Grid item>
                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                          {keyword("filemode_title")}
                        </Typography>
                      </Grid>

                      <Box mt={1} />

                      <Grid item>
                        <Typography variant="body1">
                          {keyword("filemode_description")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box mt={4} mb={4}>
            <Divider />
          </Box>

          <Box m={1} />
          <Box display={localFile ? "none" : "block"}>
            <form>
              <Grid container direction="row" spacing={3} alignItems="center">
                <Grid item xs>
                  <TextField
                    id="standard-full-width"
                    label={keyword("keyframes_input")}
                    placeholder={keyword("keyframes_input_placeholder")}
                    fullWidth
                    disabled={isLoading || isLoadingSimilarity}
                    value={input}
                    variant="outlined"
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
                    disabled={isLoading || isLoadingSimilarity}
                  >
                    {keyword("button_submit")}
                  </Button>
                </Grid>
              </Grid>
            </form>
            {isLoading && (
              <>
                <Box m={3} />
                <LinearProgress />
              </>
            )}
          </Box>
          <Box display={!localFile ? "none" : "block"}>
            <LocalFile />
          </Box>
        </Box>
      </Card>

      <Box m={3} />
      {resultData && !localFile ? (
        <KeyFramesResults closeResult={handleCloseResult} result={resultData} />
      ) : (
        <div />
      )}
      <div>
        {resultData && downloadShubshots && !localFile ? (
          <Button color="primary" onClick={downloadAction}>
            {keyword("keyframes_download_subshots")}
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
export default memo(Keyframes);
