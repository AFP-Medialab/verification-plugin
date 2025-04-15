import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Download } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import { exportReactElementAsJpg } from "@Shared/Utils/htmlUtils";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTrackEvent } from "Hooks/useAnalytics";
import GaugeChartResult from "components/Shared/GaugeChartResults/GaugeChartResult";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { ROLES } from "../../../../../constants/roles";

const DeepfakeResultsVideo = (props) => {
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

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

  const deepfakeChartRef = useRef(null);

  const keywords = [
    "gauge_scale_modal_explanation_rating_1",
    "gauge_scale_modal_explanation_rating_2",
    "gauge_scale_modal_explanation_rating_3",
    "gauge_scale_modal_explanation_rating_4",
  ];
  const colors = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

  const results = props.result;
  const url = props.url;

  const [xAxisData, setXAxisData] = React.useState([]);
  const [yAxisData, setYAxisData] = React.useState([]);

  const role = useSelector((state) => state.userSession.user.roles);

  /**
   * Alternate between v1 and v2 based on user role
   * @type {string}
   */
  const faceswapAlgorithm = role.includes(ROLES.EVALUATION)
    ? "faceswap_fsfm_report"
    : "deepfake_video_report";

  useEffect(() => {
    if (
      props.result &&
      props.result[faceswapAlgorithm] &&
      props.result[faceswapAlgorithm].results &&
      props.result[faceswapAlgorithm].results.length > 0
    ) {
      for (const shotPrediction of props.result[faceswapAlgorithm].results) {
        // This needs an undefined check because the value can be 0
        if (
          shotPrediction.prediction !== undefined &&
          typeof shotPrediction.prediction === "number" &&
          shotPrediction.shot_start !== undefined &&
          typeof shotPrediction.shot_start === "number" &&
          shotPrediction.shot_end !== undefined &&
          typeof shotPrediction.shot_end === "number"
        ) {
          // Add X-Axis data twice for start to end value
          setYAxisData((prev) => [
            ...prev,
            shotPrediction.prediction * 100,
            shotPrediction.prediction * 100,
          ]);
          setXAxisData((prev) => [
            ...prev,
            shotPrediction.shot_start,
            shotPrediction.shot_end,
          ]);
        }
      }
    }
  }, [props.result]);

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
    const prediction = results[faceswapAlgorithm].prediction;
    let shot = -1;

    if (
      !results ||
      !results[faceswapAlgorithm] ||
      !results[faceswapAlgorithm].results
    ) {
      return;
    }

    for (
      let i = 0;
      i < results[faceswapAlgorithm].results.length && shot === -1;
      i++
    ) {
      if (results[faceswapAlgorithm].results[i].prediction === prediction) {
        shot = i;
      }
    }

    if (shot !== -1) {
      clickShot(results[faceswapAlgorithm].results[shot], shot);
    }
  }, []);

  useEffect(() => {
    if (!results) return;

    // reset clip selection state
    setShotSelectedValue(null);
    setShotSelectedKey(-1);

    let res = [];

    if (results[faceswapAlgorithm] && results[faceswapAlgorithm].prediction) {
      res.push(
        new DeepfakeResult(
          Object.keys(DeepfakeImageDetectionMethodNames)[0],
          results[faceswapAlgorithm].prediction * 100,
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
        title={keyword("deepfake_video_title")}
        action={
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Stack direction="column" spacing={4}>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <Grid size={{ xs: 6 }} container direction="column" spacing={2}>
              <Grid
                size={{ xs: 6 }}
                container
                direction="column"
                sx={{
                  width: "100%",
                }}
              >
                <Stack direction="column" spacing={4}>
                  <video
                    width="100%"
                    height="auto"
                    controls
                    key={results[faceswapAlgorithm].video_path}
                    style={{
                      borderRadius: "10px",
                      maxHeight: "50vh",
                    }}
                  >
                    <source
                      src={results[faceswapAlgorithm].video_path + "#t=2,4"}
                      type="video/mp4"
                    />
                    {keyword("deepfake_support")}
                  </video>
                  <Stack
                    direction="column"
                    ref={deepfakeChartRef}
                    sx={{
                      justifyContent: "center",
                    }}
                  >
                    <LineChart
                      xAxis={[
                        {
                          data: xAxisData,
                        },
                      ]}
                      series={[
                        {
                          data: yAxisData,
                        },
                      ]}
                      height={300}
                      grid={{ vertical: true, horizontal: true }}
                    />
                    <Typography>
                      {keyword("deepfake_video_videoreport_name")}
                    </Typography>
                  </Stack>

                  {userAuthenticated && (
                    <Box>
                      <Tooltip
                        title={keyword("deepfake_video_download_chart_button")}
                      >
                        <IconButton
                          color="primary"
                          aria-label="download chart"
                          onClick={async () =>
                            await exportReactElementAsJpg(
                              deepfakeChartRef,
                              "deepfake_video_detection_chart_download_button_label",
                            )
                          }
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>
            <Grid size={{ xs: 6 }}>
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
            </Grid>
          </Grid>

          <Divider />

          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
            spacing={2}
          >
            <Grid size={7}>
              {!!results[faceswapAlgorithm].results && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#00926c",
                    }}
                  >
                    {keyword("deepfake_clips")}
                  </Typography>
                  <Box
                    sx={{
                      m: 1,
                    }}
                  />

                  <Grid
                    container
                    spacing={3}
                    sx={{
                      width: "100%",
                    }}
                  >
                    {results[faceswapAlgorithm].results.map(
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
                          <Grid size={{ md: 3, sm: 12 }} key={keyShot}>
                            <Card
                              variant="outlined"
                              onClick={() => clickShot(valueShot, keyShot)}
                              sx={{
                                backgroundColor:
                                  keyShot === shotSelectedKey
                                    ? "#00926c"
                                    : "var(--mui-palette-background-paper)",
                              }}
                            >
                              <CardActionArea>
                                <CardContent>
                                  <Stack
                                    direction="column"
                                    spacing={1}
                                    sx={{
                                      alignItems: "center",
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
                                    <Typography variant="caption">
                                      {startMin}:{startSec}
                                      {" - "}
                                      {endMin}:{endSec}
                                    </Typography>
                                  </Stack>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        );
                      },
                    )}
                  </Grid>
                </Box>
              )}
            </Grid>
            <Grid size={5}>
              {results &&
                results[faceswapAlgorithm] &&
                results[faceswapAlgorithm].results && (
                  <Card
                    variant="outlined"
                    style={{ overflow: "visible" }}
                    mb={3}
                  >
                    <CardHeader
                      style={{ borderRadius: "4px 4px 0px 0px" }}
                      title={
                        <Grid
                          container
                          direction="row"
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>{keyword("deepfake_results")}</span>

                          <Popover
                            id={help}
                            open={openHelp}
                            anchorEl={anchorHelp}
                            onClose={closeHelp}
                            slotProps={{
                              paper: {
                                style: {
                                  width: "300px",
                                  fontSize: 14,
                                },
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
                            <Box
                              sx={{
                                p: 2,
                              }}
                            >
                              <Grid
                                container
                                direction="row"
                                sx={{
                                  justifyContent: "space-between",
                                  alignItems: "stretch",
                                }}
                              >
                                <Typography variant="h6" gutterBottom>
                                  {keyword("deepfake_title_what")}
                                </Typography>

                                <CloseIcon onClick={closeHelp} />
                              </Grid>
                              <Box
                                sx={{
                                  m: 1,
                                }}
                              />
                              <Typography variant="body2">
                                {keyword("deepfake_filters_explanation_video")}
                              </Typography>
                            </Box>
                          </Popover>
                        </Grid>
                      }
                    />
                    <Box
                      sx={{
                        p: 2,
                      }}
                    >
                      {shotSelectedValue === null ? (
                        <Grid
                          container
                          direction="column"
                          style={{ height: "350px" }}
                          sx={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              p: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              style={{ color: "#C9C9C9" }}
                              align="center"
                            >
                              {keyword("deepfake_select")}
                            </Typography>
                          </Box>
                        </Grid>
                      ) : (
                        <Grid container direction="row" spacing={2}>
                          <Grid
                            container
                            direction="column"
                            size={{ md: 6, xs: 12 }}
                          >
                            <Typography>{keyword("deepfake_clip")}</Typography>
                            <video
                              ref={videoClip}
                              height="auto"
                              controls
                              key={
                                results[faceswapAlgorithm].video_path +
                                "#t=" +
                                shotSelectedValue.shot_start +
                                "," +
                                shotSelectedValue.shot_end
                              }
                              style={{
                                borderRadius: "10px",
                                maxHeight: "30vh",
                                maxWidth: "100%",
                              }}
                            >
                              <source
                                src={
                                  results[faceswapAlgorithm].video_path +
                                  "#t=" +
                                  shotSelectedValue.shot_start +
                                  "," +
                                  shotSelectedValue.shot_end
                                }
                                type="video/mp4"
                              />
                              {keyword("deepfake_support")}
                            </video>
                          </Grid>
                          <Grid
                            container
                            direction="column"
                            size={{ md: 6, xs: 12 }}
                          >
                            <Typography>{keyword("deepfake_faces")}</Typography>
                            <Grid container direction="column" spacing={2}>
                              {shotSelectedValue.face_image_paths.map(
                                (valueFace, keyFace) => {
                                  return (
                                    <Grid size={12} key={keyFace}>
                                      <Stack direction="column" spacing={2}>
                                        <img
                                          alt="face"
                                          key={keyFace}
                                          src={valueFace}
                                          style={{
                                            width: "100%",
                                            height: "auto",
                                            maxWidth: "120px",
                                          }}
                                        />
                                        <Typography>
                                          {Math.round(
                                            shotSelectedValue.face_predictions[
                                              keyFace
                                            ] * 100,
                                          )}
                                          % {keyword("deepfake_name")}
                                        </Typography>
                                      </Stack>
                                    </Grid>
                                  );
                                },
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  </Card>
                )}
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default DeepfakeResultsVideo;
