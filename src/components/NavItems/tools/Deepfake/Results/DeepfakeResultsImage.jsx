import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Grid, Typography, Stack, IconButton, Tooltip } from "@mui/material";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Deepfake.tsv";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import { LinearProgressWithLabel } from "../../../../Shared/LinearProgressWithLabel/LinearProgressWithLabel";
import { Close, Help } from "@mui/icons-material";
import { resetDeepfake } from "redux/actions/tools/deepfakeImageActions";
import { useDispatch, useSelector } from "react-redux";
import { DetectionProgressBar } from "components/Shared/DetectionProgressBar/DetectionProgressBar";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "Hooks/useAnalytics";

const DeepfakeResultsImage = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Deepfake.tsv",
    tsv,
  );

  const dispatch = useDispatch();
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

  const [deepfakeScore, setDeepfakeScores] = useState(undefined);

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
    setDeepfakeScores(res);
  }, [results]);

  const drawRectangles = () => {
    setRectangles(null);
    setRectanglesReady(false);

    if (!deepfakeScore || !deepfakeScore.methodName) {
      return;
    }

    if (
      deepfakeScore.methodName !==
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

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.email : null;

  useTrackEvent(
    "submission",
    "deepfake_image",
    "deepfake image processing",
    url,
    client_id,
    url,
    uid,
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      drawRectangles();
    });

    resizeObserver.observe(imgContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [deepfakeScore]);

  const handleClose = () => {
    props.handleClose();
    dispatch(resetDeepfake());
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
          title={keyword("deepfake_image_title")}
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
                <Grid item>
                  {rectanglesReady &&
                    rectangles &&
                    rectangles.map((valueRectangle, keyRectangle) => {
                      return (
                        <Box
                          key={keyRectangle}
                          className={classes.deepfakeSquare}
                          pr={4}
                          pb={4}
                          mt={4}
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
                            <Typography>
                              {valueRectangle.probability}%
                            </Typography>
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
                    borderRadius: "10px",
                  }}
                  ref={imgElement}
                  onLoad={drawRectangles}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid item sm={12} md={6}>
            <Stack direction="column" p={4} spacing={4}>
              {deepfakeScore &&
                deepfakeScore.predictionScore &&
                deepfakeScore.predictionScore >= 70 && (
                  <Typography variant="h5" sx={{ color: "red" }}>
                    {keyword("deepfake_image_detection_alert") +
                      DeepfakeImageDetectionMethodNames[
                        deepfakeScore.methodName
                      ].name +
                      keyword("deepfake_image_detection_alert_2")}
                  </Typography>
                )}
              {deepfakeScore && (
                <Stack direction="column">
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                  >
                    <Typography variant="h6">
                      {
                        DeepfakeImageDetectionMethodNames[
                          deepfakeScore.methodName
                        ].name
                      }
                    </Typography>
                    <Tooltip
                      title={
                        DeepfakeImageDetectionMethodNames[
                          deepfakeScore.methodName
                        ].description
                      }
                    >
                      <IconButton>
                        <Help />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <LinearProgressWithLabel
                    value={deepfakeScore.predictionScore}
                  />
                </Stack>
              )}
              <Box>
                <DetectionProgressBar
                  style={{
                    height: "8px",
                  }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};
export default DeepfakeResultsImage;
