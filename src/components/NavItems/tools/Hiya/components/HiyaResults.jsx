import { useWavesurfer } from "@wavesurfer/react";
import React, { useMemo, useRef } from "react";
import { Chart } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
import { useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Download } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import CustomAlertScore from "@Shared/CustomAlertScore";
import GaugeChartModalExplanation from "@Shared/GaugeChartResults/GaugeChartModalExplanation";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { exportReactElementAsJpg } from "@Shared/Utils/htmlUtils";
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
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom";

import {
  DETECTION_COLORS,
  DETECTION_EXPLANATION_KEYWORDS,
  DETECTION_THRESHOLDS,
  DETECTION_TYPES,
  WAVESURFER_CONFIG,
  WAVESURFER_ZOOM_CONFIG,
} from "../constants";
import { useHiyaAnalytics } from "../hooks/useHiyaAnalytics";
import { useRegionsUpdater } from "../hooks/useRegionsUpdater";
import { useScoreCalculation } from "../hooks/useScoreCalculation";
import { useWavesurferRegions } from "../hooks/useWavesurferRegions";
import {
  createChartConfig,
  getChartDataFromChunks,
  getChartGradient,
  printDurationInMinutesWithoutModulo,
} from "../utils";

const HiyaResults = ({ result, isInconclusive, url, handleClose, chunks }) => {
  dayjs.extend(duration);

  const keyword = i18nLoadNamespace("components/NavItems/tools/Hiya");

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const gaugeChartRef = useRef(null);
  const chunksChartRef = useRef(null);

  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // Use extracted hooks
  useHiyaAnalytics(url);
  const voiceCloningScore = useScoreCalculation(result);

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

  // Create chart configuration using imported utility
  const chartConfig = createChartConfig(
    resolvedMode,
    isCurrentLanguageLeftToRight,
    keyword,
    printDurationInMinutesWithoutModulo,
  );

  // Cache for chart gradient to improve performance
  const gradientCache = useRef({});

  const audioContainerRef = useRef();

  // Get a stable regions plugin instance
  const { regionsPlugin } = useWavesurferRegions();

  // Hook to get the audio waveform using imported constants
  const { wavesurfer, isReady } = useWavesurfer({
    container: audioContainerRef,
    url: url,
    ...WAVESURFER_CONFIG,
    plugins: useMemo(
      () => [regionsPlugin, ZoomPlugin.create(WAVESURFER_ZOOM_CONFIG)],
      [regionsPlugin],
    ),
  });

  // Update regions when wavesurfer is ready and chunks change
  useRegionsUpdater(wavesurfer, isReady, chunks, regionsPlugin);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Card variant="outlined" sx={{ width: "100%" }}>
        <Box
          sx={{
            m: 2,
          }}
        >
          <CardHeader
            style={{ borderRadius: "4px 4p x 0px 0px" }}
            title={keyword("hiya_title")}
            action={
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ p: 1 }}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-evenly",
              alignItems: "flex-start",
            }}
          >
            <Grid
              size={{
                sm: 12,
                md: 6,
              }}
              sx={{
                p: 4,
              }}
            >
              <Box sx={{ width: "100%", position: "relative" }}>
                <Grid
                  container
                  direction="column"
                  spacing={4}
                  sx={{
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Grid
                    sx={{
                      width: "100%",
                    }}
                  >
                    <div ref={audioContainerRef} />
                  </Grid>
                  <Grid
                    ref={chunksChartRef}
                    sx={{
                      width: "100%",
                      height: "300px",
                    }}
                  >
                    <Chart
                      type={"line"}
                      data={{
                        ...getChartDataFromChunks(chunks),
                        datasets: getChartDataFromChunks(chunks).datasets.map(
                          (dataset) => ({
                            ...dataset,
                            borderColor: (context) => {
                              const chart = context.chart;
                              const { ctx, chartArea } = chart;
                              if (!chartArea) return;
                              return getChartGradient(
                                ctx,
                                chartArea,
                                gradientCache.current,
                              );
                            },
                          }),
                        ),
                      }}
                      options={chartConfig}
                    />
                  </Grid>
                  <Grid>
                    <Tooltip
                      title={keyword("hiya_download_chunks_chart_button")}
                    >
                      <IconButton
                        color="primary"
                        aria-label="download chart"
                        onClick={async () =>
                          await exportReactElementAsJpg(
                            chunksChartRef,
                            "hiya_detection_chart",
                          )
                        }
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid
              size={{
                sm: 12,
                md: 6,
              }}
            >
              <Stack direction="column" spacing={4}>
                <Stack
                  direction="column"
                  spacing={4}
                  sx={{
                    p: 4,
                  }}
                >
                  <Typography variant="h5">
                    {keyword("hiya_voice_cloning_detection_title")}
                  </Typography>

                  {!isInconclusive && (
                    <Stack
                      direction={{ sm: "column", md: "row" }}
                      sx={{
                        alignItems: { sm: "start", md: "center" },
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Stack
                        direction="column"
                        spacing={0}
                        ref={gaugeChartRef}
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
                            resolvedMode === "dark" ? "white" : "black"
                          }
                          arcsLength={[0.1, 0.2, 0.3, 0.4]}
                          percent={voiceCloningScore / 100}
                          style={{ width: 250 }}
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
                            {keyword("hiya_gauge_no_detection")}
                          </Typography>
                          <Typography variant="subtitle2">
                            {keyword("hiya_gauge_detection")}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Box
                        sx={{
                          alignSelf: { sm: "flex-start", md: "flex-end" },
                        }}
                      >
                        <Tooltip title={keyword("hiya_download_gauge_button")}>
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
                      keywordsArr={DETECTION_EXPLANATION_KEYWORDS}
                      keywordLink={"hiya_scale_explanation_link"}
                      keywordModalTitle={"hiya_scale_modal_explanation_title"}
                      colors={DETECTION_COLORS}
                    />
                  )}

                  <CustomAlertScore
                    score={voiceCloningScore}
                    detectionType={DETECTION_TYPES.VOICE_CLONING}
                    toolName={"Hiya"}
                    thresholds={DETECTION_THRESHOLDS}
                    isInconclusive={isInconclusive}
                  />

                  {!isInconclusive && (
                    <Typography>
                      {keyword("hiya_cloning_additional_explanation_text")}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Stack>
  );
};
export default HiyaResults;
