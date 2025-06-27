import React, { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import HighlightedText from "@/components/NavItems/MachineGeneratedText/components/HighlightedText";
import GaugeChartResult from "@Shared/GaugeChartResults/GaugeChartResult";
import { JsonBlock } from "@Shared/JsonBlock";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

/**
 * Displays analysis results for a submitted text, including detection scores,
 * a gauge chart visualization, highlighted sentences/chunks, and raw JSON output.
 *
 * @component
 * @param {Object} props
 * @param {string} props.submittedText - The full text submitted for analysis.
 * @param {Object} props.mutationChunks - React Query mutation result for chunk-based analysis.
 * @param {Object} props.mutationSentences - React Query mutation result for sentence-based analysis.
 * @returns {JSX.Element} Rendered UI component showing results and visualizations.
 */
const MachineGeneratedTextResults = ({
  submittedText,
  mutationChunks,
  mutationSentences,
}) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/MachineGeneratedText",
  );

  // Testing the UI for now, to remove when the standalone tool will not be for testing purposes anymore
  const assistantKeyword = i18nLoadNamespace(
    "components/NavItems/tools/Assistant",
  );

  const [activeTab, setActiveTab] = useState("sentences");

  const DETECTION_THRESHOLDS = {
    THRESHOLD_1: 5.0,
    THRESHOLD_2: 50.0,
    THRESHOLD_3: 95.0,
  };

  const arcsLength = [0.05, 0.45, 0.45, 0.05];

  const keywords = [
    "gauge_scale_modal_explanation_rating_1",
    "gauge_scale_modal_explanation_rating_2",
    "gauge_scale_modal_explanation_rating_3",
    "gauge_scale_modal_explanation_rating_4",
  ];

  const colors = ["#00FF00", "#AAFF03", "#FFA903", "#FF0000"];

  const MachineGeneratedTextMethodNames = {
    machineGeneratedText: {
      name: keyword("machine_generated_text_title"),
      description: keyword("machine_generated_text_tooltip"),
    },
  };

  const MachineGeneratedTextMethodNamesResults = {
    methodName: "machineGeneratedText",
    predictionScore: mutationChunks?.data?.entities?.mgt_overall_score
      ? Number(mutationChunks.data.entities.mgt_overall_score[0].score) * 100
      : null,
  };

  return (
    <Stack direction="column" spacing={4}>
      <Card variant="outlined">
        <Box p={4} sx={{ position: "relative" }}>
          <Stack direction="column" spacing={4}>
            <Stack direction="column" spacing={2}>
              <Typography>
                {"Detection score (chunks): " +
                  Math.round(
                    Number(
                      mutationChunks.data.entities.mgt_overall_score[0].score,
                    ) * 100,
                  ) +
                  "%"}
              </Typography>

              <Typography>
                {"Detection score (sentences): " +
                  Math.round(
                    Number(
                      mutationSentences.data.entities.mgt_overall_score[0]
                        .score,
                    ) * 100,
                  ) +
                  "%"}
              </Typography>

              {mutationChunks.data.entities.mgt_overall_score && (
                <GaugeChartResult
                  keyword={assistantKeyword}
                  scores={[MachineGeneratedTextMethodNamesResults]}
                  methodNames={MachineGeneratedTextMethodNames}
                  detectionThresholds={DETECTION_THRESHOLDS}
                  arcsLength={arcsLength}
                  resultsHaveErrors={false}
                  sanitizeDetectionPercentage={(n) => Math.round(n)}
                  gaugeExplanation={{ colors: colors, keywords: keywords }}
                  toolName="Assistant" // this points to the correct translations .tsv file
                  detectionType={"machine_generated_text"}
                />
              )}
            </Stack>

            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              aria-label="data selection tabs"
            >
              <Tab label="Sentences" value="sentences" />
              <Tab label="Chunks" value="chunks" />
            </Tabs>

            <HighlightedText
              text={submittedText}
              chunks={
                activeTab === "sentences"
                  ? mutationSentences.data
                  : mutationChunks.data
              }
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <JsonBlock
                jsonString={JSON.stringify(
                  activeTab === "sentences"
                    ? mutationSentences.data
                    : mutationChunks.data,
                  null,
                  2,
                )}
              />
            </Box>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
};

export default MachineGeneratedTextResults;
