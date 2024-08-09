import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { Close, Download, ExpandMore } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useSelector } from "react-redux";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import CustomAlertScore from "../../../Shared/CustomAlertScore";
import GaugeChart from "react-gauge-chart";
import Tooltip from "@mui/material/Tooltip";
import { exportReactElementAsJpg } from "../../../Shared/Utils/htmlUtils";
import NddDatagrid from "./NddDatagrid";
import {
  DETECTION_THRESHOLDS,
  getSyntheticImageDetectionAlgorithmFromApiName,
  gigaGanWebpR50Grip,
  ldmWebpR50Grip,
  proGanWebpR50Grip,
  SyntheticImageDetectionAlgorithm,
  syntheticImageDetectionAlgorithms,
} from "./SyntheticImageDetectionAlgorithms";
import GaugeChartModalExplanation from "../../../Shared/GaugeChartResults/GaugeChartModalExplanation";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";

/**
 * Returns the alert color code for the given percentage n
 * @param n {number}
 * @returns {"error" | "warning" | "success"}
 */
export const getAlertColor = (n) => {
  if (n >= DETECTION_THRESHOLDS.THRESHOLD_3) {
    return "error";
  } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_2) {
    return "warning";
  } else {
    return "success";
  }
};

export const getAlertLabel = (n, keyword) => {
  if (n >= DETECTION_THRESHOLDS.THRESHOLD_3) {
    return keyword("synthetic_image_detection_alert_label_4");
  } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_2) {
    return keyword("synthetic_image_detection_alert_label_3");
  } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_1) {
    return keyword("synthetic_image_detection_alert_label_2");
  } else {
    return keyword("synthetic_image_detection_alert_label_1");
  }
};

export const getPercentageColorCode = (n) => {
  if (n >= DETECTION_THRESHOLDS.THRESHOLD_3) {
    return "#FF0000";
  } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_2) {
    return "#FFAA00";
  } else {
    return "green";
  }
};

class NddResult {
  /**
   *
   * @param id {number}
   * @param image {string}
   * @param archiveUrl {string}
   * @param imageUrls {string}
   * @param detectionResults {SyntheticImageDetectionAlgorithmResult[]}
   */
  constructor(id, image, archiveUrl, imageUrls, detectionResults) {
    this.id = id;
    this.image = image;
    this.archiveUrl = archiveUrl;
    this.imageUrls = imageUrls;
    this.detectionResults = detectionResults;
  }
}

/**
 *
 * @param results
 * @param url
 * @param handleClose
 * @param nd
 * @param imageType {Blob.type}
 * @returns {Element}
 * @constructor
 */
const SyntheticImageDetectionResults = ({
  results,
  url,
  handleClose,
  nd,
  imageType,
}) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  const role = useSelector((state) => state.userSession.user.roles);

  class SyntheticImageDetectionAlgorithmResult extends SyntheticImageDetectionAlgorithm {
    /**
     *
     * @param syntheticImageDetectionAlgorithm {SyntheticImageDetectionAlgorithm}
     * @param predictionScore {number}
     * @param isError {boolean}
     */
    constructor(syntheticImageDetectionAlgorithm, predictionScore, isError) {
      super(
        syntheticImageDetectionAlgorithm.apiServiceName,
        syntheticImageDetectionAlgorithm.name,
        syntheticImageDetectionAlgorithm.description,
        syntheticImageDetectionAlgorithm.roleNeeded,
      );
      (this.predictionScore = predictionScore), (this.isError = isError);
    }
  }

  const imgElement = React.useRef(null);

  const imgContainerRef = useRef(null);

  const [syntheticImageScores, setSyntheticImageScores] = useState([]);

  const [maxScore, setMaxScore] = useState(0);

  const [resultsHaveErrors, setResultsHaveErrors] = useState(false);

  const gaugeChartRef = useRef(null);

  useEffect(() => {
    setResultsHaveErrors(false);
    let res = [];

    for (const algorithm of syntheticImageDetectionAlgorithms) {
      if (
        !role.includes(algorithm.roleNeeded) &&
        algorithm.roleNeeded.length > 0
      ) {
        continue;
      }

      const algorithmReport = results[algorithm.apiServiceName + "_report"];

      if (algorithmReport) {
        // Display iff the user has the permissions to see the content

        console.log(imageType);

        if (
          imageType &&
          imageType === "image/webp" &&
          (algorithm.apiServiceName === ldmWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === proGanWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === gigaGanWebpR50Grip.apiServiceName)
        ) {
          res.push(
            new SyntheticImageDetectionAlgorithmResult(
              algorithm,
              !algorithmReport.prediction
                ? 0
                : algorithmReport.prediction * 100,
              algorithmReport.prediction === undefined,
            ),
          );
        } else if (
          imageType &&
          imageType !== "image/webp" &&
          (algorithm.apiServiceName === ldmWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === proGanWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === gigaGanWebpR50Grip.apiServiceName)
        ) {
          continue;
        } else {
          res.push(
            new SyntheticImageDetectionAlgorithmResult(
              algorithm,
              !algorithmReport.prediction
                ? 0
                : algorithmReport.prediction * 100,
              algorithmReport.prediction === undefined,
            ),
          );
        }
      }
    }

    res = res
      .filter((i) => i !== undefined)
      .sort((a, b) => b.predictionScore - a.predictionScore);

    const hasResultError = () => {
      for (const algorithm of res) {
        if (algorithm.isError) return true;
      }
      return false;
    };

    setResultsHaveErrors(hasResultError);
    setSyntheticImageScores(res);

    setMaxScore(
      sanitizeDetectionPercentage(
        Math.max(
          ...res.map(
            (syntheticImageScore) => syntheticImageScore.predictionScore,
          ),
        ),
      ),
    );
  }, [results, imageType]);

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  useTrackEvent(
    "submission",
    "synthetic_image_detection",
    "synthetic image processing",
    url,
    client_id,
    url,
    uid,
  );

  /**
   * Returns a percentage between 0 and 99 for display purposes. We exclude 0 and 100 values.
   * @param percentage {number}
   * @returns {number}
   */
  const sanitizeDetectionPercentage = (percentage) => {
    const floor = Math.floor(percentage);
    return floor === 0 ? 1 : floor;
  };
  const [detailsPanelMessage, setDetailsPanelMessage] = useState(
    "synthetic_image_detection_additional_results_hide",
  );
  const handleDetailsChange = () => {
    detailsPanelMessage === "synthetic_image_detection_additional_results_hide"
      ? setDetailsPanelMessage("synthetic_image_detection_additional_results")
      : setDetailsPanelMessage("synthetic_image_detection_additional_results");
  };

  const [nddDetailsPanelMessage, setNddDetailsPanelMessage] = useState(
    "synthetic_image_detection_ndd_additional_results_hide",
  );
  const handleNddDetailsChange = () => {
    nddDetailsPanelMessage ===
    "synthetic_image_detection_ndd_additional_results_hide"
      ? setNddDetailsPanelMessage(
          "synthetic_image_detection_ndd_additional_results",
        )
      : setNddDetailsPanelMessage(
          "synthetic_image_detection_ndd_additional_results_hide",
        );
  };

  const keywords = [
    "gauge_scale_modal_explanation_rating_1",
    "gauge_scale_modal_explanation_rating_2",
    "gauge_scale_modal_explanation_rating_3",
    "gauge_scale_modal_explanation_rating_4",
  ];
  const colors = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

  /**
   *
   * @param nddResults
   * @returns {NddResult[]}
   */
  const getNddRows = (nddResults) => {
    let rows = [];
    for (let i = 0; i < nddResults.length; i += 1) {
      const res = nddResults[i];
      let detectionResults = [];
      for (const detection of Object.keys(res.detections)) {
        const d = new SyntheticImageDetectionAlgorithmResult(
          getSyntheticImageDetectionAlgorithmFromApiName(detection),
          sanitizeDetectionPercentage(res.detections[detection] * 100),
          false,
        );

        // Display iff the user has the permissions to see the content
        if (d.roleNeeded && !role.includes(d.roleNeeded)) {
          continue;
        }

        console.log(imageType);

        if (
          imageType &&
          imageType === "image/webp" &&
          (d.apiServiceName === ldmWebpR50Grip.apiServiceName ||
            d.apiServiceName === proGanWebpR50Grip.apiServiceName ||
            d.apiServiceName === gigaGanWebpR50Grip.apiServiceName)
        ) {
          detectionResults.push(d);
        } else if (
          imageType &&
          imageType !== "image/webp" &&
          (d.apiServiceName === ldmWebpR50Grip.apiServiceName ||
            d.apiServiceName === proGanWebpR50Grip.apiServiceName ||
            d.apiServiceName === gigaGanWebpR50Grip.apiServiceName)
        ) {
          continue;
        } else {
          detectionResults.push(d);
        }
      }

      if (detectionResults.length === 0) {
        continue;
      }

      rows.push(
        new NddResult(
          i + 1,
          res.archive_url,
          res.archive_url,
          res.origin_urls,
          detectionResults,
        ),
      );
    }
    return rows;
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        style={{ borderRadius: "4px 4px 0px 0px" }}
        title={keyword("synthetic_image_detection_title")}
        action={
          <IconButton aria-label="close" onClick={handleClose}>
            <Close sx={{ color: "white" }} />
          </IconButton>
        }
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid
            item
            container
            direction="column"
            justifyContent="flex-start"
            sm={12}
            md={6}
            spacing={4}
          >
            <Grid
              item
              sx={{
                maxWidth: "100%",
              }}
            >
              <Box sx={{ width: "100%", height: "100%" }}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  ref={imgContainerRef}
                  p={4}
                  sx={{
                    maxWidth: "100%",
                  }}
                >
                  <img
                    src={url}
                    alt={"Displays the results of the deepfake topMenuItem"}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "60vh",
                      borderRadius: "10px",
                    }}
                    crossOrigin={"anonymous"}
                    ref={imgElement}
                  />
                  <List dense={true}>
                    <ListItem>
                      <ListItemText
                        primary={keyword(
                          "synthetic_image_detection_image_type",
                        )}
                        secondary={imageType}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid item sm={12} md={6}>
            {syntheticImageScores.length > 0 ? (
              <Stack
                direction="column"
                p={4}
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={4}
                width="100%"
                sx={{ boxSizing: "border-box" }}
                position="relative"
              >
                <Stack
                  direction={{ sm: "column", md: "row" }}
                  alignItems={{ sm: "start", md: "center" }}
                  justifyContent="center"
                  width="100%"
                >
                  <Box m={2}></Box>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    ref={gaugeChartRef}
                    p={2}
                  >
                    {maxScore > DETECTION_THRESHOLDS.THRESHOLD_2 && (
                      <Typography
                        variant="h5"
                        align="center"
                        alignSelf="center"
                        sx={{ color: "red" }}
                      >
                        {keyword(
                          "synthetic_image_detection_generic_detection_text",
                        )}
                      </Typography>
                    )}
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <GaugeChart
                        id={"gauge-chart"}
                        animate={false}
                        nrOfLevels={4}
                        textColor={"black"}
                        arcsLength={[
                          (100 - DETECTION_THRESHOLDS.THRESHOLD_1) / 100,
                          (DETECTION_THRESHOLDS.THRESHOLD_2 -
                            DETECTION_THRESHOLDS.THRESHOLD_1) /
                            100,
                          (DETECTION_THRESHOLDS.THRESHOLD_3 -
                            DETECTION_THRESHOLDS.THRESHOLD_2) /
                            100,
                          (100 - DETECTION_THRESHOLDS.THRESHOLD_3) / 100,
                        ]}
                        percent={syntheticImageScores ? maxScore / 100 : 0}
                        style={{
                          minWidth: "250px",
                          width: "50%",
                          maxWidth: "500px",
                        }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={10}
                      >
                        <Typography variant="subtitle2">
                          {keyword(
                            "synthetic_image_detection_gauge_no_detection",
                          )}
                        </Typography>
                        <Typography variant="subtitle2">
                          {keyword("synthetic_image_detection_gauge_detection")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Box alignSelf={{ sm: "flex-start", md: "flex-end" }}>
                    <Tooltip
                      title={keyword(
                        "synthetic_image_detection_download_gauge_button",
                      )}
                    >
                      <IconButton
                        color="primary"
                        aria-label="download chart"
                        onClick={async () =>
                          await exportReactElementAsJpg(
                            gaugeChartRef,
                            "gauge_chart",
                          )
                        }
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>

                <GaugeChartModalExplanation
                  keyword={keyword}
                  keywordsArr={keywords}
                  keywordLink={
                    "synthetic_image_detection_scale_explanation_link"
                  }
                  keywordModalTitle={
                    "synthetic_image_detection_scale_modal_explanation_title"
                  }
                  colors={colors}
                />

                <CustomAlertScore
                  score={syntheticImageScores ? maxScore : 0}
                  detectionType={undefined}
                  toolName={"SyntheticImageDetection"}
                  thresholds={DETECTION_THRESHOLDS}
                />

                {resultsHaveErrors && (
                  <Alert severity="error">
                    {keyword("synthetic_image_detection_algorithms_errors")}
                  </Alert>
                )}

                {nd && nd.similar_media && nd.similar_media.length > 0 && (
                  <Alert icon={false} severity="error">
                    <Typography variant="body1">
                      {keyword("synthetic_image_detection_ndd_info")}
                    </Typography>
                  </Alert>
                )}
              </Stack>
            ) : (
              <Stack
                direction="column"
                p={4}
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={4}
                width="100%"
                sx={{ boxSizing: "border-box" }}
              >
                <Alert severity="error">
                  {keyword("synthetic_image_detection_error_generic")}
                </Alert>
              </Stack>
            )}
          </Grid>
          <Grid item container xs={12}>
            <Grid item p={4}>
              <Box sx={{ width: "100%" }}>
                <Accordion
                  defaultExpanded={false}
                  onChange={handleDetailsChange}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{keyword(detailsPanelMessage)}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack direction={"column"} spacing={4}>
                      {syntheticImageScores.map((item, key) => {
                        let predictionScore;

                        if (item.predictionScore) {
                          predictionScore = sanitizeDetectionPercentage(
                            item.predictionScore,
                          );
                        }

                        return (
                          <Stack direction="column" spacing={4} key={key}>
                            <Stack direction="column" spacing={2}>
                              <Stack
                                direction="row"
                                alignItems="flex-start"
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography
                                    variant={"h6"}
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {keyword(item.name)}
                                  </Typography>
                                  <Stack
                                    direction={{ lg: "row", md: "column" }}
                                    spacing={2}
                                    alignItems="center"
                                  >
                                    <Stack direction="row" spacing={1}>
                                      {item.isError ? (
                                        <Alert severity="error">
                                          {keyword(
                                            "synthetic_image_detection_error_generic",
                                          )}
                                        </Alert>
                                      ) : (
                                        <>
                                          <Typography>
                                            {keyword(
                                              "synthetic_image_detection_probability_text",
                                            )}{" "}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              color:
                                                getPercentageColorCode(
                                                  predictionScore,
                                                ),
                                            }}
                                          >
                                            {predictionScore}%
                                          </Typography>
                                        </>
                                      )}
                                    </Stack>
                                    {!item.isError && (
                                      <Chip
                                        label={getAlertLabel(
                                          predictionScore,
                                          keyword,
                                        )}
                                        color={getAlertColor(predictionScore)}
                                      />
                                    )}
                                  </Stack>
                                </Box>
                              </Stack>

                              <Box
                                p={2}
                                sx={{ backgroundColor: "#FAFAFA" }}
                                mb={2}
                              >
                                <Typography>
                                  {keyword(item.description)}
                                </Typography>
                              </Box>
                            </Stack>
                            {syntheticImageScores.length > key + 1 && (
                              <Divider />
                            )}
                          </Stack>
                        );
                      })}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>

            {nd && nd.similar_media && nd.similar_media.length > 0 && (
              <Grid
                item
                p={4}
                sx={{
                  width: "100%",
                  maxWidth: "100% !important",
                }}
              >
                <Accordion defaultExpanded onChange={handleNddDetailsChange}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{keyword(nddDetailsPanelMessage)}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack direction={"column"} spacing={4}>
                      <NddDatagrid rows={getNddRows(nd.similar_media)} />
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SyntheticImageDetectionResults;
