import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import {
  ThresholdSlider,
  createGaugeExplanation,
  getMgtColours,
  getSubjectivityColours,
  primaryRgb,
  rgbToLuminance,
  rgbToString,
  treeMapToElements,
  wrapPlainTextSpan,
} from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { setImportantSentenceThreshold } from "@/redux/actions/tools/assistantActions";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import { createGaugeChart } from "./assistantUtils";

export default function AssistantTextClassification({
  text,
  classification,
  overallClassification,
  titleText = "",
  categoriesTooltipContent = "",
  configs = {
    // machine generated text and subjectivity
    greenRgb: [0, 255, 0],
    orangeRgb: [255, 170, 0],
    redRgb: [255, 0, 0],
    greenRgbDark: [78, 255, 78],
    orangeRgbDark: [255, 189, 62],
    redRgbDark: [255, 78, 78],
    // machine generated text
    lightGreenRgb: [170, 255, 0],
    lightGreenRgbDark: [210, 255, 121],
    orderedCategories: [
      "highly_likely_human",
      "likely_human",
      "likely_machine",
      "highly_likely_machine",
    ],
  },
  textHtmlMap = null,
  credibilitySignal = "",
}) {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // titles
  const newsFramingTitle = keyword("news_framing_title");
  const newsGenreTitle = keyword("news_genre_title");
  const subjectivityTitle = keyword("subjectivity_title");
  const machineGeneratedTextTitle = keyword("machine_generated_text_title");

  // slider
  const importantSentenceThreshold = useSelector(
    (state) => state.assistant.importantSentenceThreshold,
  );

  const handleSliderChange = (event, newValue) => {
    dispatch(setImportantSentenceThreshold(newValue));
  };

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // predefined labels
  const fullTextScoreLabel = "full_text_score";
  const importantSentenceKey = "Important_Sentence";
  const mgtOverallScoreLabel = "mgt_overall_score";

  // define colours
  let mgtColours, mgtColoursDark, orderedCategories;
  let subjectivityColours, subjectivityColoursDark;
  let confidenceThresholdLow;
  if (
    credibilitySignal === newsFramingTitle ||
    credibilitySignal === newsGenreTitle
  ) {
    confidenceThresholdLow = configs.confidenceThresholdLow;
  } else if (credibilitySignal === machineGeneratedTextTitle) {
    [mgtColours, mgtColoursDark] = getMgtColours(configs);
    orderedCategories = configs.orderedCategories;
  } else if (credibilitySignal === subjectivityTitle) {
    [subjectivityColours, subjectivityColoursDark] =
      getSubjectivityColours(configs);
  }

  // define sentence slider thresholds
  const sentenceThresholdLow = importantSentenceThreshold / 100.0;
  const sentenceThresholdHigh = 99;

  // filtering for all credibility signals
  let filteredSentences = [];
  let filteredCategories = {};

  // Separate important sentences from categories, filter by threshold
  for (let label in classification) {
    if (label === importantSentenceKey) {
      // Filter sentences above slider importanceThresholdLow unless machine generated text
      const sentenceIndices = classification[label];
      for (let i = 0; i < sentenceIndices.length; i++) {
        if (credibilitySignal === machineGeneratedTextTitle) {
          filteredSentences.push(sentenceIndices[i]);
        } else if (
          sentenceIndices[i].score >=
          importantSentenceThreshold / 100.0
        ) {
          filteredSentences.push(sentenceIndices[i]);
        }
      }
    } else {
      // Filter categories above confidenceThreshold unless machine generated text or subjectivity
      if (
        credibilitySignal === machineGeneratedTextTitle ||
        credibilitySignal === subjectivityTitle
      ) {
        filteredCategories[label] = classification[label];
      } else if (
        // news framing and news genre
        classification[label][0].score >= confidenceThresholdLow
      ) {
        filteredCategories[label] = classification[label];
      }
    }
  }

  // check if categories or sentences is empty
  if (Object.keys(filteredCategories).length === 0) {
    filteredSentences = [];
  }
  if (
    credibilitySignal === subjectivityTitle &&
    Object.keys(filteredSentences).length == 0
  ) {
    filteredCategories = [];
  }

  const sortedFilteredCategories = {};
  const top3SortedFilteredCategories = {};

  const sortedKeys = Object.keys(filteredCategories).sort(
    (a, b) =>
      parseFloat(filteredCategories[b][0].score) -
      parseFloat(filteredCategories[a][0].score),
  ); // sort by highest score first

  // for machine generated text
  sortedKeys.forEach((key) => {
    sortedFilteredCategories[key] = filteredCategories[key];
  });

  // for news framing and news genre
  sortedKeys.slice(0, 3).forEach((key) => {
    top3SortedFilteredCategories[key] = filteredCategories[key];
  }); // top 3 objects

  return (
    <Grid container>
      {/* text being displayed */}
      <Grid sx={{ paddingRight: "1em" }} size={9}>
        <ClassifiedText
          text={text}
          spanIndices={filteredSentences}
          thresholdLow={sentenceThresholdLow}
          thresholdHigh={sentenceThresholdHigh}
          textHtmlMap={textHtmlMap}
          credibilitySignal={credibilitySignal}
          keyword={keyword}
          resolvedMode={resolvedMode}
        />
      </Grid>

      {/* credibility signal box with categories */}
      <Grid size={{ xs: 3 }}>
        <Card>
          <CardHeader
            className={classes.assistantCardHeader}
            title={titleText}
            action={
              <div style={{ display: "flex" }}>
                <Tooltip
                  interactive={"true"}
                  title={categoriesTooltipContent}
                  classes={{ tooltip: classes.assistantTooltip }}
                >
                  <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
                </Tooltip>
              </div>
            }
          />
          <CardContent>
            {credibilitySignal === machineGeneratedTextTitle ? (
              <GaugeCategoriesList
                categories={sortedFilteredCategories}
                keyword={keyword}
                fullTextScoreLabel={fullTextScoreLabel}
                overallScore={
                  overallClassification[mgtOverallScoreLabel][0].score
                }
                resolvedMode={resolvedMode}
                colours={resolvedMode === "dark" ? mgtColoursDark : mgtColours}
                arcsLength={[0.05, 0.45, 0.45, 0.05]}
                gaugeLabels={["gauge_no_detection", "gauge_detection"]}
                orderedCategories={orderedCategories}
                credibilitySignal={credibilitySignal}
              />
            ) : credibilitySignal === subjectivityTitle ? (
              <GaugeCategoriesList
                keyword={keyword}
                fullTextScoreLabel={fullTextScoreLabel}
                overallScore={classification["Subjective"][0].score}
                resolvedMode={resolvedMode}
                colours={
                  resolvedMode === "dark"
                    ? subjectivityColoursDark
                    : subjectivityColours
                }
                arcsLength={[0.4, 0.25, 0.35]}
                gaugeLabels={["gauge_no_detection_sub", "gauge_detection_sub"]}
                credibilitySignal={credibilitySignal}
                importantSentenceThreshold={importantSentenceThreshold}
                handleSliderChange={handleSliderChange}
              />
            ) : (
              <CategoriesList
                categories={top3SortedFilteredCategories}
                backgroundRgb={primaryRgb}
                keyword={keyword}
                credibilitySignal={credibilitySignal}
                importantSentenceThreshold={importantSentenceThreshold}
                handleSliderChange={handleSliderChange}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// for Subjectivity and Machine Generated Text
export function GaugeCategoriesList({
  categories,
  keyword,
  fullTextScoreLabel,
  overallScore,
  resolvedMode,
  colours,
  arcsLength,
  gaugeLabels,
  orderedCategories,
  credibilitySignal,
  importantSentenceThreshold,
  handleSliderChange,
}) {
  // gauge chart
  const gaugeChart = createGaugeChart(
    fullTextScoreLabel,
    overallScore,
    resolvedMode,
    colours,
    keyword,
    gaugeLabels,
    false,
    arcsLength,
  );

  // gauage chart explanation
  const gaugeExplanation = createGaugeExplanation(keyword, arcsLength, colours);

  // categories list
  const output = [];
  if (credibilitySignal === keyword("machine_generated_text_title")) {
    for (const category of orderedCategories) {
      if (category != fullTextScoreLabel && category in categories) {
        output.push(
          <ListItem
            key={category}
            sx={{
              background: rgbToString(
                resolvedMode === "dark"
                  ? categories[category][0]["rgbDark"]
                  : categories[category][0]["rgb"],
              ),
              color: category == "highly_likely_machine" ? "white" : "black",
            }}
          >
            <ListItemText primary={keyword(category)} />
          </ListItem>,
        );
        output.push(<Divider key={`divider_${category}`} />);
      }
    }
  }

  return (
    <>
      {credibilitySignal === keyword("subjectivity_title") ? (
        <>
          <Typography fontSize="small" sx={{ textAlign: "start" }}>
            {keyword("threshold_slider_confidence")}
          </Typography>
          <ThresholdSlider
            credibilitySignal={credibilitySignal}
            importantSentenceThreshold={importantSentenceThreshold}
            handleSliderChange={handleSliderChange}
            keyword={keyword}
          />
        </>
      ) : null}
      {gaugeChart}
      {gaugeExplanation}
      {credibilitySignal === keyword("machine_generated_text_title") && (
        <>
          <Divider key={`divider_${fullTextScoreLabel}`} sx={{ my: 2 }} />
          <Typography fontSize="small" sx={{ textAlign: "start" }}>
            {keyword("detected_classes")}
          </Typography>
          <List>{output}</List>
        </>
      )}
    </>
  );
}

// for News Framing and News Genre
export function CategoriesList({
  categories,
  backgroundRgb,
  keyword,
  credibilitySignal,
  importantSentenceThreshold,
  handleSliderChange,
}) {
  if (_.isEmpty(categories)) {
    // only news framing might be empty, a genre is always detected
    return (
      credibilitySignal === keyword("news_framing_title") && (
        <Typography fontSize="small" sx={{ textAlign: "center" }}>
          {keyword("no_detected_topics")}
        </Typography>
      )
    );
  }

  let output = [];
  let index = 0;
  for (const category in categories) {
    if (index > 0) {
      output.push(<Divider key={index} />);
    }
    output.push(
      <ListItem
        key={category}
        sx={{
          background: rgbToString(backgroundRgb),
          color: "white",
        }}
      >
        <ListItemText primary={keyword(category)} />
      </ListItem>,
    );
    index++;
  }

  return (
    <>
      <Typography fontSize="small" sx={{ textAlign: "start" }}>
        {keyword("threshold_slider_relevance")}
      </Typography>
      <ThresholdSlider
        credibilitySignal={credibilitySignal}
        importantSentenceThreshold={importantSentenceThreshold}
        handleSliderChange={handleSliderChange}
        keyword={keyword}
      />
      <List>{output}</List>
    </>
  );
}

/*
Takes input from classifier and convert them into html sentence highlighting
 */
export function ClassifiedText({
  text,
  spanIndices,
  backgroundRgb,
  textHtmlMap = null,
  credibilitySignal,
  keyword,
  resolvedMode,
}) {
  let output = text; // Defaults to text output

  function wrapHighlightedText(spanText, spanInfo) {
    let bgLuminance;
    let textColour = "black";
    if (credibilitySignal === keyword("machine_generated_text_title")) {
      backgroundRgb = resolvedMode === "dark" ? spanInfo.rgbDark : spanInfo.rgb;
      bgLuminance = rgbToLuminance(backgroundRgb);
      if (spanInfo.pred == "highly_likely_machine") textColour = "white";
    } else {
      backgroundRgb = primaryRgb;
      bgLuminance = rgbToLuminance(backgroundRgb);
      if (bgLuminance < 0.7) textColour = "white";
    }

    const highlightedSentence = (
      <span
        style={{
          background: rgbToString(backgroundRgb),
          color: textColour,
          paddingBottom: "0.2em",
        }}
      >
        {spanText}
      </span>
    );

    return <span key={uuidv4()}>{highlightedSentence}</span>;
  }

  if (spanIndices.length > 0) {
    if (textHtmlMap) {
      // Text formatted & highlighted
      output = treeMapToElements(
        text,
        textHtmlMap,
        spanIndices,
        wrapHighlightedText,
      );
    } else {
      // Plaintex & highlighted
      output = wrapPlainTextSpan(text, spanIndices, wrapHighlightedText);
    }
  } else if (textHtmlMap) {
    // Text formatted but not highlighted
    output = treeMapToElements(text, textHtmlMap);
  }

  return (
    <Typography component={"div"} sx={{ textAlign: "start" }}>
      {output}
    </Typography>
  );
}
