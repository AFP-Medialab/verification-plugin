import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Grid, Typography, Stack, IconButton, Tooltip } from "@mui/material";
import { Close } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { LinearProgressWithLabel } from "components/Shared/LinearProgressWithLabel/LinearProgressWithLabel";
import { Help } from "@mui/icons-material";
import { resetSyntheticImageDetectionImage } from "redux/actions/tools/syntheticImageDetectionActions";
import { useDispatch, useSelector } from "react-redux";
import { DetectionProgressBar } from "components/Shared/DetectionProgressBar/DetectionProgressBar";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";

const SyntheticImageDetectionResults = (props) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  const dispatch = useDispatch();

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
    dispatch(resetSyntheticImageDetectionImage());
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
            <Stack direction="column" p={4} spacing={4}>
              {syntheticImageScores &&
                syntheticImageScores.length > 0 &&
                syntheticImageScores[0].predictionScore &&
                syntheticImageScores[0].predictionScore >= 70 && (
                  <Typography variant="h5" sx={{ color: "red" }}>
                    {keyword("synthetic_image_detection_alert") +
                      DeepfakeImageDetectionMethodNames[
                        syntheticImageScores[0].methodName
                      ].name +
                      keyword("synthetic_image_detection_alert_2")}
                  </Typography>
                )}
              {syntheticImageScores &&
                syntheticImageScores.map((item, key) => {
                  return (
                    <Stack direction="column" key={key}>
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={2}
                      >
                        <Typography variant="h6">
                          {
                            DeepfakeImageDetectionMethodNames[item.methodName]
                              .name
                          }
                        </Typography>
                        <Tooltip
                          title={
                            DeepfakeImageDetectionMethodNames[item.methodName]
                              .description
                          }
                        >
                          <IconButton>
                            <Help />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                      <LinearProgressWithLabel value={item.predictionScore} />
                    </Stack>
                  );
                })}
              {syntheticImageScores?.length > 0 ? (
                <Box pt={2}>
                  <DetectionProgressBar
                    style={{
                      height: "8px",
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="h6" sx={{ color: "red" }}>
                  {keyword("synthetic_image_detection_not_found")}
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};

export default SyntheticImageDetectionResults;
