import React from "react";

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

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ColourGradientTooltipContent from "./ColourGradientTooltipContent";
import "./assistantTextResultStyle.css";
import {
  SummaryReturnButton,
  ThresholdSlider,
  createGaugeChart,
  getMgtColours,
  getSubjectivityColours,
  interpRgb,
  primaryRgb,
  rgbToLuminance,
  rgbToString,
  treeMapToElements,
  wrapPlainTextSpan,
} from "./assistantUtils";

export default function AssistantTextClassification({
  text,
  classification,
  overallClassification,
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
    lightGreenRgb: [170, 255, 0],
    orangeRgb: [255, 170, 0],
    redRgb: [255, 0, 0],
    greenRgbDark: [78, 255, 78],
    lightGreenRgbDark: [210, 255, 121],
    orangeRgbDark: [255, 189, 62],
    redRgbDark: [255, 78, 78],
  },
  textHtmlMap = null,
  credibilitySignal = "",
  setTextTabIndex = 0,
}) {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // titles
  const newsFramingTitle = keyword("news_framing_title");
  const newsGenreTitle = keyword("news_genre_title");
  const subjectivityTitle = keyword("subjectivity_title");
  const machineGeneratedTextTitle = keyword("machine_generated_text_title");

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // slider
  const [importantSentenceThreshold, setImportantSentenceThreshold] =
    React.useState(80);

  const handleSliderChange = (event, newValue) => {
    setImportantSentenceThreshold(newValue);
  };

  // define category for machine generated text overall score
  const mgtOverallScoreLabel = "mgt_overall_score";

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
    // TODO should this be here?
    orderedCategories = [
      "highly_likely_human",
      "likely_human",
      "likely_machine",
      "highly_likely_machine",
    ];
  } else if (credibilitySignal === subjectivityTitle) {
    [subjectivityColours, subjectivityColoursDark] =
      getSubjectivityColours(configs);
  }
  const sentenceRgbLow = primaryRgb;
  const sentenceRgbHigh = primaryRgb;

  // define category and sentence thresholds
  const sentenceThresholdLow = importantSentenceThreshold / 100.0;
  const sentenceThresholdHigh = 99;
  const categoryThresholdLow = configs.confidenceThresholdLow;
  const categoryThresholdHigh = configs.confidenceThresholdHigh;

  // filtering
  let filteredCategories = {};
  let filteredSentences = [];

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
                mgtOverallScoreLabel={mgtOverallScoreLabel}
                overallClassificationScore={
                  overallClassification[mgtOverallScoreLabel][0].score
                }
                resolvedMode={resolvedMode}
                colours={resolvedMode === "dark" ? mgtColoursDark : mgtColours}
                orderedCategories={orderedCategories}
                credibilitySignal={credibilitySignal}
                gaugeDetectionText={["gauge_no_detection", "gauge_detection"]}
              />
            ) : credibilitySignal === subjectivityTitle ? (
              <GaugeCategoriesList
                keyword={keyword}
                mgtOverallScoreLabel={mgtOverallScoreLabel}
                overallClassificationScore={
                  sortedFilteredCategories["Subjective"][0].score
                }
                resolvedMode={resolvedMode}
                colours={
                  resolvedMode === "dark"
                    ? subjectivityColoursDark
                    : subjectivityColours
                }
                credibilitySignal={credibilitySignal}
                gaugeDetectionText={[
                  "gauge_no_detection_sub",
                  "gauge_detection_sub",
                ]}
                importantSentenceThreshold={importantSentenceThreshold}
                handleSliderChange={handleSliderChange}
              />
            ) : (
              <CategoriesList
                categories={sortedFilteredCategories}
                thresholdLow={categoryThresholdLow}
                thresholdHigh={categoryThresholdHigh}
                rgbLow={categoryRgbLow}
                rgbHigh={categoryRgbHigh}
                primaryColour={primaryRgb}
                keyword={keyword}
                credibilitySignal={credibilitySignal}
                importantSentenceThreshold={importantSentenceThreshold}
                handleSliderChange={handleSliderChange}
                classes={classes}
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

export function GaugeCategoriesList({
  categories,
  keyword,
  mgtOverallScoreLabel,
  overallClassificationScore,
  resolvedMode,
  colours,
  orderedCategories,
  credibilitySignal,
  gaugeDetectionText,
  importantSentenceThreshold,
  handleSliderChange,
}) {
  // list of categories with overall score first as GaugeUI
  const gaugeChart = createGaugeChart(
    mgtOverallScoreLabel,
    overallClassificationScore,
    resolvedMode,
    colours,
    keyword,
    gaugeDetectionText,
    true,
    credibilitySignal === keyword("machine_generated_text_title")
      ? [0.05, 0.45, 0.45, 0.05]
      : [0.4, 0.25, 0.35],
  );

  const output = [];
  if (credibilitySignal === keyword("machine_generated_text_title")) {
    // divider
    output.push(<ListItem key="listitem_empty1"></ListItem>);
    output.push(<Divider key={`divider_${mgtOverallScoreLabel}`} />);
    output.push(<ListItem key="listitem_empty2"></ListItem>);
    // categories
    output.push(
      <ListItem key={"text_detected_classes"}>
        <Typography>{keyword("detected_classes")}</Typography>
      </ListItem>,
    );
    for (const category of orderedCategories) {
      if (category != mgtOverallScoreLabel && category in categories) {
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
            {keyword("threshold_slider_certainty")}
          </Typography>
          <ThresholdSlider
            credibilitySignal={credibilitySignal}
            importantSentenceThreshold={importantSentenceThreshold}
            handleSliderChange={handleSliderChange}
          />
        </>
      ) : null}
      {gaugeChart}
      <List>{output}</List>
    </>
  );
}

export function CategoriesList({
  categories,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  keyword,
  credibilitySignal,
  importantSentenceThreshold,
  handleSliderChange,
  classes,
}) {
  if (_.isEmpty(categories)) {
    return (
      <p>
        {credibilitySignal === keyword("news_framing_title") &&
          keyword("no_detected_topics")}
      </p>
    );
  }
  // categories/output
  let output = [];
  let index = 0;
  // let backgroundRgb = primaryColour;
  for (const category in categories) {
    if (index > 0) {
      output.push(<Divider key={index} />);
    }
    const backgroundRgb = interpRgb(
      categories[category][0].score,
      thresholdLow,
      thresholdHigh,
      rgbLow,
      rgbHigh,
    );
    let bgLuminance = rgbToLuminance(backgroundRgb);
    let textColour = "white";
    if (bgLuminance > 0.7) textColour = "black";

    output.push(
      <ListItem
        key={category}
        sx={{
          background: rgbToString(backgroundRgb),
          color: textColour,
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
      />
      <Tooltip
        classes={{ tooltip: classes.assistantTooltip }}
        title={
          <ColourGradientTooltipContent
            description={keyword("confidence_tooltip_category")}
            colourScaleText={keyword("colour_scale")}
            textLow={keyword("low_confidence")}
            textHigh={keyword("high_confidence")}
            rgbLow={rgbLow}
            rgbHigh={rgbHigh}
          />
        }
      >
        <List>{output}</List>
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
