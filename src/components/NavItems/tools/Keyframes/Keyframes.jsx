import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import "@Shared/GoogleAnalytics/MatomoAnalytics";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LoadingButton from "@mui/lab/LoadingButton";
import { ClearIcon } from "@mui/x-date-pickers";

import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { keyframes } from "../../../../constants/tools";
import {
  resetKeyframes,
  setKeyframesUrl,
} from "../../../../redux/reducers/tools/keyframesReducer";
import { useProcessKeyframes } from "./Hooks/useKeyframeWrapper";
import { useVideoSimilarity } from "./Hooks/useVideoSimilarity";
import { ImageWithFade } from "./ImageWithFade";
import LocalFile from "./LocalFile/LocalFile";
import KeyFramesResults from "./Results/KeyFramesResults";

const Keyframes = () => {
  const { url } = useParams();

  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const dispatch = useDispatch();

  const resultUrl = useSelector((state) => state.keyframes.url);
  const resultData = useSelector((state) => state.keyframes.result);
  const keyframesFeaturesData = useSelector(
    (state) => state.keyframes.keyframesFeatures,
  );
  const isLoadingSimilarity = useSelector(
    (state) => state.keyframes.similarityLoading,
  );

  const role = useSelector((state) => state.userSession.user.roles);

  const similarityResults = useSelector((state) => state.keyframes.similarity);

  // State used to load images
  const [input, setInput] = useState(resultUrl ? resultUrl : "");
  const [submittedUrl, setSubmittedUrl] = useState(undefined);
  //const [urlDetected, setUrlDetected] = useState(false)
  useVideoSimilarity(submittedUrl, keyword);

  useTrackEvent(
    "submission",
    "keyframe",
    "video key frame analysis",
    input.trim(),
    null,
    submittedUrl,
  );

  /**
   *
   * @param url {?string} Optional URL to pass if it is external
   * @returns {Promise<void>}
   */
  const submitUrl = async (url) => {
    dispatch(resetKeyframes());
    dispatch(setKeyframesUrl(url ?? input));
    try {
      setSubmittedUrl(url ?? input);
      await executeProcess(url ?? input, role);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!url) return;

    const uri = decodeURIComponent(url);
    setInput(uri);
  }, [url]);

  useEffect(() => {
    setSubmittedUrl(undefined);
  }, [submittedUrl]);

  const processUrl = useSelector((state) => state.assistant.processUrl);
  useEffect(() => {
    if (processUrl) {
      setInput(processUrl);
      setSubmittedUrl(processUrl);
      submitUrl(processUrl);
    }
  }, [processUrl]);

  const [tabSelected, setTabSelected] = useState("url");

  const handleTabSelectedChange = (event, newValue) => {
    setTabSelected(newValue);
  };

  const {
    executeProcess,
    isPending,
    status,
    error,
    isFeatureDataPending,
    featureDataError,
    featureStatus,
  } = useProcessKeyframes();

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
                          disabled={isPending || isLoadingSimilarity}
                          value={input}
                          variant="outlined"
                          onChange={(e) => setInput(e.target.value)}
                          slotProps={{
                            input: {
                              endAdornment: input ? (
                                <IconButton
                                  size="small"
                                  onClick={() => setInput("")}
                                  disabled={isPending || isLoadingSimilarity}
                                >
                                  <ClearIcon />
                                </IconButton>
                              ) : undefined,
                            },
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
                          loading={isPending || isLoadingSimilarity}
                        >
                          {keyword("button_submit")}
                        </LoadingButton>
                      </Grid2>
                    </Grid2>
                  </form>
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

        {similarityResults &&
          !isLoadingSimilarity &&
          similarityResults.length > 0 && (
            <Card variant="outlined">
              <Box>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "primary" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Box
                      p={1}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <ReportProblemOutlinedIcon
                        sx={{ color: "primary", marginRight: "8px" }}
                      />
                      <Typography
                        variant="h6"
                        align="left"
                        sx={{ color: "primary" }}
                      >
                        {keyword("found_dbkf")}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails style={{ flexDirection: "column" }}>
                    <Box p={1}>
                      <Typography variant="body1" align="left">
                        {keyword("dbkf_articles")}
                      </Typography>

                      <Box m={1} />

                      {similarityResults.map((value, key) => {
                        return (
                          <Typography
                            variant="body1"
                            align="left"
                            sx={{ color: "primary" }}
                            key={key}
                          >
                            <Link
                              target="_blank"
                              href={value.externalLink}
                              sx={{ color: "primary" }}
                            >
                              {value.externalLink}
                            </Link>
                          </Typography>
                        );
                      })}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Card>
          )}

        {status && isPending && (
          <Fade in={isPending} timeout={750}>
            <Alert icon={<CircularProgress size={20} />} severity="info">
              {status}
            </Alert>
          </Fade>
        )}

        {isPending && (
          <Fade in={isPending} timeout={1500}>
            <Card variant="outlined">
              <Stack direction="column" spacing={4} p={2}>
                <Skeleton variant="rounded" height={40} />
                <Stack direction={{ md: "row", xs: "column" }} spacing={4}>
                  <Skeleton variant="rounded" width={80} height={80} />
                  <Skeleton variant="rounded" width={80} height={80} />
                  <Skeleton variant="rounded" width={80} height={80} />
                  <Skeleton variant="rounded" width={80} height={80} />
                </Stack>
              </Stack>
            </Card>
          </Fade>
        )}

        {error && <Alert severity="error">{error.message}</Alert>}

        {resultData && tabSelected === "url" && (
          <Fade in={resultData && tabSelected === "url"} timeout={1500}>
            <div>
              <KeyFramesResults result={resultData} />
            </div>
          </Fade>
        )}

        {featureStatus && isFeatureDataPending && (
          <Alert icon={<CircularProgress size={20} />} severity="info">
            {featureStatus}
          </Alert>
        )}

        {isFeatureDataPending && (
          <Fade in={isFeatureDataPending} timeout={1500}>
            <Card variant="outlined">
              <Stack direction="column" spacing={4} p={2}>
                <Skeleton variant="rounded" height={40} />
                <Stack direction={{ md: "row", xs: "column" }} spacing={4}>
                  <Skeleton variant="rounded" width={80} height={80} />
                  <Skeleton variant="rounded" width={80} height={80} />
                  <Skeleton variant="rounded" width={80} height={80} />
                  <Skeleton variant="rounded" width={80} height={80} />
                </Stack>
              </Stack>
            </Card>
          </Fade>
        )}

        {featureDataError && (
          <Alert severity="error">{featureDataError.message}</Alert>
        )}

        {keyframesFeaturesData && tabSelected === "url" && (
          <>
            <Fade in={keyframesFeaturesData !== null} timeout={1500}>
              <Card variant="outlined">
                <Box pb={4} pt={2} pl={4} pr={4}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h6">{"Faces"}</Typography>
                    <Grid2 container direction="row" spacing={2}>
                      {keyframesFeaturesData.faces.map((item, i) => (
                        <Grid2 key={i} size={{ md: 3, lg: 1 }}>
                          <ImageWithFade
                            src={item.representative.imageUrl}
                            alt={`extracted img with face #${i + 1}`}
                          />
                        </Grid2>
                      ))}
                    </Grid2>
                  </Stack>
                </Box>
              </Card>
            </Fade>
            <Fade in={keyframesFeaturesData !== null} timeout={1500}>
              <Card variant="outlined">
                <Box p={4}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h6">{"Texts"}</Typography>
                    <Grid2 container direction="row" spacing={2}>
                      {keyframesFeaturesData.texts.map((item, i) => (
                        <Grid2 key={i} size={{ md: 3, lg: 1 }}>
                          <ImageWithFade
                            src={item.representative.imageUrl}
                            alt={`extracted img with text #${i + 1}`}
                          />
                        </Grid2>
                      ))}
                    </Grid2>
                  </Stack>
                </Box>
              </Card>
            </Fade>
          </>
        )}
      </Stack>
    </Box>
  );
};
export default memo(Keyframes);
