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

import ColourGradientTooltipContent from "@/components/NavItems/Assistant/AssistantScrapeResults/ColourGradientTooltipContent";
import "@/components/NavItems/Assistant/AssistantScrapeResults/assistantTextResultStyle.css";
import {
  SummaryReturnButton,
  ThresholdSlider,
  createGaugeExplanation,
  getMgtColours,
  getSubjectivityColours,
  interpRgb,
  primaryRgb,
  rgbToLuminance,
  rgbToString,
  treeMapToElements,
  wrapPlainTextSpan,
} from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import GaugeChartModalExplanation from "@/components/Shared/GaugeChartResults/GaugeChartModalExplanation";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { setImportantSentenceThreshold } from "@/redux/actions/tools/assistantActions";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import "./assistantTextResultStyle.css";

export default function AssistantTextClassification({
  text,
  classification,
  titleText = "",
  importantSentenceKey = "Important_Sentence",
  categoriesTooltipContent = "",
  configs = {
    // news framing and news genre
    confidenceThresholdLow: 0.8,
    confidenceThresholdHigh: 1.0,
    confidenceRgbLow: [32, 180, 172],
    confidenceRgbHigh: [34, 41, 180],
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
  setTextTabIndex = 0,
  summary,
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

  // define category for machine generated text overall score
  const fullTextScoreLabel = "full_text_score";

  // define category and sentence colours
  let categoryRgbLow, categoryRgbHigh;
  let mgtColours, mgtColoursDark, orderedCategories;
  let subjectivityColours, subjectivityColoursDark;
  if (
    credibilitySignal === newsFramingTitle ||
    credibilitySignal === newsGenreTitle
  ) {
    categoryRgbLow = configs.confidenceRgbLow;
    categoryRgbHigh = configs.confidenceRgbHigh;
  } else if (credibilitySignal === machineGeneratedTextTitle) {
    // traffic light colours for machine generated text
    [mgtColours, mgtColoursDark] = getMgtColours(configs);
    orderedCategories = configs.orderedCategories;
  } else if (credibilitySignal === subjectivityTitle) {
    [subjectivityColours, subjectivityColoursDark] =
      getSubjectivityColours(configs);
  }
  const sentenceRgbLow = primaryRgb;
  const sentenceRgbHigh = primaryRgb;

  // define category and sentence thresholds
  const sentenceThresholdLow = importantSentenceThreshold / 100.0;
  const sentenceThresholdHigh = 99;

  // filtering sentences for all credibility signals
  let filteredSentences = [];
  // only filtering cetgories for machine generated text
  // news framing and news genre previously created as summary
  // subjectivity has no categories
  let filteredCategories = {};

  // Separate important sentences from categories, filter by threshold
  for (let label in classification) {
    if (label === importantSentenceKey) {
      // Filter sentences above importanceThresholdLow unless machine generated text
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
        classification[label][0].score >= configs.confidenceThresholdLow
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

  // order categories by highest score first
  const sortedFilteredCategories = {};
  Object.keys(filteredCategories)
    .sort(
      (a, b) =>
        parseFloat(filteredCategories[b][0].score) -
        parseFloat(filteredCategories[a][0].score),
    )
    .forEach((key) => {
      sortedFilteredCategories[key] = filteredCategories[key];
    });

  return (
    <Grid container>
      {/* text being displayed */}
      <Grid sx={{ paddingRight: "1em" }} size={9}>
        <ClassifiedText
          text={text}
          spanIndices={filteredSentences}
          thresholdLow={sentenceThresholdLow}
          thresholdHigh={sentenceThresholdHigh}
          rgbLow={sentenceRgbLow}
          rgbHigh={sentenceRgbHigh}
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
                resolvedMode={resolvedMode}
                colours={resolvedMode === "dark" ? mgtColoursDark : mgtColours}
                orderedCategories={orderedCategories}
                credibilitySignal={credibilitySignal}
                summary={summary}
              />
            ) : credibilitySignal === subjectivityTitle ? (
              <GaugeCategoriesList
                keyword={keyword}
                fullTextScoreLabel={fullTextScoreLabel}
                resolvedMode={resolvedMode}
                colours={
                  resolvedMode === "dark"
                    ? subjectivityColoursDark
                    : subjectivityColours
                }
                credibilitySignal={credibilitySignal}
                importantSentenceThreshold={importantSentenceThreshold}
                handleSliderChange={handleSliderChange}
                summary={summary}
              />
            ) : (
              <CategoriesList
                categories={sortedFilteredCategories}
                rgbLow={categoryRgbLow}
                rgbHigh={categoryRgbHigh}
                primaryColour={primaryRgb}
                keyword={keyword}
                credibilitySignal={credibilitySignal}
                importantSentenceThreshold={importantSentenceThreshold}
                handleSliderChange={handleSliderChange}
                classes={classes}
                summary={summary}
              />
            )}
            <SummaryReturnButton
              setTextTabIndex={setTextTabIndex}
              text={keyword("summary_title")}
            />
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
  resolvedMode,
  colours,
  orderedCategories,
  credibilitySignal,
  importantSentenceThreshold,
  handleSliderChange,
  summary,
}) {
  // gauage chart explanation
  const gaugeExplanation = createGaugeExplanation(
    keyword,
    credibilitySignal === keyword("machine_generated_text_title")
      ? [0.05, 0.45, 0.45, 0.05]
      : [0.4, 0.25, 0.35],
    colours,
  );

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
      {summary}
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

// for news framing and news genre
export function CategoriesList({
  categories,
  // rgbLow,
  // rgbHigh,
  keyword,
  credibilitySignal,
  importantSentenceThreshold,
  handleSliderChange,
  classes,
  summary,
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
      <Tooltip
        classes={{ tooltip: classes.assistantTooltip }}
        title={
          <ColourGradientTooltipContent
            description={keyword("confidence_tooltip_category")}
            colourScaleText={keyword("colour_scale")}
            textLow={keyword("low_confidence")}
            textHigh={keyword("high_confidence")}
            // rgbLow={rgbLow}
            // rgbHigh={rgbHigh}
          />
        }
      >
        {summary}
      </Tooltip>
    </>
  );
}

/*
Takes input from topic classifier and convert them into html sentence highlighting
 */
export function ClassifiedText({
  text,
  spanIndices,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  textHtmlMap = null,
  credibilitySignal,
  keyword,
  resolvedMode,
}) {
  let output = text; // Defaults to text output

  function wrapHighlightedText(spanText, spanInfo) {
    const spanScore = spanInfo.score;
    let backgroundRgb, bgLuminance;
    let textColour = "black";
    if (credibilitySignal === keyword("machine_generated_text_title")) {
      backgroundRgb = resolvedMode === "dark" ? spanInfo.rgbDark : spanInfo.rgb;
      bgLuminance = rgbToLuminance(backgroundRgb);
      if (spanInfo.pred == "highly_likely_machine") textColour = "white";
    } else {
      backgroundRgb = interpRgb(
        spanScore,
        thresholdLow,
        thresholdHigh,
        rgbLow,
        rgbHigh,
      );
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
