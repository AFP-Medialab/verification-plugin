import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Grid, Typography, Stack, IconButton, Tooltip } from "@mui/material";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/SyntheticImageDetection.tsv";
import useLoadLanguage from "Hooks/useLoadLanguage";
import { LinearProgressWithLabel } from "components/Shared/LinearProgressWithLabel/LinearProgressWithLabel";
import { Help } from "@mui/icons-material";

const SyntheticImageDetectionResults = (props) => {
  const keyword = useLoadLanguage(
    "components/NavItems/tools/SyntheticImageDetection.tsv",
    tsv,
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
  };
  const results = props.result;
  const url = props.url;
  const imgElement = React.useRef(null);

  const imgContainerRef = useRef(null);

  const [deepfakeScores, setDeepfakeScores] = useState([]);

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

    const res = [diffusionScore, ganScore].sort(
      (a, b) => b.predictionScore - a.predictionScore,
    );

    setDeepfakeScores(res);
  }, [results]);

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >
      <Card style={{ overflow: "hidden", width: "50%", height: "auto" }}>
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            ref={imgContainerRef}
          >
            <img
              src={url}
              alt={"Displays the results of the deepfake tool"}
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
              }}
              ref={imgElement}
            />
          </Grid>
        </Box>
      </Card>
      <Card sx={{ width: "50%" }}>
        <CardHeader
          style={{ borderRadius: "4px 4px 0px 0px" }}
          title={keyword("synthetic_image_detection_title")}
        />
        <Stack direction="column" p={4} spacing={4}>
          {deepfakeScores &&
            deepfakeScores.length > 0 &&
            deepfakeScores[0].predictionScore &&
            deepfakeScores[0].predictionScore >= 70 && (
              <Typography variant="h5" sx={{ color: "red" }}>
                {keyword("synthetic_image_detection_detection_alert") +
                  DeepfakeImageDetectionMethodNames[
                    deepfakeScores[0].methodName
                  ].name +
                  keyword("synthetic_image_detection_detection_alert_2")}
              </Typography>
            )}
          {deepfakeScores &&
            deepfakeScores.map((item, key) => {
              return (
                <Stack direction="column" key={key}>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                  >
                    <Typography variant="h6">
                      {DeepfakeImageDetectionMethodNames[item.methodName].name}
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
        </Stack>
      </Card>
    </Stack>
  );
};

export default SyntheticImageDetectionResults;