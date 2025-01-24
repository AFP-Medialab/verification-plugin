import { useWavesurfer } from "@wavesurfer/react";
import React, { useEffect, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
import { useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Close, Download, ExpandMore } from "@mui/icons-material";

import { useTrackEvent } from "Hooks/useAnalytics";
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeSeriesScale,
  Title,
} from "chart.js";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { ROLES } from "../../../../constants/roles";
import CustomAlertScore from "../../../Shared/CustomAlertScore";
import GaugeChartModalExplanation from "../../../Shared/GaugeChartResults/GaugeChartModalExplanation";
import { exportReactElementAsJpg } from "../../../Shared/Utils/htmlUtils";

const LoccusResults = ({
  result,
  isInconclusive,
  url,
  handleClose,
  chunks,
}) => {
  dayjs.extend(duration);

  const keyword = i18nLoadNamespace("components/NavItems/tools/Loccus");

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const role = useSelector((state) => state.userSession.user.roles);

  const [voiceCloningScore, setVoiceCloningScore] = useState(null);
  const [voiceRecordingScore, setVoiceRecordingScore] = useState(null);

  const gaugeChartRef = useRef(null);
  const chunksChartRef = useRef(null);

  const DETECTION_TYPES = {
    VOICE_CLONING: "synthetic",
    VOICE_RECORDING: "replay",
  };
  const DETECTION_THRESHOLDS = {
    THRESHOLD_1: 10,
    THRESHOLD_2: 30,
    THRESHOLD_3: 60,
  };

  /**
   * Reformats a duration to prevent modulo operations done by dayjs when formatting duration values
   * i.e. print 61 minutes instead of 1 hour 61 minutes
   * @param duration {number} The duration in milliseconds
   */
  const printDurationInMinutesWithoutModulo = (duration) => {
    const minutes = Math.floor(duration / 60000).toString();
    const seconds = Math.floor((duration - minutes * 60000) / 1000).toString();

    return `${minutes}m ${seconds}s`;
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineController,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    TimeSeriesScale,
  );

  const chartConfig = {
    type: "line",
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      axis: "x",
    },

    plugins: {
      legend: {
        position: "bottom",
        display: false,
      },
      title: {
        display: true,
        text: keyword("loccus_chart_title"),
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.formattedValue + "%";
          },
          title: function (context) {
            return printDurationInMinutesWithoutModulo(context[0].parsed.x);
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
        },

        ticks: {
          callback: function (val) {
            return printDurationInMinutesWithoutModulo(val);
          },
        },
        reverse: !isCurrentLanguageLeftToRight,
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
        position: isCurrentLanguageLeftToRight ? "left" : "right",
      },
    },
  };

  let width, height, gradient;

  /**
   * Returns a CanvasGradient to stylize the chart with the given scale
   * @param {CanvasRenderingContext2D} ctx
   * @param chartArea
   * @returns {CanvasGradient}
   */
  const getChartGradient = (ctx, chartArea) => {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top,
      );
      gradient.addColorStop(0, "#00FF00");
      gradient.addColorStop(DETECTION_THRESHOLDS.THRESHOLD_1 / 100, "#82FF82");
      gradient.addColorStop(DETECTION_THRESHOLDS.THRESHOLD_2 / 100, "#FFB800");
      gradient.addColorStop(DETECTION_THRESHOLDS.THRESHOLD_3 / 100, "#FF0000");
    }

    return gradient;
  };

  const getChartDataFromChunks = (chunks) => {
    let labels = [];
    const datasetData = [];

    for (const chunk of chunks) {
      labels.push(dayjs.duration(chunk.startTime));
      labels.push(dayjs.duration(chunk.endTime));

      datasetData.push((1 - chunk.subscores.synthesis) * 100);
      datasetData.push((1 - chunk.subscores.synthesis) * 100);
    }

    return {
      labels: labels,
      datasets: [
        {
          data: datasetData,
          fill: false,
          borderColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            // Initial chart load
            if (!chartArea) return;

            return getChartGradient(ctx, chartArea);
          },
          stepped: true,
          tension: 0,
        },
      ],
    };
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

    const newVoiceCloningScore = (1 - result.subscores.synthesis) * 100;

    if (voiceCloningScore !== newVoiceCloningScore)
      setVoiceCloningScore(newVoiceCloningScore);

    const newVoiceRecordingScore = (1 - result.subscores.replay) * 100;
    if (voiceRecordingScore !== newVoiceRecordingScore)
      setVoiceRecordingScore(newVoiceRecordingScore);
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
    dragToSeek: true,
  });

  const keywords = [
    "loccus_scale_modal_explanation_rating_1",
    "loccus_scale_modal_explanation_rating_2",
    "loccus_scale_modal_explanation_rating_3",
    "loccus_scale_modal_explanation_rating_4",
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
          style={{ borderRadius: "4px 4p x 0px 0px" }}
          title={keyword("loccus_title")}
          action={
            <IconButton aria-label="close" onClick={handleClose}>
              <Close sx={{ color: "white" }} />
            </IconButton>
          }
        />
        <Grid2
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
        >
          <Grid2
            p={4}
            size={{
              sm: 12,
              md: 6,
            }}
          >
            <Box sx={{ width: "100%", position: "relative" }}>
              <Grid2
                container
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={4}
              >
                <Grid2 width="100%">
                  <div ref={audioContainerRef} />
                </Grid2>
                <Grid2 ref={chunksChartRef} width="100%" height="300px">
                  <Chart
                    type={"line"}
                    data={getChartDataFromChunks(chunks)}
                    options={chartConfig}
                  />
                </Grid2>
                <Grid2>
                  <Tooltip
                    title={keyword("loccus_download_chunks_chart_button")}
                  >
                    <IconButton
                      color="primary"
                      aria-label="download chart"
                      onClick={async () =>
                        await exportReactElementAsJpg(
                          chunksChartRef,
                          "loccus_detection_chart",
                        )
                      }
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Grid2>
              </Grid2>
            </Box>
          </Grid2>
          <Grid2
            size={{
              sm: 12,
              md: 6,
            }}
          >
            <Stack direction="column" spacing={4}>
              <Stack direction="column" p={4} spacing={4}>
                <Typography variant="h5">
                  {keyword("loccus_voice_cloning_detection_title")}
                </Typography>

                {!isInconclusive && (
                  <Stack
                    direction={{ sm: "column", md: "row" }}
                    alignItems={{ sm: "start", md: "center" }}
                    justifyContent="center"
                    width="100%"
                  >
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={0}
                      ref={gaugeChartRef}
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
                    <Box alignSelf={{ sm: "flex-start", md: "flex-end" }}>
                      <Tooltip title={keyword("loccus_download_gauge_button")}>
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
                )}

                {!isInconclusive && (
                  <GaugeChartModalExplanation
                    keyword={keyword}
                    keywordsArr={keywords}
                    keywordLink={"loccus_scale_explanation_link"}
                    keywordModalTitle={"loccus_scale_modal_explanation_title"}
                    colors={colors}
                  />
                )}

                <CustomAlertScore
                  score={voiceCloningScore}
                  detectionType={DETECTION_TYPES.VOICE_CLONING}
                  toolName={"Loccus"}
                  thresholds={DETECTION_THRESHOLDS}
                  isInconclusive={isInconclusive}
                />

                {!isInconclusive && (
                  <Typography>
                    {keyword("loccus_cloning_additional_explanation_text")}
                  </Typography>
                )}
              </Stack>

              {role.includes(ROLES.EXTRA_FEATURE) && (
                <>
                  <Divider />
                  <Box pb={4} pr={4}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel-additional-results-content"
                        id="panel-additional-results"
                      >
                        <Typography>
                          {keyword("loccus_additional_results")}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack direction="column" spacing={2}>
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
                              id={"gauge-chart-2"}
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
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </>
              )}
            </Stack>
          </Grid2>
        </Grid2>
      </Card>
    </Stack>
  );
};

export default LoccusResults;
