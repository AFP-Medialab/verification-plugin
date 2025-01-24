import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";

import LinkIcon from "@mui/icons-material/Link";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import "@Shared/GoogleAnalytics/MatomoAnalytics";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LoadingButton from "@mui/lab/LoadingButton";
import { ClearIcon } from "@mui/x-date-pickers";

import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { keyframes } from "../../../../constants/tools";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import { useKeyframeWrapper } from "./Hooks/useKeyframeWrapper";
import { useVideoSimilarity } from "./Hooks/useVideoSimilarity";
import LocalFile from "./LocalFile/LocalFile";
import KeyFramesResults from "./Results/KeyFramesResults";

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

  //download subshots results

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

  const processUrl = useSelector((state) => state.assistant.processUrl);
  useEffect(() => {
    if (processUrl) {
      setInput(processUrl);
      setSubmittedUrl(processUrl);
    }
  }, [processUrl]);

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

  const [tabSelected, setTabSelected] = useState("url");

  const handleTabSelectedChange = (event, newValue) => {
    setTabSelected(newValue);
  };

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_keyframes")}
          description={keywordAllTools("navbar_keyframes_description")}
          icon={<keyframes.icon sx={{ fill: "#00926c", fontSize: "40px" }} />}
        />

        <TabContext value={tabSelected}>
          <Box>
            <TabList
              onChange={handleTabSelectedChange}
              aria-label="lab API tabs example"
            >
              <Tab
                icon={<LinkIcon />}
                iconPosition="start"
                label={keyword("linkmode_title")}
                value="url"
                sx={{ minWidth: "inherit !important", textTransform: "none" }}
              />
              <Tab
                icon={<UploadFileIcon />}
                iconPosition="start"
                label={keyword("filemode_title")}
                value="file"
                sx={{ minWidth: "inherit", textTransform: "none" }}
              />
            </TabList>
            <Divider />
          </Box>

          <Card variant="outlined">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabPanel value="url">
                <Box>
                  <form>
                    <Grid2
                      container
                      direction="row"
                      spacing={3}
                      alignItems="center"
                    >
                      <Grid2 size="grow">
                        <TextField
                          id="standard-full-width"
                          label={keyword("keyframes_input")}
                          // placeholder={keyword("keyframes_input_placeholder")}
                          fullWidth
                          disabled={isLoading || isLoadingSimilarity}
                          value={input}
                          variant="outlined"
                          onChange={(e) => setInput(e.target.value)}
                          InputProps={{
                            endAdornment: input ? (
                              <IconButton
                                size="small"
                                onClick={() => setInput("")}
                                disabled={isLoading || isLoadingSimilarity}
                              >
                                <ClearIcon />
                              </IconButton>
                            ) : undefined,
                          }}
                        />
                      </Grid2>

                      <Grid2>
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            submitUrl();
                          }}
                          loading={isLoading || isLoadingSimilarity}
                        >
                          {keyword("button_submit")}
                        </LoadingButton>
                      </Grid2>
                    </Grid2>
                  </form>
                  {isLoading && (
                    <>
                      <Box m={3} />
                      <LinearProgress />
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value="file">
                <Box>
                  <LocalFile />
                </Box>
              </TabPanel>
            </Box>
          </Card>
        </TabContext>
        {resultData && tabSelected === "url" && (
          <KeyFramesResults
            closeResult={handleCloseResult}
            result={resultData}
          />
        )}
      </Stack>
    </Box>
  );
};
export default memo(Keyframes);
