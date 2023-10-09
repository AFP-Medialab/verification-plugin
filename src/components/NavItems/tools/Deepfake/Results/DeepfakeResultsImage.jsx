import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Grid, Typography, Stack, IconButton, Tooltip } from "@mui/material";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Deepfake.tsv";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import { LinearProgressWithLabel } from "../../../../Shared/LinearProgressWithLabel/LinearProgressWithLabel";
import { Help } from "@mui/icons-material";

const DeepfakeResultsImage = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Deepfake.tsv",
    tsv,
  );
  class DeepfakeResult {
    constructor(methodName, predictionScore) {
      (this.methodName = methodName), (this.predictionScore = predictionScore);
    }
  }

  const DeepfakeImageDetectionMethodNames = {
    faceswap: {
      name: keyword("deepfake_image_faceswap_name"),
      description: keyword("deepfake_image_faceswap_description"),
    },
  };

  const results = props.result;
  const url = props.url;
  const imgElement = React.useRef(null);

  const [rectangles, setRectangles] = useState(null);
  const [rectanglesReady, setRectanglesReady] = useState(false);

  const imgContainerRef = useRef(null);

  const [deepfakeScores, setDeepfakeScores] = useState(undefined);

  useEffect(() => {
    if (!results || !results.faceswap_report) {
      return;
    }

    let faceswapScore;

    if (!results.faceswap_report || !results.faceswap_report.prediction) {
      faceswapScore = new DeepfakeResult(
        Object.keys(DeepfakeImageDetectionMethodNames)[0],
        0,
      );
    } else {
      faceswapScore = new DeepfakeResult(
        Object.keys(DeepfakeImageDetectionMethodNames)[0],
        results.faceswap_report.prediction * 100,
      );
    }

    const res = faceswapScore;
    console.log(res);
    setDeepfakeScores(res);
  }, [results]);

  const drawRectangles = () => {
    setRectangles(null);
    setRectanglesReady(false);

    if (!deepfakeScores || !deepfakeScores.methodName) {
      return;
    }

    if (
      deepfakeScores.methodName !==
      Object.keys(DeepfakeImageDetectionMethodNames)[0]
    ) {
      setRectangles(null);
      setRectanglesReady(false);
      return;
    }

    const imgHeight = imgElement.current.offsetHeight;
    const imgWidth = imgElement.current.offsetWidth;
    const containerWidth = imgContainerRef.current.offsetWidth;

    const rectanglesTemp = [];
    console.log(results.faceswap_report.info);
    results.faceswap_report.info.forEach((element) => {
      const rectangleAtributes = element.bbox;

      const elementTop = Math.round(rectangleAtributes.top * imgHeight);
      const elementLeft = Math.round(
        rectangleAtributes.left * imgWidth + (containerWidth - imgWidth) / 2,
      );
      const elementHeight = Math.round(
        (rectangleAtributes.bottom - rectangleAtributes.top) * imgHeight,
      );
      const elementWidth = Math.round(
        (rectangleAtributes.right - rectangleAtributes.left) * imgWidth,
      );

      const elementProbability = Math.round(element.prediction * 100);
      let elementBorderClass = null;

      if (elementProbability >= 80) {
        elementBorderClass = classes.deepfakeSquareBorderRed;
      } else {
        elementBorderClass = classes.deepfakeSquareBorderWhite;
      }

      const rectangle = {
        top: elementTop,
        left: elementLeft,
        height: elementHeight,
        width: elementWidth,
        probability: elementProbability,
        borderClass: elementBorderClass,
      };

      rectanglesTemp.push(rectangle);
    });

    setRectangles(rectanglesTemp);
    setRectanglesReady(true);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      drawRectangles();
    });

    resizeObserver.observe(imgContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [deepfakeScores]);

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
            <Grid item>
              {rectanglesReady &&
                rectangles &&
                rectangles.map((valueRectangle, keyRectangle) => {
                  return (
                    <Box
                      key={keyRectangle}
                      className={classes.deepfakeSquare}
                      sx={{
                        top: valueRectangle.top,
                        left: valueRectangle.left,
                      }}
                    >
                      <Box
                        className={valueRectangle.borderClass}
                        sx={{
                          width: valueRectangle.width,
                          height: valueRectangle.height,
                        }}
                      />

                      <Box
                        mt={1}
                        p={1}
                        sx={{
                          backgroundColor: "#ffffff",
                          borderRadius: "2px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                          width: "fit-content",
                        }}
                      >
                        <Typography>{valueRectangle.probability}%</Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Grid>

            <img
              src={url}
              alt={"Displays the results of the deepfake tool"}
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
              }}
              ref={imgElement}
              onLoad={drawRectangles}
            />
          </Grid>
        </Box>
      </Card>
      <Card sx={{ width: "50%" }}>
        <CardHeader
          style={{ borderRadius: "4px 4px 0px 0px" }}
          title={keyword("deepfake_image_title")}
        />
        <Stack direction="column" p={4} spacing={4}>
          {deepfakeScores &&
            deepfakeScores.predictionScore &&
            deepfakeScores.predictionScore >= 70 && (
              <Typography variant="h5" sx={{ color: "red" }}>
                {keyword("deepfake_image_detection_alert") +
                  DeepfakeImageDetectionMethodNames[deepfakeScores.methodName]
                    .name +
                  keyword("deepfake_image_detection_alert_2")}
              </Typography>
            )}
          {deepfakeScores && (
            <Stack direction="column">
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h6">
                  {
                    DeepfakeImageDetectionMethodNames[deepfakeScores.methodName]
                      .name
                  }
                </Typography>
                <Tooltip
                  title={
                    DeepfakeImageDetectionMethodNames[deepfakeScores.methodName]
                      .description
                  }
                >
                  <IconButton>
                    <Help />
                  </IconButton>
                </Tooltip>
              </Stack>
              <LinearProgressWithLabel value={deepfakeScores.predictionScore} />
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};
export default DeepfakeResultsImage;
