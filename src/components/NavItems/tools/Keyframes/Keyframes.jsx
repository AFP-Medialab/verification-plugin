import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import LinkIcon from "@mui/icons-material/Link";
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
  useKeyframeWrapper,
  useProcessKeyframes,
} from "./Hooks/useKeyframeWrapper";
import { useVideoSimilarity } from "./Hooks/useVideoSimilarity";
import LocalFile from "./LocalFile/LocalFile";
import KeyFramesResults from "./Results/KeyFramesResults";

const Keyframes = () => {
  const { url } = useParams();

  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const resultUrl = useSelector((state) => state.keyframes.url);
  const resultData = useSelector((state) => state.keyframes.result);
  const isLoadingSimilarity = useSelector(
    (state) => state.keyframes.similarityLoading,
  );

  const role = useSelector((state) => state.userSession.user.roles);

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

  const submitUrl = async () => {
    //setSubmittedUrl(input);
    try {
      await executeProcess(input, role);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!url) return;

    const uri = decodeURIComponent(url);
    setInput(uri);
    submitUrl();
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

  const [tabSelected, setTabSelected] = useState("url");

  const handleTabSelectedChange = (event, newValue) => {
    setTabSelected(newValue);
  };

  const {
    executeProcess,
    isPending,
    status,
    data,
    error,
    featureData,
    isFeatureDataPending,
    featureDataError,
    featureStatus,
  } = useProcessKeyframes();

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(featureData);
  }, [featureData]);

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

        {status && isPending && (
          <Alert icon={<CircularProgress size={20} />} severity="info">
            {status}
          </Alert>
        )}

        {isPending && (
          <Card variant="outlined">
            <Stack direction="column" spacing={4} p={4}>
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

        {error && <Alert severity="error">{error.message}</Alert>}

        {data && tabSelected === "url" && <KeyFramesResults result={data} />}

        {featureStatus && isFeatureDataPending && (
          <Alert icon={<CircularProgress size={20} />} severity="info">
            {featureStatus}
          </Alert>
        )}

        {isFeatureDataPending && (
          <Card variant="outlined">
            <Stack direction="column" spacing={4} p={4}>
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

        {featureData && (
          <>
            <Card variant="outlined">
              <Typography>{"Faces"}</Typography>
              <Grid2 container direction="row" spacing={2} p={4}>
                {featureData.faces.map((item, i) => (
                  <Grid2 key={i} size={{ md: 3, lg: 1 }}>
                    <img
                      src={item.representative.imageUrl}
                      style={{ width: "-webkit-fill-available" }}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Card>
            <Card variant="outlined">
              <Typography>{"Texts"}</Typography>
              <Grid2 container direction="row" spacing={2} p={4}>
                {featureData.texts.map((item, i) => (
                  <Grid2 key={i} size={{ md: 3, lg: 1 }}>
                    <img
                      src={item.representative.imageUrl}
                      style={{ width: "-webkit-fill-available" }}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
};
export default memo(Keyframes);
