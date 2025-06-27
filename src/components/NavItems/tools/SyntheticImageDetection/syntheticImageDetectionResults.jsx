import React, { useEffect, useRef, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Download, ExpandMore } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import { ROLES } from "@/constants/roles";
import CopyButton from "@Shared/CopyButton";
import JsonBlock from "@Shared/JsonBlock";
import { exportReactElementAsJpg } from "@Shared/Utils/htmlUtils";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import CustomAlertScore from "../../../Shared/CustomAlertScore";
import GaugeChartModalExplanation from "../../../Shared/GaugeChartResults/GaugeChartModalExplanation";
import NddDatagrid from "./NddDatagrid";
import {
  DETECTION_THRESHOLDS,
  SyntheticImageDetectionAlgorithm,
  canUserDisplayAlgorithmResults,
  getSyntheticImageDetectionAlgorithmFromApiName,
  gigaGanWebpR50Grip,
  ldmWebpR50Grip,
  multiBfreeDino2reg4Grip,
  proGanWebpR50Grip,
  sd21BfreeDino2reg4Grip,
  sd21BfreeSiglipGrip,
  syntheticImageDetectionAlgorithms,
} from "./SyntheticImageDetectionAlgorithms";

/**
 * Returns the alert color code for the given percentage n
 * @param n {number}
 * @returns {"error" | "warning" | "success"}
 */
export const getAlertColor = (n) => {
  if (n >= DETECTION_THRESHOLDS.THRESHOLD_3) {
    return "error";
  } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_2) {
    return "warning";
  } else {
    return "success";
  }
};

export const getCerthColor = (n) => {
  if (n === "VERY_STRONG_EVIDENCE" || n === "STRONG_EVIDENCE") {
    return "error";
  } else if (n === "MODERATE_EVIDENCE") {
    return "warning";
  } else {
    return "success";
  }
};

export const getAlertLabel = (n, keyword) => {
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

export const getCerthLabel = (n, keyword) => {
  if (n === "VERY_STRONG_EVIDENCE") {
    return "CERTH — " + keyword("synthetic_image_detection_alert_label_4");
  } else if (n === "STRONG_EVIDENCE") {
    return "CERTH — " + keyword("synthetic_image_detection_alert_label_3");
  } else if (n === "MODERATE_EVIDENCE") {
    return "CERTH — " + keyword("synthetic_image_detection_alert_label_2");
  } else {
    return "CERTH — " + keyword("synthetic_image_detection_alert_label_1");
  }
};

export const getPercentageColorCode = (n) => {
  if (n >= DETECTION_THRESHOLDS.THRESHOLD_3) {
    return "#FF0000";
  } else if (n >= DETECTION_THRESHOLDS.THRESHOLD_2) {
    return "#FFAA00";
  } else {
    return "green";
  }
};

class NddResult {
  /**
   *
   * @param id {number}
   * @param image {string}
   * @param archiveUrl {string}
   * @param imageUrls {string}
   * @param detectionResults {SyntheticImageDetectionAlgorithmResult[]}
   */
  constructor(id, image, archiveUrl, imageUrls, detectionResults) {
    this.id = id;
    this.image = image;
    this.archiveUrl = archiveUrl;
    this.imageUrls = imageUrls;
    this.detectionResults = detectionResults;
  }
}

/**
 *
 * @param results
 * @param url
 * @param handleClose
 * @param nd
 * @param c2paData
 * @param imageType {Blob.type}
 * @returns {Element}
 * @constructor
 */
const SyntheticImageDetectionResults = ({
  results,
  url,
  handleClose,
  nd,
  imageType,
  c2paData,
}) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  const role = useSelector((state) => state.userSession.user.roles);

  class SyntheticImageDetectionAlgorithmResult extends SyntheticImageDetectionAlgorithm {
    /**
     *
     * @param syntheticImageDetectionAlgorithm {SyntheticImageDetectionAlgorithm}
     * @param predictionScore {number}
     * @param isError {boolean}
     * @param certhLabel {string} the detection label provided by the API
     */
    constructor(
      syntheticImageDetectionAlgorithm,
      predictionScore,
      isError,
      certhLabel,
    ) {
      super(
        syntheticImageDetectionAlgorithm.apiServiceName,
        syntheticImageDetectionAlgorithm.name,
        syntheticImageDetectionAlgorithm.description,
        syntheticImageDetectionAlgorithm.rolesNeeded,
      );
      this.predictionScore = predictionScore;
      this.isError = isError;
      this.certhLabel = certhLabel;
    }
  }

  const imgElement = React.useRef(null);

  const imgContainerRef = useRef(null);

  const [syntheticImageScores, setSyntheticImageScores] = useState([]);

  const [maxScore, setMaxScore] = useState(0);

  const [resultsHaveErrors, setResultsHaveErrors] = useState(false);

  const gaugeChartRef = useRef(null);

  const [showCerthLabels, setShowCerthLabels] = useState(true);

  const handleToggleCerthLabel = (event) => {
    setShowCerthLabels(event.target.checked);
  };

  useEffect(() => {
    setResultsHaveErrors(false);
    let res = [];

    for (const algorithm of syntheticImageDetectionAlgorithms) {
      if (!canUserDisplayAlgorithmResults(role, algorithm)) continue;

      const algorithmReport = results[algorithm.apiServiceName + "_report"];

      if (algorithmReport) {
        // Display iff the user has the permissions to see the content

        if (
          imageType &&
          imageType === "image/webp" &&
          (algorithm.apiServiceName === ldmWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === proGanWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === gigaGanWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName ===
              sd21BfreeDino2reg4Grip.apiServiceName ||
            algorithm.apiServiceName ===
              multiBfreeDino2reg4Grip.apiServiceName ||
            algorithm.apiServiceName === sd21BfreeSiglipGrip.apiServiceName)
        ) {
          res.push(
            new SyntheticImageDetectionAlgorithmResult(
              algorithm,
              !algorithmReport.prediction
                ? 0
                : algorithmReport.prediction * 100,
              algorithmReport.prediction === undefined,
              algorithmReport.label,
            ),
          );
        } else if (
          imageType &&
          imageType !== "image/webp" &&
          (algorithm.apiServiceName === ldmWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === proGanWebpR50Grip.apiServiceName ||
            algorithm.apiServiceName === gigaGanWebpR50Grip.apiServiceName)
        ) {
        } else {
          res.push(
            new SyntheticImageDetectionAlgorithmResult(
              algorithm,
              !algorithmReport.prediction
                ? 0
                : algorithmReport.prediction * 100,
              algorithmReport.prediction === undefined,
              algorithmReport.label,
            ),
          );
        }
      }
    }

    res = res
      .filter((i) => i !== undefined)
      .sort((a, b) => {
        const scoreA = a.isError
          ? -Infinity
          : sanitizeDetectionPercentage(a.predictionScore);
        const scoreB = b.isError
          ? -Infinity
          : sanitizeDetectionPercentage(b.predictionScore);

        return scoreB - scoreA;
      });

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
  }, [results, imageType]);

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
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

  /**
   * Returns a percentage between 1 and 99 for display purposes. We exclude 0 and 100 values.
   * @param percentage {number}
   * @returns {number | Error}
   */
  const sanitizeDetectionPercentage = (percentage) => {
    if (typeof percentage !== "number") {
      return new Error(
        `[sanitizeDetectionPercentage] Error: The percentage is not a number.`,
      );
    }

    const rounded =
      percentage > 50 ? Math.round(percentage) : Math.floor(percentage);

    if (rounded >= 100) return 99;
    if (rounded <= 0) return 1;

    return rounded;
  };
  const [detailsPanelMessage, setDetailsPanelMessage] = useState(
    "synthetic_image_detection_additional_results",
  );
  const handleDetailsChange = () => {
    detailsPanelMessage === "synthetic_image_detection_additional_results_hide"
      ? setDetailsPanelMessage("synthetic_image_detection_additional_results")
      : setDetailsPanelMessage(
          "synthetic_image_detection_additional_results_hide",
        );
  };

  const [nddDetailsPanelMessage, setNddDetailsPanelMessage] = useState(
    "synthetic_image_detection_ndd_additional_results_hide",
  );
  const handleNddDetailsChange = () => {
    nddDetailsPanelMessage ===
    "synthetic_image_detection_ndd_additional_results_hide"
      ? setNddDetailsPanelMessage(
          "synthetic_image_detection_ndd_additional_results",
        )
      : setNddDetailsPanelMessage(
          "synthetic_image_detection_ndd_additional_results_hide",
        );
  };

  const keywords = [
    "gauge_scale_modal_explanation_rating_1",
    "gauge_scale_modal_explanation_rating_2",
    "gauge_scale_modal_explanation_rating_3",
    "gauge_scale_modal_explanation_rating_4",
  ];
  const colors = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

  const [filteredNddRows, setFilteredNddRows] = useState([]);

  /**
   *
   * @param nddResults
   * @returns {NddResult[]}
   */
  const getNddRows = (nddResults) => {
    let rows = [];
    let newIndex = 0;
    for (let i = 0; i < nddResults.length; i += 1) {
      const res = nddResults[i];
      let detectionResults = [];
      for (const detection of Object.keys(res.detections)) {
        const d = new SyntheticImageDetectionAlgorithmResult(
          getSyntheticImageDetectionAlgorithmFromApiName(detection),
          sanitizeDetectionPercentage(res.detections[detection] * 100),
          false,
        );

        // Display iff the user has the permissions to see the content
        if (!canUserDisplayAlgorithmResults(role, d)) continue;

        //TODO: Iff the nd result is a webp image and has detection for a webp algorithm, display the webp algorithm,
        // else, filter out the webp algorithm

        detectionResults.push(d);
      }

      if (detectionResults.length === 0) {
        continue;
      }

      newIndex++;

      rows.push(
        new NddResult(
          newIndex,
          res.archive_url,
          res.archive_url,
          res.origin_urls,
          detectionResults,
        ),
      );
    }
    return rows;
  };

  const updateNddRows = (nddResults) => {
    const rows = getNddRows(nddResults);

    setFilteredNddRows(rows);
  };

  useEffect(() => {
    if (nd && nd.similar_media && nd.similar_media.length > 0)
      updateNddRows(nd.similar_media);
  }, [nd]);

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Stack direction="column" spacing={4}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6">
                {keyword("synthetic_image_detection_title")}
              </Typography>

              {role.includes(ROLES.EXTRA_FEATURE) && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={showCerthLabels}
                      onChange={handleToggleCerthLabel}
                      color="primary"
                    />
                  }
                  label="Show CERTH labels"
                />
              )}
            </Stack>

            <IconButton aria-label="close" onClick={handleClose} sx={{ p: 1 }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Grid
            container
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <Grid
              container
              direction="column"
              size={{ sm: 12, md: 6 }}
              spacing={4}
              sx={{
                justifyContent: "flex-start",
              }}
            >
              <Grid
                sx={{
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    ref={imgContainerRef}
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      maxWidth: "100%",
                    }}
                  >
                    <Stack direction="column">
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
                      <List dense={true}>
                        <ListItem>
                          <ListItemText
                            primary={keyword(
                              "synthetic_image_detection_image_type",
                            )}
                            secondary={imageType}
                          />
                        </ListItem>
                      </List>
                    </Stack>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            <Grid size={{ sm: 12, md: 6 }}>
              {syntheticImageScores.length > 0 ? (
                <Stack
                  direction="column"
                  spacing={4}
                  sx={{
                    p: 4,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    position: "relative",
                    boxSizing: "border-box",
                  }}
                >
                  <Stack
                    direction={{ sm: "column", md: "row" }}
                    sx={{
                      alignItems: { sm: "start", md: "center" },
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        m: 2,
                      }}
                    ></Box>
                    <Stack
                      direction="column"
                      spacing={2}
                      ref={gaugeChartRef}
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="h5"
                        align="center"
                        sx={{
                          alignSelf: "center",
                          color: "red",
                        }}
                      >
                        {maxScore > DETECTION_THRESHOLDS.THRESHOLD_2
                          ? keyword(
                              "synthetic_image_detection_generic_detection_text",
                            )
                          : keyword(
                              "synthetic_image_detection_generic_inconclusive_text",
                            )}
                      </Typography>

                      {filteredNddRows && filteredNddRows.length > 0 && (
                        <Typography
                          variant="h5"
                          align="center"
                          sx={{
                            alignSelf: "center",
                            color: "red",
                          }}
                        >
                          {keyword(
                            "synthetic_image_detection_generic_detection_text_ndd",
                          )}
                        </Typography>
                      )}

                      {c2paData && (
                        <Typography
                          variant="h5"
                          align="center"
                          sx={{
                            alignSelf: "center",
                            color: "red",
                          }}
                        >
                          {"C2PA metadata with GenAI actions detected"}
                        </Typography>
                      )}

                      <Stack
                        direction="column"
                        sx={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <GaugeChart
                          id={"gauge-chart"}
                          animate={false}
                          nrOfLevels={4}
                          textColor={
                            resolvedMode === "dark" ? "#FFFFFF" : "#000000"
                          }
                          arcsLength={[
                            (100 - DETECTION_THRESHOLDS.THRESHOLD_1) / 100,
                            (DETECTION_THRESHOLDS.THRESHOLD_2 -
                              DETECTION_THRESHOLDS.THRESHOLD_1) /
                              100,
                            (DETECTION_THRESHOLDS.THRESHOLD_3 -
                              DETECTION_THRESHOLDS.THRESHOLD_2) /
                              100,
                            (100 - DETECTION_THRESHOLDS.THRESHOLD_3) / 100,
                          ]}
                          percent={syntheticImageScores ? maxScore / 100 : 0}
                          style={{
                            minWidth: "250px",
                            width: "50%",
                            maxWidth: "500px",
                          }}
                        />

                        <Stack
                          direction="row"
                          spacing={10}
                          sx={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {keyword(
                              "synthetic_image_detection_gauge_no_detection",
                            )}
                          </Typography>
                          <Typography variant="subtitle2">
                            {keyword(
                              "synthetic_image_detection_gauge_detection",
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Box
                      sx={{
                        alignSelf: { sm: "flex-start", md: "flex-end" },
                      }}
                    >
                      <Tooltip
                        title={keyword(
                          "synthetic_image_detection_download_gauge_button",
                        )}
                      >
                        <IconButton
                          color="primary"
                          aria-label="download chart"
                          onClick={async () =>
                            await exportReactElementAsJpg(
                              gaugeChartRef,
                              "gauge_chart",
                            )
                          }
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>

                  <GaugeChartModalExplanation
                    keyword={keyword}
                    keywordsArr={keywords}
                    keywordLink={
                      "synthetic_image_detection_scale_explanation_link"
                    }
                    keywordModalTitle={
                      "synthetic_image_detection_scale_modal_explanation_title"
                    }
                    colors={colors}
                  />

                  <CustomAlertScore
                    score={syntheticImageScores ? maxScore : 0}
                    detectionType={undefined}
                    toolName={"SyntheticImageDetection"}
                    thresholds={DETECTION_THRESHOLDS}
                  />

                  {resultsHaveErrors && (
                    <Alert severity="error">
                      {keyword("synthetic_image_detection_algorithms_errors")}
                    </Alert>
                  )}

                  {nd && nd.similar_media && nd.similar_media.length > 0 && (
                    <Alert icon={false} severity="error">
                      <Typography variant="body1">
                        {keyword("synthetic_image_detection_ndd_info")}
                      </Typography>
                    </Alert>
                  )}
                </Stack>
              ) : (
                <Stack
                  direction="column"
                  spacing={4}
                  sx={{
                    p: 4,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Alert severity="error">
                    {keyword("synthetic_image_detection_error_generic")}
                  </Alert>
                </Stack>
              )}
            </Grid>
            <Grid container size={{ xs: 12 }} spacing={4}>
              {c2paData && (
                <Grid
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      pl: 4,
                      pr: 4,
                    }}
                  >
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{"C2PA GenAI Metadata"}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack direction={"column"} spacing={4}>
                          <Table aria-label="c2pa genAI metadata table">
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {"App or device used"}
                                </TableCell>
                                <TableCell>
                                  {c2paData[0]?.assertion?.data?.actions?.[1]
                                    ?.softwareAgent?.name ||
                                    c2paData[0]?.softwareAgent?.name}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {"AI tool used"}
                                </TableCell>
                                <TableCell>
                                  {c2paData[0]?.assertion?.data?.actions?.[0]
                                    ?.softwareAgent?.name ||
                                    c2paData[0]?.softwareAgent?.name}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>

                          {role.includes(ROLES.EXTRA_FEATURE) && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <JsonBlock>
                                {JSON.stringify(c2paData, null, 2)}
                              </JsonBlock>
                              <CopyButton
                                strToCopy={JSON.stringify(c2paData, null, 2)}
                                labelBeforeCopy={"Copy JSON"}
                                labelAfterCopy={"Copied!"}
                              />
                            </Box>
                          )}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Grid>
              )}

              {filteredNddRows && filteredNddRows.length > 0 && (
                <Grid
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      pl: 4,
                      pr: 4,
                    }}
                  >
                    <Accordion
                      defaultExpanded
                      onChange={handleNddDetailsChange}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>
                          {keyword(nddDetailsPanelMessage)}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack direction={"column"} spacing={4}>
                          <NddDatagrid rows={filteredNddRows} />
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Grid>
              )}

              <Grid sx={{ width: "100%" }}>
                <Box
                  sx={{
                    pl: 4,
                    pr: 4,
                  }}
                >
                  <Accordion
                    defaultExpanded={false}
                    onChange={handleDetailsChange}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>{keyword(detailsPanelMessage)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction={"column"} spacing={4}>
                        {syntheticImageScores.map((item, key) => {
                          let predictionScore;

                          if (typeof item.predictionScore === "number") {
                            predictionScore = sanitizeDetectionPercentage(
                              item.predictionScore,
                            );
                          }

                          return (
                            <Stack direction="column" spacing={4} key={key}>
                              <Stack direction="column" spacing={2}>
                                <Stack
                                  direction="row"
                                  sx={{
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      variant={"h6"}
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      {keyword(item.name)}
                                    </Typography>
                                    <Stack
                                      direction={{ lg: "row", md: "column" }}
                                      spacing={2}
                                      sx={{
                                        alignItems: "center",
                                      }}
                                    >
                                      <Stack direction="row" spacing={1}>
                                        {item.isError ? (
                                          <Alert severity="error">
                                            {keyword(
                                              "synthetic_image_detection_error_generic",
                                            )}
                                          </Alert>
                                        ) : (
                                          <>
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
                                          </>
                                        )}
                                      </Stack>
                                      {!item.isError && (
                                        <>
                                          <Chip
                                            label={getAlertLabel(
                                              predictionScore,
                                              keyword,
                                            )}
                                            color={getAlertColor(
                                              predictionScore,
                                            )}
                                          />
                                          {showCerthLabels &&
                                            role.includes(
                                              ROLES.EXTRA_FEATURE,
                                            ) && (
                                              <Chip
                                                variant="outlined"
                                                label={getCerthLabel(
                                                  item.certhLabel,
                                                  keyword,
                                                )}
                                                color={getCerthColor(
                                                  item.certhLabel,
                                                )}
                                              />
                                            )}
                                        </>
                                      )}
                                    </Stack>
                                  </Box>
                                </Stack>

                                <Box
                                  sx={{
                                    p: 2,
                                    mb: 2,

                                    backgroundColor:
                                      "var(--mui-palette-background-paper)",
                                  }}
                                >
                                  <Typography>
                                    {keyword(item.description)}
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
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SyntheticImageDetectionResults;
