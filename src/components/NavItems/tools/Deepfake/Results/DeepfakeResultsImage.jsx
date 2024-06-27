import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  Grid,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { LinearProgressWithLabel } from "../../../../Shared/LinearProgressWithLabel/LinearProgressWithLabel";
import { Close, Download, ExpandMore, Help } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { DetectionProgressBar } from "components/Shared/DetectionProgressBar/DetectionProgressBar";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "Hooks/useAnalytics";
import GaugeChart from "react-gauge-chart";
import GaugeChartModalExplanation from "components/Shared/GaugeChartResults/GaugeChartModalExplanation";
import { exportReactElementAsJpg } from "components/Shared/Utils/htmlUtils";
import CustomAlertScore from "components/Shared/CustomAlertScore";
import GaugeChartResult from "components/Shared/GaugeChartResults/GaugeChartResult";

const DeepfakeResultsImage = (props) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Deepfake");
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

  const DETECTION_THRESHOLDS = {
    THRESHOLD_1: 50,
    THRESHOLD_2: 70,
    THRESHOLD_3: 90,
  };

  // const gaugeChartRef = useRef(null);

  const keywords = [
    "synthetic_image_detection_scale_modal_explanation_rating_1",
    "synthetic_image_detection_scale_modal_explanation_rating_2",
    "synthetic_image_detection_scale_modal_explanation_rating_3",
    "synthetic_image_detection_scale_modal_explanation_rating_4",
  ];
  const colors = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

  useEffect(() => {
    if (!results || !results.faceswap_ens_mever_report) {
      return;
    }

    let faceswapScore;

    if (
      !results.faceswap_ens_mever_report ||
      !results.faceswap_ens_mever_report.prediction
    ) {
      faceswapScore = new DeepfakeResult(
        Object.keys(DeepfakeImageDetectionMethodNames)[0],
        0,
      );
    } else {
      faceswapScore = new DeepfakeResult(
        Object.keys(DeepfakeImageDetectionMethodNames)[0],
        results.faceswap_ens_mever_report.prediction * 100,
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

    if (
      !results ||
      !results.faceswap_ens_mever_report ||
      !results.faceswap_ens_mever_report.info
    ) {
      return;
    }

    results.faceswap_ens_mever_report.info.forEach((element) => {
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
  const uid = session && session.user ? session.user.id : null;

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
                {!!(
                  deepfakeScore &&
                  deepfakeScore.predictionScore &&
                  rectangles &&
                  rectanglesReady
                ) && (
                  <Grid item>
                    {rectangles.map((valueRectangle, keyRectangle) => {
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
                )}

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
                  onLoad={drawRectangles}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid item sm={12} md={6}>
            <Stack direction="column" p={4} spacing={4}>
              {!!(
                deepfakeScore &&
                deepfakeScore.predictionScore &&
                deepfakeScore.predictionScore >= 70
              ) && (
                <Typography variant="h5" sx={{ color: "red" }}>
                  {`${keyword("deepfake_image_detection_alert")} ` +
                    `${DeepfakeImageDetectionMethodNames[
                      deepfakeScore.methodName
                    ].name.toLowerCase()} ` +
                    `${keyword("deepfake_image_detection_alert_2")}`}
                </Typography>
              )}
              {(!deepfakeScore || !deepfakeScore.predictionScore) && (
                <Typography variant="h5" sx={{ color: "red" }}>
                  {keyword("deepfake_no_face_detection")}
                </Typography>
              )}
              {deepfakeScore && (
                // <Stack
                //   direction="column"
                //   p={4}
                //   justifyContent="flex-start"
                //   alignItems="flex-start"
                //   spacing={4}
                //   width="100%"
                //   sx={{ boxSizing: "border-box" }}
                //   position="relative"
                // >
                //   <Stack
                //     direction={{ sm: "column", md: "row" }}
                //     alignItems={{ sm: "start", md: "center" }}
                //     justifyContent="center"
                //     width="100%"
                //   >
                //     <Box m={2}></Box>
                //     <Stack
                //       direction="column"
                //       justifyContent="center"
                //       alignItems="center"
                //       spacing={2}
                //       ref={gaugeChartRef}
                //       p={2}
                //     >
                //       {deepfakeScore.predictionScore >
                //         DETECTION_THRESHOLDS.THRESHOLD_2 && (
                //         <Typography
                //           variant="h5"
                //           align="center"
                //           alignSelf="center"
                //           sx={{ color: "red" }}
                //         >
                //           {keyword(
                //             "synthetic_image_detection_generic_detection_text",
                //           )}
                //         </Typography>
                //       )}
                //       <Stack
                //         direction="column"
                //         justifyContent="center"
                //         alignItems="center"
                //       >
                //         <GaugeChart
                //           id={"gauge-chart"}
                //           animate={false}
                //           nrOfLevels={4}
                //           textColor={"black"}
                //           arcsLength={[
                //             (100 - DETECTION_THRESHOLDS.THRESHOLD_1) / 100,
                //             (DETECTION_THRESHOLDS.THRESHOLD_2 -
                //               DETECTION_THRESHOLDS.THRESHOLD_1) /
                //               100,
                //             (DETECTION_THRESHOLDS.THRESHOLD_3 -
                //               DETECTION_THRESHOLDS.THRESHOLD_2) /
                //               100,
                //             (100 - DETECTION_THRESHOLDS.THRESHOLD_3) / 100,
                //           ]}
                //           percent={deepfakeScore.predictionScore / 100}
                //           style={{
                //             minWidth: "250px",
                //             width: "50%",
                //             maxWidth: "500px",
                //           }}
                //         />

                //         <Stack
                //           direction="row"
                //           justifyContent="center"
                //           alignItems="center"
                //           spacing={10}
                //         >
                //           <Typography variant="subtitle2">
                //             {keyword("no_detection")}
                //           </Typography>
                //           <Typography variant="subtitle2">
                //             {keyword("detection")}
                //           </Typography>
                //         </Stack>
                //       </Stack>
                //     </Stack>
                //     <Box alignSelf={{ sm: "flex-start", md: "flex-end" }}>
                //       <Tooltip
                //         title={keyword(
                //           "synthetic_image_detection_download_gauge_button",
                //         )}
                //       >
                //         <IconButton
                //           color="primary"
                //           aria-label="download chart"
                //           onClick={async () =>
                //             await exportReactElementAsJpg(
                //               gaugeChartRef,
                //               "gauge_chart",
                //             )
                //           }
                //         >
                //           <Download />
                //         </IconButton>
                //       </Tooltip>
                //     </Box>
                //   </Stack>

                //   <GaugeChartModalExplanation
                //     keyword={keyword}
                //     keywordsArr={keywords}
                //     keywordLink={
                //       "synthetic_image_detection_scale_explanation_link"
                //     }
                //     keywordModalTitle={
                //       "synthetic_image_detection_scale_modal_explanation_title"
                //     }
                //     colors={colors}
                //   />

                //   <CustomAlertScore
                //     score={deepfakeScore.predictionScore}
                //     detectionType={undefined}
                //     toolName={"SyntheticImageDetection"}
                //     thresholds={DETECTION_THRESHOLDS}
                //   />

                //   <Box sx={{ width: "100%" }}>
                //   <Accordion defaultExpanded onChange={handleDetailsChange}>
                //     <AccordionSummary expandIcon={<ExpandMore />}>
                //       <Typography>{keyword("detailsPanelMessage")}</Typography>
                //     </AccordionSummary>
                //     <AccordionDetails>
                //       <Stack direction={"column"} spacing={4}>
                //         {syntheticImageScores.map((item, key) => {

                //           return (
                //             <Stack direction="column" spacing={4} key={key}>
                //               <Stack direction="column" spacing={2}>
                //                 <Stack
                //                   direction="row"
                //                   alignItems="flex-start"
                //                   justifyContent="space-between"
                //                 >
                //                   <Box>
                //                     <Typography
                //                       variant={"h6"}
                //                       sx={{ fontWeight: "bold" }}
                //                     >
                //                       {
                //                         DeepfakeImageDetectionMethodNames[
                //                           item.methodName
                //                         ].name
                //                       }
                //                     </Typography>
                //                     <Stack
                //                       direction={{ lg: "row", md: "column" }}
                //                       spacing={2}
                //                       alignItems="center"
                //                     >
                //                       <Stack direction="row" spacing={1}>
                //                         {item.isError ? (
                //                           <Alert severity="error">
                //                             {keyword(
                //                               "synthetic_image_detection_error_generic",
                //                             )}
                //                           </Alert>
                //                         ) : (
                //                           <>
                //                             <Typography>
                //                               {keyword(
                //                                 "synthetic_image_detection_probability_text",
                //                               )}{" "}
                //                             </Typography>
                //                             <Typography
                //                               sx={{
                //                                 color:
                //                                   getPercentageColorCode(
                //                                     predictionScore,
                //                                   ),
                //                               }}
                //                             >
                //                               {predictionScore}%
                //                             </Typography>
                //                           </>
                //                         )}
                //                       </Stack>
                //                       {!item.isError && (
                //                         <Chip
                //                           label={getAlertLabel(predictionScore)}
                //                           color={getAlertColor(predictionScore)}
                //                         />
                //                       )}
                //                     </Stack>
                //                   </Box>
                //                   <Stack>
                //                     {/*<Button*/}
                //                     {/*  href={*/}
                //                     {/*    DeepfakeImageDetectionMethodNames[*/}
                //                     {/*      item.methodName*/}
                //                     {/*    ].modelCardUrl*/}
                //                     {/*  }*/}
                //                     {/*>*/}
                //                     {/*  {keyword(*/}
                //                     {/*    "synthetic_image_detection_model_card",*/}
                //                     {/*  )}*/}
                //                     {/*</Button>*/}
                //                   </Stack>
                //                 </Stack>

                //                 <Box
                //                   p={2}
                //                   sx={{ backgroundColor: "#FAFAFA" }}
                //                   mb={2}
                //                 >
                //                   <Typography>
                //                     {
                //                       DeepfakeImageDetectionMethodNames[
                //                         item.methodName
                //                       ].description
                //                     }
                //                   </Typography>
                //                 </Box>
                //               </Stack>
                //               {syntheticImageScores.length > key + 1 && (
                //                 <Divider />
                //               )}
                //             </Stack>
                //           );
                //         })}
                //       </Stack>
                //     </AccordionDetails>
                //   </Accordion>
                // </Box>
                // </Stack>
                <GaugeChartResult
                  keyword={keyword}
                  scores={[deepfakeScore]}
                  methodNames={DeepfakeImageDetectionMethodNames}
                  detectionThresholds={DETECTION_THRESHOLDS}
                  resultsHaveErrors={false}
                  sanitizeDetectionPercentage={(n) => n}
                  gaugeExplanation={{ colors: colors, keywords: keywords }}
                  toolName={"Deepfake"}
                />
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
