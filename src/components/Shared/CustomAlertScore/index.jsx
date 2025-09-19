import React from "react";

import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import CopyButton from "../CopyButton";
import { i18nLoadNamespace } from "../Languages/i18nLoadNamespace";

const CustomAlertScore = ({
  score,
  detectionType,
  toolName,
  thresholds,
  isInconclusive,
}) => {
  const keyword = i18nLoadNamespace(`components/NavItems/tools/${toolName}`);

  // TODO: handle error
  if (!score || typeof score !== "number") return;
  if (detectionType && typeof detectionType !== "string") return;

  if (score > 100 || score < 0) {
    //   TODO: Handle Error
    console.error("Error with the voice cloning score");
    return <></>;
  }

  let alertSettings = {
    displayText: "",
    severity: "",
  };

  const DETECTION_TYPES = {
    VOICE_CLONING: "synthesis",
    IMAGE: "image",
    VIDEO: "video",
    MACHINE_GENERATED_TEXT: "machine_generated_text",
  };

  const toolNameSnakeCase = toolName
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();

  const DETECTION_THRESHOLD_1 = thresholds.THRESHOLD_1;
  const DETECTION_THRESHOLD_2 = thresholds.THRESHOLD_2;
  const DETECTION_THRESHOLD_3 = thresholds.THRESHOLD_3;

  const SEVERITY_ERROR = "error";
  const SEVERITY_INFO = "info";

  function getDisplayTextForDetectionScore(score, detectionType) {
    let displayText;

    if (typeof score !== "number" || score > 100 || score < 0) {
      //   TODO: Handle Error
      return;
    }

    const getDetectionTranslation = () => {
      if (!detectionType) return "";
      else {
        if (detectionType === DETECTION_TYPES.VOICE_CLONING) {
          return "_voice_cloning_detection";
        } else if (detectionType === DETECTION_TYPES.IMAGE) {
          return "_image";
        } else if (detectionType === DETECTION_TYPES.VIDEO) {
          return "_video";
        } else if (detectionType === DETECTION_TYPES.MACHINE_GENERATED_TEXT) {
          return "_machine_generated_text";
        } else return "";
      }
    };

    const detectionTranslation = getDetectionTranslation();

    displayText = keyword(`${toolNameSnakeCase}${detectionTranslation}_rating`);

    if (isInconclusive) {
      displayText += keyword(
        `${toolNameSnakeCase}${detectionTranslation}_rating_0`,
      );
    } else if (score >= DETECTION_THRESHOLD_3) {
      displayText +=
        !detectionType ||
        detectionType === DETECTION_TYPES.VOICE_CLONING ||
        detectionType === DETECTION_TYPES.VIDEO ||
        detectionType === DETECTION_TYPES.IMAGE ||
        detectionType === DETECTION_TYPES.MACHINE_GENERATED_TEXT
          ? keyword(`${toolNameSnakeCase}${detectionTranslation}_rating_4`)
          : keyword(`hiya_voice_recording_detection_rating_4`);
    } else if (score >= DETECTION_THRESHOLD_2) {
      displayText +=
        !detectionType ||
        detectionType === DETECTION_TYPES.VOICE_CLONING ||
        detectionType === DETECTION_TYPES.VIDEO ||
        detectionType === DETECTION_TYPES.IMAGE ||
        detectionType === DETECTION_TYPES.MACHINE_GENERATED_TEXT
          ? keyword(`${toolNameSnakeCase}${detectionTranslation}_rating_3`)
          : keyword(`hiya_voice_recording_detection_rating_3`);
    } else if (score >= DETECTION_THRESHOLD_1) {
      displayText +=
        !detectionType ||
        detectionType === DETECTION_TYPES.VOICE_CLONING ||
        detectionType === DETECTION_TYPES.VIDEO ||
        detectionType === DETECTION_TYPES.IMAGE ||
        detectionType === DETECTION_TYPES.MACHINE_GENERATED_TEXT
          ? keyword(`${toolNameSnakeCase}${detectionTranslation}_rating_2`)
          : keyword(`hiya_voice_recording_detection_rating_2`);
    } else {
      displayText +=
        !detectionType ||
        detectionType === DETECTION_TYPES.VOICE_CLONING ||
        detectionType === DETECTION_TYPES.VIDEO ||
        detectionType === DETECTION_TYPES.IMAGE ||
        detectionType === DETECTION_TYPES.MACHINE_GENERATED_TEXT
          ? keyword(`${toolNameSnakeCase}${detectionTranslation}_rating_1`)
          : keyword(`hiya_voice_recording_detection_rating_1`);
    }

    return displayText;
  }

  alertSettings.displayText = getDisplayTextForDetectionScore(
    score,
    detectionType,
  );

  alertSettings.severity = isInconclusive ? SEVERITY_ERROR : SEVERITY_INFO;

  return (
    <Alert
      icon={false}
      severity={alertSettings.severity}
      action={
        <CopyButton
          strToCopy={alertSettings.displayText}
          labelBeforeCopy={keyword(`${toolNameSnakeCase}_button_copy_text_1`)}
          labelAfterCopy={keyword(`${toolNameSnakeCase}_button_copy_text_2`)}
        />
      }
    >
      <Grid container>
        <Grid size={{ xs: 12 }} align="start">
          <Typography variant="body1">{alertSettings.displayText}</Typography>
        </Grid>
      </Grid>
    </Alert>
  );
};

export default CustomAlertScore;
