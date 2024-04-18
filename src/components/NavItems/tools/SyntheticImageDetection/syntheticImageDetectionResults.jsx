import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useSelector } from "react-redux";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomAlertScore from "../../../Shared/CustomAlertScore";
import GaugeChart from "react-gauge-chart";

const SyntheticImageDetectionResults = (props) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  class DeepfakeResult {
    constructor(methodName, predictionScore) {
      (this.methodName = methodName), (this.predictionScore = predictionScore);
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
  };
  const results = props.result;
  const url = props.url;
  const imgElement = React.useRef(null);

  const imgContainerRef = useRef(null);

  const [syntheticImageScores, setSyntheticImageScores] = useState([]);

  const [maxScore, setMaxScore] = useState(0);

  useEffect(() => {
    if (
      !results ||
      !results.unina_report ||
      !results.unina_report.prediction ||
      !results.gan_report ||
      !results.gan_report.prediction
    ) {
      return;
    }
    const diffusionScore = new DeepfakeResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[1],
      results.unina_report.prediction * 100,
    );
    const ganScore = new DeepfakeResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[0],
      results.gan_report.prediction * 100,
    );

    const proganScore = new DeepfakeResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[2],
      results.progan_r50_grip_report.prediction * 100,
    );

    const admScore = new DeepfakeResult(
      Object.keys(DeepfakeImageDetectionMethodNames)[3],
      results.adm_r50_grip_report.prediction * 100,
    );

    const res = (
      role.includes("EXTRA_FEATURE")
        ? [diffusionScore, ganScore, proganScore, admScore]
        : [diffusionScore, ganScore, proganScore]
    ).sort((a, b) => b.predictionScore - a.predictionScore);

    setSyntheticImageScores(res);

    setMaxScore(
      Math.round(
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

  const SYNTHETIC_IMAGE_DETECTION_THRESHOLD_1 = 10;
  const SYNTHETIC_IMAGE_DETECTION_THRESHOLD_2 = 30;
  const SYNTHETIC_IMAGE_DETECTION_THRESHOLD_3 = 60;

  const getPercentageColorCode = (n) => {
    if (n >= SYNTHETIC_IMAGE_DETECTION_THRESHOLD_3) {
      return "#FF0000";
    } else if (n >= SYNTHETIC_IMAGE_DETECTION_THRESHOLD_2) {
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
    if (n >= SYNTHETIC_IMAGE_DETECTION_THRESHOLD_3) {
      return "error";
    } else if (n >= SYNTHETIC_IMAGE_DETECTION_THRESHOLD_2) {
      return "warning";
    } else {
      return "success";
    }
  };

  const getAlertLabel = (n) => {
    if (n >= SYNTHETIC_IMAGE_DETECTION_THRESHOLD_3) {
      return keyword("synthetic_image_detection_alert_label_4");
    } else if (n >= SYNTHETIC_IMAGE_DETECTION_THRESHOLD_2) {
      return keyword("synthetic_image_detection_alert_label_3");
    } else if (n >= SYNTHETIC_IMAGE_DETECTION_THRESHOLD_1) {
      return keyword("synthetic_image_detection_alert_label_2");
    } else {
      return keyword("synthetic_image_detection_alert_label_1");
    }
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
            <Stack
              direction="column"
              p={4}
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={4}
              width="100%"
              sx={{ boxSizing: "border-box" }}
            >
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={0}
                width="100%"
              >
                <GaugeChart
                  id={"gauge-chart"}
                  animate={false}
                  nrOfLevels={4}
                  textColor={"black"}
                  arcsLength={[0.1, 0.2, 0.3, 0.4]}
                  percent={syntheticImageScores ? maxScore / 100 : 0}
                  style={{ width: 250 }}
                />
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={10}
                >
                  <Typography variant="subtitle2">
                    {keyword("synthetic_image_detection_gauge_no_detection")}
                  </Typography>
                  <Typography variant="subtitle2">
                    {keyword("synthetic_image_detection_gauge_detection")}
                  </Typography>
                </Stack>
              </Stack>
              <CustomAlertScore
                score={syntheticImageScores ? maxScore : 0}
                detectionType={undefined}
                toolName={"SyntheticImageDetection"}
              />
              <Typography>
                {keyword(
                  "synthetic_image_detection_additional_explanation_text",
                )}
              </Typography>
              <Box sx={{ width: "100%" }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {keyword("synthetic_image_detection_additional_results")}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack direction={"column"} spacing={4}>
                      {syntheticImageScores &&
                        syntheticImageScores.map((item, key) => {
                          const predictionScore = Math.round(
                            item.predictionScore,
                          );
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
                                      direction="row"
                                      spacing={2}
                                      alignItems="center"
                                    >
                                      <Stack direction="row" spacing={1}>
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
                                      </Stack>
                                      <Chip
                                        label={getAlertLabel(predictionScore)}
                                        color={getAlertColor(predictionScore)}
                                      />
                                    </Stack>
                                  </Box>
                                  <Stack>
                                    {/*<Button>Read paper</Button>*/}
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
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};

export default SyntheticImageDetectionResults;
