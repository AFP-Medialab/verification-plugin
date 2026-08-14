import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { eld } from "eld/small";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const CONFIDENCE_THRESHOLD = 0.3;
const UNIDENTIFIED_KEY = "und";

const getLanguageName = (code, languageMap, unidentifiedLabel) => {
  if (code === UNIDENTIFIED_KEY) return unidentifiedLabel;
  return languageMap[code]?.display_name ?? code;
};

export const generateLanguageDetectionData = (
  selectedContent,
  { languageMap = {}, unidentifiedLabel = "Unidentified" } = {},
) => {
  const counts = new Map();
  const entriesByLang = new Map();
  const scoresByLang = new Map();

  for (const entry of selectedContent) {
    if (!entry.text) continue;
    const result = eld.detect(entry.text);

    let lang = UNIDENTIFIED_KEY;
    let score = null;

    if (result.language && result.isReliable()) {
      const detectedScore = result.getScores()[result.language] ?? 0;
      if (detectedScore >= CONFIDENCE_THRESHOLD) {
        lang = result.language;
        score = detectedScore;
      }
    }

    counts.set(lang, (counts.get(lang) ?? 0) + 1);
    if (!entriesByLang.has(lang)) entriesByLang.set(lang, []);
    entriesByLang.get(lang).push(entry);

    if (score !== null) {
      if (!scoresByLang.has(lang)) scoresByLang.set(lang, []);
      scoresByLang.get(lang).push(score);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => {
      if (a[0] === UNIDENTIFIED_KEY) return 1;
      if (b[0] === UNIDENTIFIED_KEY) return -1;
      return b[1] - a[1];
    })
    .map(([lang, count]) => {
      const scores = scoresByLang.get(lang);
      const avgConfidence = scores
        ? scores.reduce((s, v) => s + v, 0) / scores.length
        : null;
      return {
        language: lang,
        name: getLanguageName(lang, languageMap, unidentifiedLabel),
        count,
        avgConfidence,
        entries: entriesByLang.get(lang) ?? [],
      };
    });
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, count, language, avgConfidence, _total } = payload[0].payload;
    const pct = _total ? ((count / _total) * 100).toFixed(1) : "";
    return (
      <Box
        sx={{
          background: "white",
          border: "1px solid #ccc",
          borderRadius: 1,
          p: 1,
          color: "rgba(0, 0, 0, 0.87)",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {name} ({language})
        </Typography>
        <Typography variant="body2">
          {`${count} tweets${pct ? ` (${pct}%)` : ""}`}
        </Typography>
        {avgConfidence !== null && (
          <Typography variant="body2" color="text.secondary">
            {`Avg. confidence: ${(avgConfidence * 100).toFixed(1)}%`}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

export const LanguageDetectionChart = ({
  result,
  keyword,
  languageMap = {},
  unidentifiedLabel = "Unidentified",
  setDetailContent,
  setOpenDetailModal,
}) => {
  if (!result || result.length === 0) return null;

  const total = result.reduce((sum, d) => sum + d.count, 0);
  const dataWithTotal = result.map((d) => ({
    ...d,
    name: getLanguageName(d.language, languageMap, unidentifiedLabel),
    _total: total,
  }));

  const handleBarClick = ({ activePayload }) => {
    if (activePayload?.[0]?.payload?.entries) {
      setDetailContent(activePayload[0].payload.entries);
      setOpenDetailModal(true);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ overflowX: "auto" }}>
        <BarChart
          data={dataWithTotal}
          width={Math.max(dataWithTotal.length * 80, 800)}
          height={400}
          margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
          onClick={handleBarClick}
          style={{ cursor: "pointer" }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={120}
          />
          <YAxis
            tickFormatter={(v) =>
              Intl.NumberFormat("en-US", { notation: "compact" }).format(v)
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(128, 128, 128, 0.2)" }}
          />
          <Bar
            dataKey="count"
            fill="#8884d8"
            name={keyword("snaTools_languageDetectionBarLabel")}
          />
        </BarChart>
      </Box>
    </Box>
  );
};
