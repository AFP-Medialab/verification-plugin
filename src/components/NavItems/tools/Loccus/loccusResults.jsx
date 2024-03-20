import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { resetLoccusAudio } from "redux/actions/tools/loccusActions";
import { useDispatch, useSelector } from "react-redux";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import GaugeChart from "react-gauge-chart";
import CopyButton from "../../../Shared/CopyButton";
import { useWavesurfer } from "@wavesurfer/react";

const LoccusResults = (props) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Loccus");

  const role = useSelector((state) => state.userSession.user.roles);

  const dispatch = useDispatch();

  const result = props.result;
  const url = props.url;

  const [voiceCloningScore, setVoiceCloningScore] = useState(null);
  const [voiceRecordingScore, setVoiceRecordingScore] = useState(null);

  const DETECTION_THRESHOLD_1 = 10;
  const DETECTION_THRESHOLD_2 = 30;
  const DETECTION_THRESHOLD_3 = 60;

  const DETECTION_TYPES = {
    VOICE_CLONING: "synthetic",
    VOICE_RECORDING: "replay",
  };

  useEffect(() => {
    if (!result) {
      return;
    }

    if (
      !result.subscores ||
      !result.subscores.synthetic ||
      typeof result.subscores.synthetic !== "number"
    ) {
      //   TODO: Error handling
    }

    if (
      !result.subscores ||
      !result.subscores.replay ||
      typeof result.subscores.replay !== "number"
    ) {
      //   TODO: Error handling
    }

    setVoiceCloningScore((1 - result.subscores.synthesis) * 100);
    setVoiceRecordingScore((1 - result.subscores.replay) * 100);
  }, [result]);

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  useTrackEvent(
    "submission",
    "loccus_detection",
    "Loccus audio processing",
    url,
    client_id,
    url,
    uid,
  );

  const handleClose = () => {
    props.handleClose();
    dispatch(resetLoccusAudio());
  };

  function getDisplayTextForDetectionScore(score, detectionType) {
    let displayText;

    if (typeof score !== "number" || score > 100 || score < 0) {
      //   TODO: Handle Error
      return;
    }

    displayText = keyword("loccus_voice_cloning_detection_rating");

    if (score >= DETECTION_THRESHOLD_3) {
      displayText +=
        detectionType === DETECTION_TYPES.VOICE_CLONING
          ? keyword("loccus_voice_cloning_detection_rating_4")
          : keyword("loccus_voice_recording_detection_rating_4");
    } else if (score >= DETECTION_THRESHOLD_2) {
      displayText +=
        detectionType === DETECTION_TYPES.VOICE_CLONING
          ? keyword("loccus_voice_cloning_detection_rating_3")
          : keyword("loccus_voice_recording_detection_rating_3");
    } else if (score >= DETECTION_THRESHOLD_1) {
      displayText +=
        detectionType === DETECTION_TYPES.VOICE_CLONING
          ? keyword("loccus_voice_cloning_detection_rating_2")
          : keyword("loccus_voice_recording_detection_rating_2");
    } else {
      displayText +=
        detectionType === DETECTION_TYPES.VOICE_CLONING
          ? keyword("loccus_voice_cloning_detection_rating_1")
          : keyword("loccus_voice_recording_detection_rating_1");
    }

    return displayText;
  }

  function CustomAlertScore(props) {
    // TODO: handle error
    if (!props.score || typeof props.score !== "number") return;
    if (!props.detectionType || typeof props.detectionType !== "string") return;

    let alertSettings = {
      displayText: "",
      severity: "",
    };

    const SEVERITY_SUCCESS = "success";
    const SEVERITY_WARNING = "warning";
    const SEVERITY_ERROR = "error";

    const score = props.score;
    const detectionType = props.detectionType;

    if (score > 100 || score < 0) {
      //   TODO: Handle Error
      console.error("Error with the voice cloning score");
      return <></>;
    }

    alertSettings.displayText = getDisplayTextForDetectionScore(
      score,
      detectionType,
    );

    if (score >= DETECTION_THRESHOLD_3) {
      alertSettings.severity = SEVERITY_ERROR;
    } else if (score >= DETECTION_THRESHOLD_2) {
      alertSettings.severity = SEVERITY_WARNING;
    } else if (score >= DETECTION_THRESHOLD_1) {
      alertSettings.severity = SEVERITY_SUCCESS;
    } else {
      alertSettings.severity = SEVERITY_SUCCESS;
    }

    return (
      <Alert
        icon={false}
        severity={alertSettings.severity}
        action={
          <CopyButton
            strToCopy={alertSettings.displayText}
            labelBeforeCopy={keyword("loccus_button_copy_text_1")}
            labelAfterCopy={keyword("loccus_button_copy_text_2")}
          />
        }
      >
        {alertSettings.displayText}
      </Alert>
    );
  }

  const audioContainerRef = useRef();

  // Hook to get the audio waveform
  useWavesurfer({
    container: audioContainerRef,
    url: url,
    waveColor: "#00926c",
    progressColor: "#005941",
    height: 100,
    backend: "MediaElement",
    mediaControls: true,
  });

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
          title={keyword("loccus_title")}
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
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                p={4}
                spacing={2}
              >
                <Grid item width="100%">
                  <div ref={audioContainerRef} />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item sm={12} md={6}>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" p={4} spacing={2}>
                <Typography variant="h5">
                  {keyword("loccus_voice_cloning_detection_title")}
                </Typography>
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0}
                >
                  <GaugeChart
                    id={"gauge-chart"}
                    animate={false}
                    nrOfLevels={4}
                    textColor={"black"}
                    arcsLength={[0.1, 0.2, 0.3, 0.4]}
                    percent={voiceCloningScore / 100}
                    style={{ width: 250 }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={10}
                  >
                    <Typography variant="subtitle2">
                      {keyword("loccus_gauge_no_detection")}
                    </Typography>
                    <Typography variant="subtitle2">
                      {keyword("loccus_gauge_detection")}
                    </Typography>
                  </Stack>
                </Stack>
                <CustomAlertScore
                  score={voiceCloningScore}
                  detectionType={DETECTION_TYPES.VOICE_CLONING}
                />
                <Typography>
                  {keyword("loccus_cloning_additional_explanation_text")}
                </Typography>
              </Stack>

              {role.includes("EXTRA_FEATURE") && (
                <>
                  <Divider />
                  <Stack direction="column" p={4} spacing={2}>
                    <Typography variant="h5">
                      {keyword("loccus_voice_recording_detection_title")}
                    </Typography>
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0}
                    >
                      <GaugeChart
                        id={"gauge-chart"}
                        animate={false}
                        nrOfLevels={4}
                        textColor={"black"}
                        arcsLength={[0.1, 0.2, 0.3, 0.4]}
                        percent={voiceRecordingScore / 100}
                        style={{ width: 250 }}
                      />
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={10}
                      >
                        <Typography variant="subtitle2">
                          {keyword("loccus_gauge_no_detection")}
                        </Typography>
                        <Typography variant="subtitle2">
                          {keyword("loccus_gauge_detection")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};

export default LoccusResults;
