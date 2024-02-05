import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Alert, Grid, IconButton, Stack, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { resetSyntheticAudioDetectionAudio } from "redux/actions/tools/syntheticAudioDetectionActions";
import { useDispatch, useSelector } from "react-redux";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import GaugeChart from "react-gauge-chart";
import CopyButton from "../../../Shared/CopyButton";

const SyntheticAudioDetectionResults = (props) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticAudioDetection",
  );

  const dispatch = useDispatch();

  const result = props.result;
  const url = props.url;
  const audioElement = React.useRef(null);

  const imgContainerRef = useRef(null);

  const [voiceCloningScore, setVoiceCloningScore] = useState(null);

  const DETECTION_THRESHOLD_1 = 10;
  const DETECTION_THRESHOLD_2 = 30;
  const DETECTION_THRESHOLD_3 = 60;

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

    setVoiceCloningScore((1 - result.subscores.synthetic) * 100);
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
    dispatch(resetSyntheticAudioDetectionAudio());
  };

  function getDisplayTextForCloningScore(voiceCloningScore) {
    let displayText;

    if (
      typeof voiceCloningScore !== "number" ||
      voiceCloningScore > 100 ||
      voiceCloningScore < 0
    ) {
      //   TODO: Handle Error
      return;
    }

    if (voiceCloningScore >= DETECTION_THRESHOLD_3) {
      displayText = keyword("loccus_detection_rating_4");
    } else if (voiceCloningScore >= DETECTION_THRESHOLD_2) {
      displayText = keyword("loccus_detection_rating_3");
    } else if (voiceCloningScore >= DETECTION_THRESHOLD_1) {
      displayText = keyword("loccus_detection_rating_2");
    } else {
      displayText = keyword("loccus_detection_rating_1");
    }

    return displayText;
  }

  function CustomAlertCloningScore(props) {
    let alertSettings = {
      displayText: "",
      severity: "",
    };

    const SEVERITY_SUCCESS = "success";
    const SEVERITY_WARNING = "warning";
    const SEVERITY_ERROR = "error";

    const voiceCloningScore = props.voiceCloningScore;

    if (
      typeof voiceCloningScore !== "number" ||
      voiceCloningScore > 100 ||
      voiceCloningScore < 0
    ) {
      //   TODO: Handle Error
      console.error("Error with the voice cloning score");
      return <></>;
    }

    if (voiceCloningScore >= DETECTION_THRESHOLD_3) {
      alertSettings.displayText = keyword("loccus_detection_rating_4");
      alertSettings.severity = SEVERITY_ERROR;
    } else if (voiceCloningScore >= DETECTION_THRESHOLD_2) {
      alertSettings.displayText = keyword("loccus_detection_rating_3");
      alertSettings.severity = SEVERITY_WARNING;
    } else if (voiceCloningScore >= DETECTION_THRESHOLD_1) {
      alertSettings.displayText = keyword("loccus_detection_rating_2");
      alertSettings.severity = SEVERITY_SUCCESS;
    } else {
      alertSettings.displayText = keyword("loccus_detection_rating_1");
      alertSettings.severity = SEVERITY_SUCCESS;
    }

    console.log(alertSettings);

    return (
      <Alert
        severity={alertSettings.severity}
        action={<CopyButton str={alertSettings.displayText} />}
      >
        {alertSettings.displayText}
      </Alert>
    );
  }

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
          title={keyword("synthetic_audio_detection_title")}
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
                <audio
                  controls
                  alt="Displays the uploaded audio"
                  src={url}
                  ref={audioElement}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid item sm={12} md={6}>
            <Stack direction="column" p={4} spacing={2}>
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
                  <Typography variant="subtitle2">No detection</Typography>
                  {/*<Typography variant="h5">*/}
                  {/*  {Math.round(voiceCloningScore)} %*/}
                  {/*</Typography>*/}
                  <Typography variant="subtitle2">Detection</Typography>
                </Stack>
              </Stack>
              <CustomAlertCloningScore voiceCloningScore={voiceCloningScore} />
              <Typography>How to interpret these results?</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};

export default SyntheticAudioDetectionResults;
