import { Download, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import GaugeChart from "react-gauge-chart";
import GaugeChartModalExplanation from "./GaugeChartModalExplanation";
import CustomAlertScore from "../CustomAlertScore";
import { exportReactElementAsJpg } from "../Utils/htmlUtils";

/**
 *
 * @param keyword The translation i18n function
 * @param scores {Array<Object>} The results of the analysis
 * @param methodNames {Object} Objet containing the information on the different methods used
 * @param detectionThresholds {Object} Object containing the detection thresholds
 * @param resultsHaveErrors {boolean}
 * @param sanitizeDetectionPercentage {(arg: number) => number} Function
 * @param gaugeExplanation {Object} Object containing the explainations for the colors of the gauge
 * @param toolName {string} The name of the tool
 * @param detectionType {string=} String differentiating between video and image for tools used in both categories
 * @returns {Element}
 * @constructor
 */

const GaugeChartResult = ({
  keyword,
  scores,
  methodNames,
  detectionThresholds,
  arcsLength,
  resultsHaveErrors,
  sanitizeDetectionPercentage,
  gaugeExplanation,
  toolName,
  detectionType,
}) => {
  //const keyword = (word) => "hi";
  const gaugeChartRef = useRef(null);

  const previsionalScore = Math.max(
    ...scores.map((score) => score.predictionScore),
  );

  const maxScore = sanitizeDetectionPercentage
    ? sanitizeDetectionPercentage(previsionalScore)
    : previsionalScore;

  const getPercentageColorCode = (n) => {
    if (n >= detectionThresholds.THRESHOLD_3) {
      return "#FF0000";
    } else if (n >= detectionThresholds.THRESHOLD_2) {
      return "#FFAA00";
    } else {
      return "green";
    }
  };

  const getAlertColor = (n) => {
    if (n >= detectionThresholds.THRESHOLD_3) {
      return "error";
    } else if (n >= detectionThresholds.THRESHOLD_2) {
      return "warning";
    } else {
      return "success";
    }
  };

  const getAlertLabel = (n) => {
    if (n >= detectionThresholds.THRESHOLD_3) {
      return keyword("gauge_alert_label_4");
    } else if (n >= detectionThresholds.THRESHOLD_2) {
      return keyword("gauge_alert_label_3");
    } else if (n >= detectionThresholds.THRESHOLD_1) {
      return keyword("gauge_alert_label_2");
    } else {
      return keyword("gauge_alert_label_1");
    }
  };

  const [detailsPanelMessage, setDetailsPanelMessage] = useState(
    "gauge_additional_results_hide",
  );

  const handleDetailsChange = () => {
    detailsPanelMessage === "gauge_additional_results_hide"
      ? setDetailsPanelMessage("gauge_additional_results")
      : setDetailsPanelMessage("gauge_additional_results_hide");
  };

  return (
    <>
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
            {maxScore > detectionThresholds.THRESHOLD_2 && (
              <Typography
                variant="h5"
                align="center"
                alignSelf="center"
                sx={{ color: "red" }}
              >
                {keyword("gauge_generic_detection_text")}
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
                arcsLength={
                  arcsLength
                    ? arcsLength
                    : [
                        (100 - detectionThresholds.THRESHOLD_1) / 100,
                        (detectionThresholds.THRESHOLD_2 -
                          detectionThresholds.THRESHOLD_1) /
                          100,
                        (detectionThresholds.THRESHOLD_3 -
                          detectionThresholds.THRESHOLD_2) /
                          100,
                        (100 - detectionThresholds.THRESHOLD_3) / 100,
                      ]
                }
                percent={scores ? maxScore / 100 : 0}
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
                  {keyword("gauge_no_detection")}
                </Typography>
                <Typography variant="subtitle2">
                  {keyword("gauge_detection")}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Box alignSelf={{ sm: "flex-start", md: "flex-end" }}>
            <Tooltip title={keyword("gauge_download_gauge_button")}>
              <IconButton
                color="primary"
                aria-label="download chart"
                onClick={async () =>
                  await exportReactElementAsJpg(gaugeChartRef, "gauge_chart")
                }
              >
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        <GaugeChartModalExplanation
          keyword={keyword}
          keywordsArr={gaugeExplanation.keywords}
          keywordLink={"gauge_scale_explanation_link"}
          keywordModalTitle={"gauge_scale_modal_explanation_title"}
          colors={gaugeExplanation.colors}
        />

        <CustomAlertScore
          score={scores ? maxScore : 0}
          detectionType={detectionType ? detectionType : undefined}
          toolName={toolName}
          thresholds={detectionThresholds}
        />
        {resultsHaveErrors && (
          <Alert severity="error">{keyword("gauge_algorithms_errors")}</Alert>
        )}
        <Box sx={{ width: "100%" }}>
          <Accordion defaultExpanded onChange={handleDetailsChange}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>{keyword(detailsPanelMessage)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction={"column"} spacing={4}>
                {scores.map((item, key) => {
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
                            ></Typography>
                            <Stack
                              direction={{ lg: "row", md: "column" }}
                              spacing={2}
                              alignItems="center"
                            >
                              <Stack direction="row" spacing={1}>
                                {item.isError ? (
                                  <Alert severity="error">
                                    {keyword("gauge_error_generic")}
                                  </Alert>
                                ) : (
                                  <>
                                    <Typography>
                                      {keyword("gauge_probability_text")}{" "}
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
                                  label={getAlertLabel(predictionScore)}
                                  color={getAlertColor(predictionScore)}
                                />
                              )}
                            </Stack>
                          </Box>
                        </Stack>

                        <Box p={2} sx={{ backgroundColor: "#FAFAFA" }} mb={2}>
                          <Typography>
                            {methodNames[item.methodName].description}
                          </Typography>
                        </Box>
                      </Stack>
                      {scores.length > key + 1 && <Divider />}
                    </Stack>
                  );
                })}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>
    </>
  );
};

export default GaugeChartResult;
