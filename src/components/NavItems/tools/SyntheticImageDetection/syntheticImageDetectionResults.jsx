import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Backdrop,
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Fade,
  Grid,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Close, Download, ExpandMore, Square } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useSelector } from "react-redux";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import CustomAlertScore from "../../../Shared/CustomAlertScore";
import GaugeChart from "react-gauge-chart";
import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";

const SyntheticImageDetectionResults = (props) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  class SyntheticImageDetectionAlgorithmResult {
    /**
     *
     * @param methodName {string}
     * @param predictionScore {number}
     * @param isError {boolean}
     */
    constructor(methodName, predictionScore, isError) {
      (this.methodName = methodName),
        (this.predictionScore = predictionScore),
        (this.isError = isError);
    }
  }

  const DeepfakeImageDetectionMethodNames = {
    gan: {
      name: keyword("synthetic_image_detection_gan_name"),
      description: keyword("synthetic_image_detection_gan_description"),
    },
    diffusion: {
      name: keyword("synthetic_image_detection_diffusion_name"),
      description: keyword("synthetic_image_detection_diffusion_description"),
    },
    progan_r50_grip: {
      name: keyword("synthetic_image_detection_progan_name"),
      description: keyword("synthetic_image_detection_progan_description"),
    },
    adm_r50_grip: {
      name: keyword("synthetic_image_detection_adm_name"),
      description: keyword("synthetic_image_detection_adm_description"),
    },
    progan_rine_mever: {
      name: keyword("synthetic_image_detection_progan_rine_mever_name"),
      description: keyword(
        "synthetic_image_detection_progan_rine_mever_description",
      ),
    },
    ldm_rine_mever: {
      name: keyword("synthetic_image_detection_ldm_rine_mever_name"),
      description: keyword(
        "synthetic_image_detection_ldm_rine_mever_description",
      ),
    },
  };
  const results = props.result;
  const url = props.url;
  const imgElement = React.useRef(null);

  const imgContainerRef = useRef(null);

  const [syntheticImageScores, setSyntheticImageScores] = useState([]);

  const [maxScore, setMaxScore] = useState(0);

  const [resultsHaveErrors, setResultsHaveErrors] = useState(false);

  const [openGaugeColorsModal, setOpenGaugeColorsModal] = React.useState(false);

  const gaugeChartRef = useRef(null);

  useEffect(() => {
    setResultsHaveErrors(false);

    const diffusionScore = new SyntheticImageDetectionAlgorithmResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[1],
      !results.unina_report.prediction
        ? 0
        : results.unina_report.prediction * 100,
      !results.unina_report.prediction,
    );
    const ganScore = new SyntheticImageDetectionAlgorithmResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[0],
      !results.gan_report.prediction ? 0 : results.gan_report.prediction * 100,
      !results.gan_report.prediction,
    );

    const proganScore = new SyntheticImageDetectionAlgorithmResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[2],
      !results.progan_r50_grip_report.prediction
        ? 0
        : results.progan_r50_grip_report.prediction * 100,
      !results.progan_r50_grip_report.prediction,
    );

    const admScore = new SyntheticImageDetectionAlgorithmResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[3],
      !results.adm_r50_grip_report.prediction
        ? 0
        : results.adm_r50_grip_report.prediction * 100,
      !results.adm_r50_grip_report.prediction,
    );

    const proganRineScore = new SyntheticImageDetectionAlgorithmResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[4],
      !results.progan_rine_mever_report.prediction
        ? 0
        : results.progan_rine_mever_report.prediction * 100,
      !results.progan_rine_mever_report.prediction,
    );

    const ldmRineScore = new SyntheticImageDetectionAlgorithmResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[5],
      !results.ldm_rine_mever_report.prediction
        ? 0
        : results.ldm_rine_mever_report.prediction * 100,
      !results.ldm_rine_mever_report.prediction,
    );

    const res = (
      role.includes("EXTRA_FEATURE")
        ? [
            diffusionScore,
            ganScore,
            proganScore,
            admScore,
            proganRineScore,
            ldmRineScore,
          ]
        : [diffusionScore, ganScore, proganScore]
    ).sort((a, b) => b.predictionScore - a.predictionScore);

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
  }, [results]);

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
  const role = useSelector((state) => state.userSession.user.roles);
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

  const handleClose = () => {
    props.handleClose();
  };
  const DETECTION_THRESHOLDS = {
    THRESHOLD_1: 50,
    THRESHOLD_2: 70,
    THRESHOLD_3: 90,
  };

  const getPercentageColorCode = (n) => {
    if (n >= DETECTION_THRESHOLDS.THRESHOLD_3) {
      return "#FF0000";
    } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_2) {
      return "#FFAA00";
    } else {
      return "green";
    }
  };

  /**
   * Returns the alert color code for the given percentage n
   * @param n {number}
   * @returns {"error" | "warning" | "success"}
   */
  const getAlertColor = (n) => {
    if (n >= DETECTION_THRESHOLDS.THRESHOLD_3) {
      return "error";
    } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_2) {
      return "warning";
    } else {
      return "success";
    }
  };

  const getAlertLabel = (n) => {
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
      : setDetailsPanelMessage(
          "synthetic_image_detection_additional_results_hide",
        );
  };

  const handleOpenGaugeColorsModal = () => {
    setOpenGaugeColorsModal(true);
  };

  const handleCloseGaugeColorsModal = () => setOpenGaugeColorsModal(false);

  const gaugeColorsModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "400px",
    width: "30vw",
    backgroundColor: "background.paper",
    outline: "unset",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    maxHeight: "60vh",
    overflow: "auto",
  };

  const downloadGaugeChartAsPng = async () => {
    const canvas = await html2canvas(gaugeChartRef.current).catch((e) =>
      console.log(e),
    );
    console.log(canvas);
    console.log(gaugeChartRef.current);
    const img = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    link.style.display = "none";
    link.download = "gaugeChart";
    link.href = img;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
  };

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >
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
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
        >
          <Grid item sm={12} md={6}>
            <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                ref={imgContainerRef}
                p={4}
              >
                <img
                  src={url}
                  alt={"Displays the results of the deepfake tool"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "60vh",
                    borderRadius: "10px",
                  }}
                  crossOrigin={"anonymous"}
                  ref={imgElement}
                />
              </Grid>
            </Box>
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
                        onClick={downloadGaugeChartAsPng}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>

                <Link
                  onClick={handleOpenGaugeColorsModal}
                  sx={{ cursor: "pointer" }}
                  variant={"body1"}
                >
                  {keyword("synthetic_image_detection_scale_explanation_link")}
                </Link>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={openGaugeColorsModal}
                  onClose={handleCloseGaugeColorsModal}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                >
                  <Fade in={openGaugeColorsModal}>
                    <Box sx={gaugeColorsModalStyle}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <Typography
                          id="transition-modal-title"
                          variant="subtitle2"
                          style={{
                            color: "#00926c",
                            fontSize: "24px",
                          }}
                        >
                          {keyword(
                            "synthetic_image_detection_scale_modal_explanation_title",
                          )}
                        </Typography>
                        <IconButton
                          variant="outlined"
                          aria-label="close popup"
                          onClick={handleCloseGaugeColorsModal}
                        >
                          <Close />
                        </IconButton>
                      </Stack>
                      <Stack
                        id="transition-modal-description"
                        direction="column"
                        spacing={2}
                        mt={2}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Square fontSize="large" sx={{ color: "#00FF00" }} />
                          <Typography>
                            {keyword(
                              "synthetic_image_detection_scale_modal_explanation_rating_1",
                            )}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Square fontSize="large" sx={{ color: "#AAFF03" }} />
                          <Typography>
                            {keyword(
                              "synthetic_image_detection_scale_modal_explanation_rating_2",
                            )}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Square fontSize="large" sx={{ color: "#FFA903" }} />
                          <Typography>
                            {keyword(
                              "synthetic_image_detection_scale_modal_explanation_rating_3",
                            )}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Square fontSize="large" sx={{ color: "#FF0000" }} />
                          <Typography>
                            {keyword(
                              "synthetic_image_detection_scale_modal_explanation_rating_4",
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Fade>
                </Modal>
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
                <Box sx={{ width: "100%" }}>
                  <Accordion defaultExpanded onChange={handleDetailsChange}>
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
                                      {
                                        DeepfakeImageDetectionMethodNames[
                                          item.methodName
                                        ].name
                                      }
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
                                          label={getAlertLabel(predictionScore)}
                                          color={getAlertColor(predictionScore)}
                                        />
                                      )}
                                    </Stack>
                                  </Box>
                                  <Stack>
                                    {/*<Button*/}
                                    {/*  href={*/}
                                    {/*    DeepfakeImageDetectionMethodNames[*/}
                                    {/*      item.methodName*/}
                                    {/*    ].modelCardUrl*/}
                                    {/*  }*/}
                                    {/*>*/}
                                    {/*  {keyword(*/}
                                    {/*    "synthetic_image_detection_model_card",*/}
                                    {/*  )}*/}
                                    {/*</Button>*/}
                                  </Stack>
                                </Stack>

                                <Box
                                  p={2}
                                  sx={{ backgroundColor: "#FAFAFA" }}
                                  mb={2}
                                >
                                  <Typography>
                                    {
                                      DeepfakeImageDetectionMethodNames[
                                        item.methodName
                                      ].description
                                    }
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
        </Grid>
      </Card>
    </Stack>
  );
};

export default SyntheticImageDetectionResults;
