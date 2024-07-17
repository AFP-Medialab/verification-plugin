import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useSelector } from "react-redux";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import GaugeChartResult from "components/Shared/GaugeChartResults/GaugeChartResult";

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

  const gaugeChartRef = useRef(null);

  useEffect(() => {
    setResultsHaveErrors(false);

    const diffusionScore = new SyntheticImageDetectionAlgorithmResult(
      //previously unina_report
      Object.keys(DeepfakeImageDetectionMethodNames)[1],
      !results.ldm_r50_grip_report.prediction
        ? 0
        : results.ldm_r50_grip_report.prediction * 100,
      !results.ldm_r50_grip_report.prediction,
    );
    const ganScore = new SyntheticImageDetectionAlgorithmResult(
      //previously gan_report
      Object.keys(DeepfakeImageDetectionMethodNames)[0],
      !results.gan_r50_mever_report.prediction
        ? 0
        : results.gan_r50_mever_report.prediction * 100,
      !results.gan_r50_mever_report.prediction,
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

  const keywords = [
    "gauge_scale_modal_explanation_rating_1",
    "gauge_scale_modal_explanation_rating_2",
    "gauge_scale_modal_explanation_rating_3",
    "gauge_scale_modal_explanation_rating_4",
  ];
  const colors = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

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
            <Box sx={{ width: "100%", height: "100%" }}>
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
                  alt={"Displays the results of the deepfake topMenuItem"}
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
              <GaugeChartResult
                keyword={keyword}
                scores={syntheticImageScores}
                methodNames={DeepfakeImageDetectionMethodNames}
                detectionThresholds={DETECTION_THRESHOLDS}
                resultsHaveErrors={resultsHaveErrors}
                sanitizeDetectionPercentage={sanitizeDetectionPercentage}
                gaugeExplanation={{ colors: colors, keywords: keywords }}
                toolName={"SyntheticImageDetection"}
              />
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
