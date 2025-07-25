import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
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

import { useTrackEvent } from "@/Hooks/useAnalytics";
import ImageGrid from "@/components/NavItems/tools/Keyframes/components/ImageGrid";
import { keyframes } from "@/constants/tools";
import {
  resetKeyframes,
  setKeyframesFeatures,
  setKeyframesResult,
  setKeyframesUrl,
} from "@/redux/reducers/tools/keyframesReducer";
import "@Shared/GoogleAnalytics/MatomoAnalytics";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ClearIcon } from "@mui/x-date-pickers";

import { useProcessKeyframes } from "./Hooks/useKeyframeWrapper";
import { useVideoSimilarity } from "./Hooks/useVideoSimilarity";
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
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
   * Returns a translation keyword to print a user-friendly error
   * @param error {Error} The error object
   * @returns {string} The translation keyword
   */
  const handleError = (error) => {
    if (error.code === "ECONNABORTED" || error.response?.status === 504) {
      return "error_timeout";
    } else if (error.response?.status === 500) {
      return "keyframes_error_unavailable";
    } else {
      return "keyframes_error_default";
    }
  };

  /**
   *
   * @param url {?string} Optional URL to pass if it is external
   * @returns {Promise<void>}
   */
  const submitUrl = async (url) => {
    const finalUrl = url ?? input;

    dispatch(resetKeyframes());
    dispatch(setKeyframesUrl(finalUrl));
    resetFetchingKeyframes();
    try {
      setSubmittedUrl(finalUrl);
      setHasSubmitted(true);
      const result = await executeProcess(finalUrl, role);
      if (result?.fromCache) {
        dispatch(setKeyframesResult(result.data));
        dispatch(setKeyframesFeatures(result.featureData));
        setHasSubmitted(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetResults = () => {
    setInput("");
    dispatch(resetKeyframes());
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
    resetFetchingKeyframes,
    isPending,
    status,
    data,
    error,
    isFeatureDataPending,
    featureData,
    featureDataError,
  } = useProcessKeyframes(input);

  useEffect(() => {
    if (featureData && data && hasSubmitted) {
      dispatch(setKeyframesFeatures(featureData));
      dispatch(setKeyframesResult(data));
      setHasSubmitted(false);
    }
  }, [featureData, data, hasSubmitted]);

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={keywordAllTools("navbar_keyframes")}
          description={keywordAllTools("navbar_keyframes_description")}
          icon={
            <keyframes.icon
              sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
            />
          }
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
                          label={keyword("keyframes_input")}
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
                                  onClick={() => resetResults()}
                                  disabled={isPending || isLoadingSimilarity}
                                  sx={{ p: 1 }}
                                >
                                  <ClearIcon />
                                </IconButton>
                              ) : undefined,
                            },
                          }}
                        />
                      </Grid>

                      <Grid>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            submitUrl();
                          }}
                          disabled={!input}
                          loading={isPending || isLoadingSimilarity}
                        >
                          {keyword("button_submit")}
                        </Button>
                      </Grid>
                    </Grid>
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
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      sx={{
                        p: 1,
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
                    <Box
                      sx={{
                        p: 1,
                      }}
                    >
                      <Typography variant="body1" align="left">
                        {keyword("dbkf_articles")}
                      </Typography>

                      <Box
                        sx={{
                          m: 1,
                        }}
                      />

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
          <Alert icon={<CircularProgress size={20} />} severity="info">
            {status}
          </Alert>
        )}

        {isPending && (
          <Card variant="outlined">
            <Stack
              direction="column"
              spacing={4}
              sx={{
                p: 2,
              }}
            >
              <Skeleton variant="rounded" height={40} />
              <Stack direction={{ md: "row", xs: "column" }} spacing={4}>
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
              </Stack>
            </Stack>
          </Card>
        )}

        {error && <Alert severity="error">{keyword(handleError(error))}</Alert>}

        {resultData && tabSelected === "url" && (
          <KeyFramesResults result={resultData} handleClose={resetResults} />
        )}

        {isFeatureDataPending && (
          <Card variant="outlined">
            <Stack
              direction="column"
              spacing={4}
              sx={{
                p: 2,
              }}
            >
              <Skeleton variant="rounded" height={40} />
              <Stack direction={{ md: "row", xs: "column" }} spacing={4}>
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
                <Skeleton variant="rounded" width={80} height={80} />
              </Stack>
            </Stack>
          </Card>
        )}

        {featureDataError && (
          <Alert severity="error">{featureDataError.message}</Alert>
        )}

        {keyframesFeaturesData && tabSelected === "url" && (
          <>
            <Card variant="outlined">
              <Box
                sx={{
                  pb: 4,
                  pt: 2,
                  pl: 4,
                  pr: 4,
                }}
              >
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6">
                    {keyword("faces_detected_title")}
                  </Typography>
                  <ImageGrid
                    images={keyframesFeaturesData.faces}
                    alt={"extracted img with face"}
                  />
                </Stack>
              </Box>
            </Card>
            <Card variant="outlined">
              <Box
                sx={{
                  p: 4,
                }}
              >
                <Stack direction="column" spacing={2}>
                  <Typography variant="h6">
                    {keyword("text_detected_title")}
                  </Typography>
                  <ImageGrid
                    images={keyframesFeaturesData.texts}
                    alt={"extracted img with text"}
                  />
                </Stack>
              </Box>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
};
export default memo(Keyframes);
