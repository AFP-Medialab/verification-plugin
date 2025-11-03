import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
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
import { useTheme } from "@mui/material/styles";
import { hexToRgb } from "@mui/material/styles";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import {
  ThresholdSlider,
  createGaugeChart,
  getMgtColours,
  getSubjectivityColours,
  rgbToLuminance,
  rgbToString,
  treeMapToElements,
  wrapPlainTextSpan,
} from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { setImportantSentenceThreshold } from "@/redux/actions/tools/assistantActions";
import GaugeChartModalExplanation from "@Shared/GaugeChartResults/GaugeChartModalExplanation";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

export default function AssistantTextClassification({
  text,
  classification,
  overallClassification,
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
    // news framing
    newsFramingConfidenceThreshold: 0.8,
    // news genre
    newsGenreConfidenceThresholdLow: 0.7,
  },
  textHtmlMap = null,
  credibilitySignal = "",
}) {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // titles
  const newsFramingTitle = "news_framing_title";
  const newsGenreTitle = "news_genre_title";
  const subjectivityTitle = "subjectivity_title";
  const machineGeneratedTextTitle = "machine_generated_text_title";

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

  // primary colour
  const theme = useTheme();
  const primaryRgb = hexToRgb(theme.palette.primary.main)
    .match(/\d+/g)
    .map(Number);

  // predefined labels
  const fullTextScoreLabel = "full_text_score";
  const importantSentenceKey = "Important_Sentence";
  const mgtOverallScoreLabel = "mgt_overall_score";

  // define colours
  let newsFramingConfidenceThreshold, newsGenreConfidenceThreshold;
  let mgtColours, mgtColoursDark, orderedCategories;
  let subjectivityColours, subjectivityColoursDark;
  if (credibilitySignal === newsFramingTitle) {
    newsFramingConfidenceThreshold = configs.newsFramingConfidenceThreshold;
  } else if (credibilitySignal === newsGenreTitle) {
    newsGenreConfidenceThreshold = configs.newsGenreConfidenceThreshold;
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

  const REPORTING_LABEL = "Reporting";

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
      // machine generated text and subjectivity
      if (
        credibilitySignal === machineGeneratedTextTitle ||
        credibilitySignal === subjectivityTitle
      ) {
        filteredCategories[label] = classification[label];
      } else if (credibilitySignal === newsGenreTitle) {
        // set default news genre value if category below threshold
        label === REPORTING_LABEL
          ? (filteredCategories[label] = classification[label])
          : classification[label][0].score >= newsGenreConfidenceThreshold
            ? (filteredCategories[label] = classification[label])
            : (filteredCategories[REPORTING_LABEL] = [
                { indices: [0, -1], score: newsGenreConfidenceThreshold },
              ]);
      } else if (
        classification[label][0].score >= newsFramingConfidenceThreshold
      ) {
        // filter news framing categories above threshold
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
          primaryRgb={primaryRgb}
          thresholdLow={sentenceThresholdLow}
          thresholdHigh={sentenceThresholdHigh}
          textHtmlMap={textHtmlMap}
          credibilitySignal={credibilitySignal}
          keyword={keyword}
          resolvedMode={resolvedMode}
          machineGeneratedTextTitle={machineGeneratedTextTitle}
        />
      </Grid>

      {/* credibility signal box with categories */}
      <Grid size={{ xs: 3 }}>
        <Card>
          <CardHeader
            className={classes.assistantCardHeader}
            title={keyword(credibilitySignal)}
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
                machineGeneratedTextTitle={machineGeneratedTextTitle}
                subjectivityTitle={subjectivityTitle}
              />
            ) : credibilitySignal === subjectivityTitle ? (
              <GaugeCategoriesList
                categories={filteredCategories}
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
                machineGeneratedTextTitle={machineGeneratedTextTitle}
                subjectivityTitle={subjectivityTitle}
              />
            ) : (
              <CategoriesList
                categories={top3SortedFilteredCategories}
                backgroundRgb={primaryRgb}
                keyword={keyword}
                credibilitySignal={credibilitySignal}
                importantSentenceThreshold={importantSentenceThreshold}
                handleSliderChange={handleSliderChange}
                newsFramingTitle={newsFramingTitle}
                newsGenreTitle={newsGenreTitle}
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
  machineGeneratedTextTitle,
  subjectivityTitle,
}) {
  // gauge chart
  const gaugeChart = createGaugeChart(
    fullTextScoreLabel,
    overallScore,
    resolvedMode,
    colours,
    keyword,
    gaugeLabels,
    arcsLength,
  );

  // categories list
  const output = [];
  if (credibilitySignal === machineGeneratedTextTitle) {
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

  const DETECTION_EXPLANATION_KEYWORDS_SUB = [
    "gauge_scale_modal_explanation_rating_1_sub",
    "gauge_scale_modal_explanation_rating_2_sub",
    "gauge_scale_modal_explanation_rating_3_sub",
  ];
  const DETECTION_EXPLANATION_KEYWORDS_MGT = [
    "gauge_scale_modal_explanation_rating_1_mgt",
    "gauge_scale_modal_explanation_rating_2_mgt",
    "gauge_scale_modal_explanation_rating_3_mgt",
    "gauge_scale_modal_explanation_rating_4_mgt",
  ];

  return (
    <>
      {credibilitySignal === subjectivityTitle ? (
        <>
          {_.isEmpty(categories) && overallScore === 0 ? (
            <>
              <Typography fontSize="small" sx={{ textAlign: "center" }}>
                {keyword("no_detected_subjective_sentences")}
              </Typography>
            </>
          ) : (
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
          )}
          <Divider key={`divider_${fullTextScoreLabel}`} sx={{ my: 2 }} />
        </>
      ) : null}
      {gaugeChart}
      <Box sx={{ textAlign: "start", mt: 2 }}>
        <GaugeChartModalExplanation
          keyword={keyword}
          keywordsArr={
            credibilitySignal === machineGeneratedTextTitle
              ? DETECTION_EXPLANATION_KEYWORDS_MGT
              : DETECTION_EXPLANATION_KEYWORDS_SUB
          }
          keywordLink={"gauge_scale_explanation_link"}
          keywordModalTitle={"gauge_scale_modal_explanation_title"}
          colors={colours}
        />
      </Box>
      {credibilitySignal === machineGeneratedTextTitle && (
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
  newsFramingTitle,
  newsGenreTitle,
}) {
  if (_.isEmpty(categories)) {
    return (
      <>
        {credibilitySignal === newsFramingTitle && (
          <Typography fontSize="small" sx={{ textAlign: "center" }}>
            {keyword("no_detected_topics")}
          </Typography>
        )}
        {credibilitySignal === newsGenreTitle && (
          <Typography fontSize="small" sx={{ textAlign: "center" }}>
            {keyword("no_detected_genre")}
          </Typography>
        )}
      </>
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
  primaryRgb,
  textHtmlMap = null,
  credibilitySignal,
  resolvedMode,
  machineGeneratedTextTitle,
}) {
  let output = text; // Defaults to text output

  function wrapHighlightedText(spanText, spanInfo) {
    let bgLuminance;
    let textColour = "black";
    if (credibilitySignal === machineGeneratedTextTitle) {
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
