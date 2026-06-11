import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import GaugeChartResult from "@/components/Shared/GaugeChartResults/GaugeChartResult";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { ROLES } from "@/constants/roles";
import ErrorBoundaryFallback from "@Shared/ErrorBoundaryFallback/ErrorBoundaryFallback";
import { JsonBlock } from "@Shared/JsonBlock";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { LineChart } from "@mui/x-charts/LineChart";
import _ from "lodash";

import { usePoiSync } from "../Hooks/usePoiSync";
import {
  computeAreaUnderCurve,
  computeGlobalScorePerTrack,
  computePercentagePointsAboveThreshold,
  drawBoundingBox,
} from "../poiUtils";

/**
 * React component that displays the results of POI forensics feature
 * @param {results, handleClose} props
 * @returns
 */
const PoiForensicsResults = (props) => {
  const classes = useMyStyles();

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const role = useSelector((state) => state.userSession.user.roles);

  const keyword = i18nLoadNamespace("components/NavItems/tools/PoiForensics");

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const results = props.result;

  const scores = results?.poi_forensics_report?.scores_per_time;
  const times = results?.poi_forensics_report?.time_vector;

  const overallScore = results?.poi_forensics_report?.overall_score?.toFixed(3);
  const resultsPerTrack = results?.poi_forensics_report?.results_per_track;

  const globalScorePerTrack = useMemo(() => {
    if (_.isEmpty(resultsPerTrack)) return [];
    return computeGlobalScorePerTrack(resultsPerTrack);
  }, [resultsPerTrack]);

  const percentageScoresAboveThreshold = useMemo(() => {
    if (_.isEmpty(scores)) return 0;
    return computePercentagePointsAboveThreshold(scores);
  }, [scores]);

  const areaUnderCurve = useMemo(() => {
    if (_.isEmpty(scores) || _.isEmpty(times)) return 0;
    return computeAreaUnderCurve(scores, times).totalArea;
  }, [scores, times]);

  const areaAboveTreshold = useMemo(() => {
    if (_.isEmpty(scores) || _.isEmpty(times)) return 0;
    return computeAreaUnderCurve(scores, times).areaAboveTreshold;
  }, [scores, times]);

  const areaBelowTreshold = useMemo(() => {
    if (_.isEmpty(scores) || _.isEmpty(times)) return 0;
    return computeAreaUnderCurve(scores, times).areaBelowTreshold;
  }, [scores, times]);

  const percentageFake = useMemo(() => {
    if (_.isEmpty(scores) || _.isEmpty(times)) return 0;
    return computeAreaUnderCurve(scores, times).percentageFake;
  }, [scores, times]);

  const DETECTION_THRESHOLDS = {
    THRESHOLD_1: 50,
    THRESHOLD_2: 70,
    THRESHOLD_3: 90,
  };

  const [selectedIndex, setSelectedIndex] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // this is meant to prevent JS error in the console for the first render
  // we dont build teh graph if the axis data are not fullfilled
  const hasData = !_.isEmpty(scores) && !_.isEmpty(times);

  const handleClose = () => {
    props.handleClose();
  };

  const handleChartClick = (event, d) => {
    if (d && d.dataIndex !== undefined) {
      const index = d.dataIndex;
      setSelectedIndex(index);

      const timestamp = results.poi_forensics_report.time_vector[index];

      if (videoRef?.current) {
        videoRef.current.currentTime = timestamp;
      }
    }
  };

  // this personalized Hook is in charge of syncing the canvas with the video so we can have a box around the face
  // when its detected
  usePoiSync(videoRef, canvasRef, results, setSelectedIndex);

  return (
    <>
      <Card
        variant="outlined"
        sx={{ width: "100%" }}
        data-testid="poiforensic-results"
      >
        <CardHeader
          title={keyword("poi_forensics_result_title")}
          action={
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ p: 1 }}
              data-testid="poiforensic-close"
            >
              <CloseIcon />
            </IconButton>
          }
        />
        {hasData ? (
          <>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Stack direction="column" spacing={4} sx={{ width: "100%" }}>
                  <Grid
                    size={{ xs: 6 }}
                    container
                    direction="column"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "fit-content",
                          mx: "auto",
                          lineHeight: 0,
                        }}
                      >
                        <video
                          ref={videoRef}
                          crossOrigin="anonymous"
                          height="auto"
                          controls
                          key={results.poi_forensics_report.video_path}
                          style={{
                            borderRadius: "10px",
                            maxHeight: "50vh",
                            width: "auto",
                            maxWidth: "100%",
                            display: "block",
                            objectFit: "contain",
                            margin: "0 auto",
                          }}
                          controlsList="nofullscreen nodownload"
                          disablePictureInPicture={true}
                          data-testid="poiforensic-video"
                        >
                          <source
                            src={results.poi_forensics_report.video_path}
                            type="video/mp4"
                          />
                        </video>
                        <canvas
                          ref={canvasRef}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            borderRadius: "10px",
                          }}
                        />
                      </Box>
                    </ErrorBoundary>
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                      <Box
                        sx={{
                          m: 2,
                        }}
                      >
                        <LineChart
                          xAxis={[
                            {
                              data: times,
                              min: 0,
                            },
                          ]}
                          yAxis={[
                            {
                              min: 0,
                            },
                          ]}
                          series={[
                            {
                              data: scores,
                            },
                          ]}
                          height={300}
                          grid={{ vertical: true, horizontal: true }}
                          onAxisClick={handleChartClick}
                          data-testid="poiforensic-chart"
                        >
                          <ChartsReferenceLine
                            y={1}
                            label={keyword("poi_forensics_result_treshold")}
                            lineStyle={{
                              stroke: "red",
                              strokeDasharray: "3 3",
                            }}
                          />
                        </LineChart>
                        <Typography>
                          {keyword("poi_forensics_graph_title")}
                        </Typography>
                      </Box>
                    </ErrorBoundary>
                    <Box
                      sx={{
                        m: 2,
                      }}
                    >
                      <Table
                        className={classes.table}
                        size="small"
                        sx={{
                          maxWidth: 800,
                          width: "100%",
                        }}
                        data-testid="poiforensic-table"
                      >
                        <TableBody>
                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ fontWeight: "bold" }}
                            >
                              {keyword("poi_forensics_overall_score")}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {overallScore}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ fontWeight: "bold" }}
                            >
                              {keyword("poi_forensics_auc")}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {areaUnderCurve}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ fontWeight: "bold" }}
                            >
                              {keyword("poi_forensics_area_above")}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {areaAboveTreshold}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ fontWeight: "bold" }}
                            >
                              {keyword("poi_forensics_area_below")}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {areaBelowTreshold}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ fontWeight: "bold" }}
                            >
                              {keyword("poi_forensics_percentage")}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {percentageFake}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              style={{ fontWeight: "bold" }}
                            >
                              Pourcentage de points au dessus du seuil
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{ fontWeight: "bold" }}
                            >
                              {percentageScoresAboveThreshold}%
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell colSpan={2} style={{ padding: 0 }} />
                          </TableRow>
                          {globalScorePerTrack.map((track) => {
                            return (
                              <TableRow key={track.trackID}>
                                <TableCell component="th" scope="row">
                                  Track {track.trackID}
                                </TableCell>
                                <TableCell align="right">
                                  {track.globalScore}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Box>
                  </Grid>
                </Stack>
                <Stack direction="column" spacing={4} sx={{ width: "100%" }}>
                  <Grid
                    size={{ xs: 6 }}
                    container
                    direction="column"
                    sx={{
                      width: "100%",
                    }}
                    data-testid="poiforensic-gauge"
                  >
                    <GaugeChartResult
                      keyword={keyword}
                      scores={[
                        {
                          methodName: "poiForensics",
                          predictionScore: percentageFake,
                        },
                      ]}
                      methodNames={{
                        poiForensics: {
                          name: keyword("poi_forensics_videoreport_name"),
                          description: keyword(
                            "poi_forensics_videoreport_description",
                          ),
                        },
                      }}
                      detectionThresholds={DETECTION_THRESHOLDS}
                      resultsHaveErrors={false}
                      sanitizeDetectionPercentage={(n) => Math.round(n)}
                      gaugeExplanation={{
                        keywords: [
                          "gauge_scale_modal_explanation_rating_1",
                          "gauge_scale_modal_explanation_rating_2",
                          "gauge_scale_modal_explanation_rating_3",
                          "gauge_scale_modal_explanation_rating_4",
                        ],
                        colors: ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"],
                      }}
                      toolName={"PoiForensics"}
                      detectionType={"video"}
                    />
                  </Grid>
                </Stack>
              </Stack>
            </CardContent>
            <CardContent>
              {role.includes(ROLES.EXTRA_FEATURE) && results && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <JsonBlock jsonString={JSON.stringify(results, null, 2)} />
                </Box>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent>
            <Alert severity="error">
              {results?.poi_forensics_report?.message}
            </Alert>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default PoiForensicsResults;
