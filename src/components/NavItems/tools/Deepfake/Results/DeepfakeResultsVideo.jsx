import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { useTrackEvent } from "Hooks/useAnalytics";
import GaugeChartResult from "components/Shared/GaugeChartResults/GaugeChartResult";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const DeepfakeResultsVideo = (props) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Deepfake");

  class DeepfakeResult {
    constructor(methodName, predictionScore) {
      this.methodName = methodName;
      this.predictionScore = predictionScore;
    }
  }

  const DeepfakeImageDetectionMethodNames = Object.freeze({
    deepfakeVideoReport: {
      name: keyword("deepfake_video_videoreport_name"),
      description: keyword("deepfake_video_videoreport_description"),
    },
    ftcn: {
      name: keyword("deepfake_video_ftcn_name"),
      description: keyword("deepfake_video_ftcn_description"),
    },

    faceReenact: {
      name: keyword("deepfake_video_facereenact_name"),
      description: keyword("deepfake_video_facereenact_description"),
    },
  });

  const DETECTION_THRESHOLDS = {
    THRESHOLD_1: 50,
    THRESHOLD_2: 70,
    THRESHOLD_3: 90,
  };

  // const gaugeChartRef = useRef(null);

  const keywords = [
    "gauge_scale_modal_explanation_rating_1",
    "gauge_scale_modal_explanation_rating_2",
    "gauge_scale_modal_explanation_rating_3",
    "gauge_scale_modal_explanation_rating_4",
  ];
  const colors = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

  const results = props.result;
  const url = props.url;

  const [shotSelectedKey, setShotSelectedKey] = useState(-1);
  const [shotSelectedValue, setShotSelectedValue] = useState(null);

  const [deepfakeScores, setDeepfakeScores] = useState([]);

  const videoClip = React.useRef(null);

  function clickShot(value, key) {
    setShotSelectedKey(-1);
    setShotSelectedKey(key);
    setShotSelectedValue(value);
    if (videoClip.current !== null) {
      videoClip.current.load();
    }
  }

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  useTrackEvent(
    "submission",
    "deepfake_video",
    "deepfake video processing",
    url,
    client_id,
    url,
    uid,
  );

  useEffect(() => {
    const prediction = results.deepfake_video_report.prediction;
    let shot = -1;

    if (
      !results ||
      !results.deepfake_video_report ||
      !results.deepfake_video_report.results
    ) {
      return;
    }

    for (
      let i = 0;
      i < results.deepfake_video_report.results.length && shot === -1;
      i++
    ) {
      if (results.deepfake_video_report.results[i].prediction === prediction) {
        shot = i;
      }
    }

    if (shot !== -1) {
      clickShot(results.deepfake_video_report.results[shot], shot);
    }
  }, []);

  useEffect(() => {
    if (!results) return;

    // reset clip selection state
    setShotSelectedValue(null);
    setShotSelectedKey(-1);

    let res = [];

    if (
      results.deepfake_video_report &&
      results.deepfake_video_report.prediction
    ) {
      res.push(
        new DeepfakeResult(
          Object.keys(DeepfakeImageDetectionMethodNames)[0],
          results.deepfake_video_report.prediction * 100,
        ),
      );
    }

    if (results.ftcn_report && results.ftcn_report.prediction) {
      res.push(
        new DeepfakeResult(
          Object.keys(DeepfakeImageDetectionMethodNames)[1],
          results.ftcn_report.prediction * 100,
        ),
      );
    }

    if (results.face_reenact_report && results.face_reenact_report.prediction) {
      res.push(
        new DeepfakeResult(
          Object.keys(DeepfakeImageDetectionMethodNames)[2],
          results.face_reenact_report.prediction * 100,
        ),
      );
    }

    res = res.sort((a, b) => b.predictionScore - a.predictionScore);

    setDeepfakeScores(res);
  }, [results]);

  //console.log("Rectangles: ", rectangles);

  //Help
  //============================================================================================
  const [anchorHelp, setAnchorHelp] = React.useState(null);
  const openHelp = Boolean(anchorHelp);
  const help = openHelp ? "simple-popover" : undefined;

  function closeHelp() {
    setAnchorHelp(null);
  }

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardHeader
        style={{ borderRadius: "4px 4px 0px 0px" }}
        title={keyword("deepfake_video_title")}
        action={
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Stack direction="column" spacing={4}>
          <Grid2
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="flex-start"
          >
            <Grid2 size={{ xs: 6 }} container direction="column" spacing={2}>
              <Grid2 width="100%" size={{ xs: 6 }} container direction="column">
                <video
                  width="100%"
                  height="auto"
                  controls
                  key={results.deepfake_video_report.video_path}
                  style={{
                    borderRadius: "10px",
                    boxShadow:
                      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                    maxHeight: "50vh",
                  }}
                >
                  <source
                    src={results.deepfake_video_report.video_path + "#t=2,4"}
                    type="video/mp4"
                  />
                  {keyword("deepfake_support")}
                </video>
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <Stack direction="column" spacing={4}>
                {deepfakeScores && deepfakeScores.length === 0 && (
                  <Typography variant="h5" sx={{ color: "red" }}>
                    {keyword("deepfake_no_face_detection")}
                  </Typography>
                )}
                {deepfakeScores && deepfakeScores.length !== 0 && (
                  <GaugeChartResult
                    keyword={keyword}
                    scores={deepfakeScores}
                    methodNames={DeepfakeImageDetectionMethodNames}
                    detectionThresholds={DETECTION_THRESHOLDS}
                    resultsHaveErrors={false}
                    sanitizeDetectionPercentage={(n) => Math.round(n)}
                    gaugeExplanation={{ keywords: keywords, colors: colors }}
                    toolName={"Deepfake"}
                    detectionType={"video"}
                  />
                )}
              </Stack>
            </Grid2>
          </Grid2>

          <Divider />

          <Grid2
            container
            direction="row"
            sx={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
            spacing={2}
          >
            <Grid2 size={7}>
              {!!results.deepfake_video_report.results && (
                <Box>
                  <Typography
                    variant="body1"
                    style={{
                      color: "#00926c",
                      fontSize: "24px",
                      fontWeight: "500",
                    }}
                  >
                    {keyword("deepfake_clips")}
                  </Typography>
                  <Box m={1} />

                  <Grid2 container spacing={3} width="100%">
                    {results.deepfake_video_report.results.map(
                      (valueShot, keyShot) => {
                        const shotStart = valueShot.shot_start;
                        const shotEnd = valueShot.shot_end;

                        const startMin = (
                          "0" + Math.floor(shotStart / 60)
                        ).slice(-2);
                        const startSec = ("0" + (shotStart % 60)).slice(-2);
                        const endMin = ("0" + Math.floor(shotEnd / 60)).slice(
                          -2,
                        );
                        const endSec = ("0" + (shotEnd % 60)).slice(-2);

                        return (
                          <Grid2 size={{ md: 3, sm: 12 }} key={keyShot}>
                            {keyShot === shotSelectedKey ? (
                              <Box
                                onClick={() => clickShot(valueShot, keyShot)}
                                style={{
                                  backgroundColor: "#00926c",
                                  borderRadius: "10px",
                                  overflow: "hidden",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  boxShadow:
                                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                }}
                              >
                                <img
                                  alt="shot"
                                  key={keyShot}
                                  src={valueShot.shot_image}
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "15vh",
                                  }}
                                />
                                <Box mt={1} />
                                <Typography
                                  variant="body1"
                                  style={{ fontSize: "14px", color: "#ffffff" }}
                                >
                                  {startMin}:{startSec}
                                  {" - "}
                                  {endMin}:{endSec}
                                </Typography>
                                <Box mt={1} />
                              </Box>
                            ) : (
                              <Box
                                onClick={() => clickShot(valueShot, keyShot)}
                                style={{
                                  backgroundColor: "#ffffff",
                                  borderRadius: "10px",
                                  overflow: "hidden",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  boxShadow:
                                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                }}
                              >
                                <img
                                  alt="shot"
                                  key={keyShot}
                                  src={valueShot.shot_image}
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "15vh",
                                  }}
                                />
                                <Box mt={1} />
                                <Typography
                                  variant="body1"
                                  style={{ fontSize: "14px" }}
                                >
                                  {startMin}:{startSec}
                                  {" - "}
                                  {endMin}:{endSec}
                                </Typography>
                                <Box mt={1} />
                              </Box>
                            )}
                          </Grid2>
                        );
                      },
                    )}
                  </Grid2>
                </Box>
              )}
            </Grid2>
            <Grid2 size={5}>
              {results &&
                results.deepfake_video_report &&
                results.deepfake_video_report.results && (
                  <Card
                    variant="outlined"
                    style={{ overflow: "visible" }}
                    mb={3}
                  >
                    <CardHeader
                      style={{ borderRadius: "4px 4px 0px 0px" }}
                      title={
                        <Grid2
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <span>{keyword("deepfake_results")}</span>

                          <Popover
                            id={help}
                            open={openHelp}
                            anchorEl={anchorHelp}
                            onClose={closeHelp}
                            PaperProps={{
                              style: {
                                width: "300px",
                                fontSize: 14,
                              },
                            }}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                          >
                            <Box p={2}>
                              <Grid2
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="stretch"
                              >
                                <Typography variant="h6" gutterBottom>
                                  {keyword("deepfake_title_what")}
                                </Typography>

                                <CloseIcon onClick={closeHelp} />
                              </Grid2>
                              <Box m={1} />
                              <Typography variant="body2">
                                {keyword("deepfake_filters_explanation_video")}
                              </Typography>
                            </Box>
                          </Popover>
                        </Grid2>
                      }
                    />
                    <div>
                      <Box p={2}>
                        {shotSelectedValue === null ? (
                          <Grid2
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "350px" }}
                          >
                            <Box p={2}>
                              <Typography
                                variant="h6"
                                style={{ color: "#C9C9C9" }}
                                align="center"
                              >
                                {keyword("deepfake_select")}
                              </Typography>
                            </Box>
                          </Grid2>
                        ) : (
                          <Grid2 container direction="row" spacing={2}>
                            <Grid2
                              container
                              direction="column"
                              size={{ xs: 6 }}
                            >
                              <Typography>
                                {keyword("deepfake_clip")}
                              </Typography>
                              <video
                                ref={videoClip}
                                height="auto"
                                controls
                                key={
                                  results.deepfake_video_report.video_path +
                                  "#t=" +
                                  shotSelectedValue.shot_start +
                                  "," +
                                  shotSelectedValue.shot_end
                                }
                                style={{
                                  borderRadius: "10px",
                                  boxShadow:
                                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                                  maxHeight: "30vh",
                                  maxWidth: "100%",
                                }}
                              >
                                <source
                                  src={
                                    results.deepfake_video_report.video_path +
                                    "#t=" +
                                    shotSelectedValue.shot_start +
                                    "," +
                                    shotSelectedValue.shot_end
                                  }
                                  type="video/mp4"
                                />
                                {keyword("deepfake_support")}
                              </video>
                            </Grid2>

                            <Grid2
                              container
                              direction="column"
                              size={{ xs: 6 }}
                            >
                              <Typography>
                                {keyword("deepfake_faces")}
                              </Typography>
                              <Grid2 container direction="row" spacing={2}>
                                {shotSelectedValue.face_image_paths.map(
                                  (valueFace, keyFace) => {
                                    return (
                                      <Grid2
                                        size={{ xs: 12 }}
                                        key={keyFace}
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "flex-start",
                                        }}
                                      >
                                        <img
                                          alt="face"
                                          key={keyFace}
                                          src={valueFace}
                                          style={{
                                            width: "100%",
                                            height: "auto",
                                          }}
                                        />
                                        <Typography>
                                          {Math.round(
                                            shotSelectedValue.face_predictions[
                                              keyFace
                                            ] * 100,
                                          )}
                                          %
                                        </Typography>
                                        <Typography
                                          variant="h6"
                                          style={{ color: "#989898" }}
                                        >
                                          {keyword("deepfake_name")}
                                        </Typography>
                                      </Grid2>
                                    );
                                  },
                                )}
                              </Grid2>
                            </Grid2>
                          </Grid2>
                        )}
                      </Box>
                    </div>
                  </Card>
                )}
            </Grid2>
          </Grid2>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default DeepfakeResultsVideo;
