import React, { useState } from "react";
import GaugeChart from "react-gauge-chart";

import { useColorScheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import GaugeChartModalExplanation from "components/Shared/GaugeChartResults/GaugeChartModalExplanation";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ColourGradientTooltipContent from "./ColourGradientTooltipContent";
import "./assistantTextResultStyle.css";
import {
  createGaugeChart,
  getMgtColours,
  interpRgb,
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
    confidenceThresholdLow: 0.0,
    confidenceThresholdHigh: 1.0,
    greenRgb: [0, 255, 0],
    lightGreenRgb: [170, 255, 0],
    orangeRgb: [255, 170, 0],
    redRgb: [255, 0, 0],
    greenRgbDark: [78, 255, 78],
    lightGreenRgbDark: [210, 255, 121],
    orangeRgbDark: [255, 189, 62],
    redRgbDark: [255, 78, 78],
    importanceThresholdLow: 0.8,
    importanceThresholdHigh: 1.0,
    confidenceRgbLow: [32, 180, 172],
    confidenceRgbHigh: [34, 41, 180],
    importanceRgbLow: [252, 225, 28],
    importanceRgbHigh: [252, 108, 28],
  },
  textHtmlMap = null,
  credibilitySignal = "",
}) {
  //configs.confidenceThresholdLow = 0.8;
  console.log(
    "thresholds=",
    configs.confidenceThresholdLow,
    configs.confidenceThresholdHigh,
  );
  const impLow = [252, 225, 28];
  const impHigh = [252, 108, 28];
  const confLow = [32, 180, 172];
  const confHigh = [34, 41, 180];

  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

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
  let mgtOverallScoreLabel, overallClassificationScore;
  if (credibilitySignal === keyword("machine_generated_text_title")) {
    mgtOverallScoreLabel = "mgt_overall_score";
    overallClassificationScore =
      overallClassification[mgtOverallScoreLabel][0].score;
  }

  // define sentence and category details
  let sentenceTooltipText;
  let sentenceTextLow, sentenceTextHigh;
  let sentenceRgbLow, sentenceRgbHigh;
  let categoryRgbLow, categoryRgbHigh;
  let sentenceThresholdLow, sentenceThresholdHigh;
  let categoryThresholdLow, categoryThresholdHigh;
  const primaryRgb = [0, 146, 108];
  const colourScaleText = keyword("colour_scale");

  if (credibilitySignal == keyword("subjectivity_title")) {
    // subjectivity
    sentenceTooltipText = keyword("confidence_tooltip_sentence");
    sentenceTextLow = keyword("low_confidence");
    sentenceTextHigh = keyword("high_confidence");
    sentenceRgbLow = primaryRgb; //confLow;
    // resolvedMode === "dark" ? configs.orangeRgbDark : configs.orangeRgb;
    sentenceRgbHigh = primaryRgb; //confHigh;
    // resolvedMode === "dark" ? configs.redRgbDark : configs.redRgb;
    categoryRgbLow = confLow; //primaryRgb;
    categoryRgbHigh = confHigh; //primaryRgb;
  } else if (credibilitySignal == keyword("news_framing_title")) {
    // news framing
    sentenceTooltipText = keyword("importance_tooltip_sentence");
    sentenceTextLow = keyword("low_importance");
    sentenceTextHigh = keyword("high_importance");
    sentenceRgbLow = primaryRgb;
    sentenceRgbHigh = primaryRgb;
    categoryRgbLow = primaryRgb; //confLow;
    // resolvedMode === "dark"
    //   ? configs.lightGreenRgbDark
    //   : configs.lightGreenRgb;
    categoryRgbHigh = primaryRgb; //confHigh;
    // resolvedMode === "dark" ? configs.greenRgbDark : configs.greenRgb;
  } else {
    // news genre
    // machine generated text
    sentenceTooltipText = keyword("importance_tooltip_sentence");
    sentenceTextLow = keyword("low_importance");
    sentenceTextHigh = keyword("high_importance");
    sentenceRgbLow = primaryRgb; //impLow;
    // resolvedMode === "dark"
    //   ? configs.lightGreenRgbDark
    //   : configs.lightGreenRgb;
    sentenceRgbHigh = primaryRgb; //impHigh;
    // resolvedMode === "dark" ? configs.greenRgbDark : configs.greenRgb;
    categoryRgbLow = impLow; //primaryRgb;
    categoryRgbHigh = impHigh; //primaryRgb;
  }
  // category is confidence for news framing, news genre and subjectivity
  // TODO rethink threshold code
  sentenceThresholdLow = importantSentenceThreshold / 100.0; //configs.confidenceThresholdLow;
  categoryThresholdLow = importantSentenceThreshold / 100.0; //configs.confidenceThresholdLow;
  sentenceThresholdHigh = configs.confidenceThresholdHigh;
  categoryThresholdHigh = configs.confidenceThresholdHigh;

  // tooltip for hovering over highlighted sentences
  // genre, subjectivity only
  const sentenceTooltipContent = (
    <ColourGradientTooltipContent
      description={sentenceTooltipText}
      colourScaleText={colourScaleText}
      textLow={sentenceTextLow}
      textHigh={sentenceTextHigh}
      rgbLow={sentenceRgbLow}
      rgbHigh={sentenceRgbHigh}
    />
  );
  // tooltip for hovering over categories
  const categoryTooltipContent = (
    <ColourGradientTooltipContent
      description={keyword("confidence_tooltip_category")}
      colourScaleText={keyword("colour_scale")}
      textLow={keyword("low_confidence")}
      textHigh={keyword("high_confidence")}
      rgbLow={categoryRgbLow}
      rgbHigh={categoryRgbHigh}
    />
  );

  let filteredCategories = {};
  let filteredSentences = [];

  const [doHighlightSentence, setDoHighlightSentence] = useState(true);
  const handleHighlightSentences = (event) => {
    setDoHighlightSentence(event.target.checked);
  };

  // traffic light colours for machine generated text
  const [colours, coloursDark] = getMgtColours(configs);
  const orderedCategories = [
    "highly_likely_human",
    "likely_human",
    "likely_machine",
    "highly_likely_machine",
  ];

  // Separate important sentences from categories, filter by threshold
  for (let label in classification) {
    if (label === importantSentenceKey) {
      // Filter sentences above importanceThresholdLow unless machine generated text
      const sentenceIndices = classification[label];
      for (let i = 0; i < sentenceIndices.length; i++) {
        if (credibilitySignal === keyword("machine_generated_text_title")) {
          filteredSentences.push(sentenceIndices[i]);
        } else if (
          sentenceIndices[i].score >=
          importantSentenceThreshold / 100.0
        ) {
          filteredSentences.push(sentenceIndices[i]);
        }
      }
    } else {
      //Filter categories above confidenceThreshold unless machine generated text
      if (credibilitySignal === keyword("machine_generated_text_title")) {
        filteredCategories[label] = classification[label];
      } else if (
        classification[label][0].score >=
        importantSentenceThreshold / 100.0
      ) {
        filteredCategories[label] = classification[label];
      }
    }
  }

  if (Object.keys(filteredCategories).length === 0) {
    filteredSentences = [];
  }
  if (
    credibilitySignal === keyword("subjectivity_title") &&
    Object.keys(filteredSentences).length == 0
  ) {
    filteredCategories = [];
  }

  console.log(credibilitySignal, filteredCategories);
  console.log(credibilitySignal, filteredSentences);

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
          highlightSpan={doHighlightSentence}
          tooltipText={sentenceTooltipContent}
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
            {credibilitySignal === keyword("machine_generated_text_title") ? (
              <MgtCategoriesList
                categories={sortedFilteredCategories}
                keyword={keyword}
                mgtOverallScoreLabel={mgtOverallScoreLabel}
                overallClassificationScore={overallClassificationScore}
                resolvedMode={resolvedMode}
                colours={colours}
                coloursDark={coloursDark}
                orderedCategories={orderedCategories}
              />
            ) : (
              <CategoriesList
                categories={sortedFilteredCategories}
                tooltipText={categoryTooltipContent}
                thresholdLow={categoryThresholdLow}
                thresholdHigh={categoryThresholdHigh}
                rgbLow={categoryRgbLow}
                rgbHigh={categoryRgbHigh}
                primaryColour={primaryRgb}
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

export function MgtCategoriesList({
  categories,
  keyword,
  mgtOverallScoreLabel,
  overallClassificationScore,
  resolvedMode,
  colours,
  coloursDark,
  orderedCategories,
}) {
  // list of categories with overall score first as GaugeUI
  // let output = [];
  let output = createGaugeChart(
    mgtOverallScoreLabel,
    overallClassificationScore,
    resolvedMode,
    resolvedMode === "dark" ? coloursDark : colours,
    keyword,
  );

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

  return <List>{output}</List>;
}

export function CategoriesList({
  categories,
  tooltipText,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  primaryColour,
  keyword,
  credibilitySignal,
  importantSentenceThreshold,
  handleSliderChange,
}) {
  if (_.isEmpty(categories)) {
    return (
      <p>
        {credibilitySignal === keyword("news_framing_title") &&
          keyword("no_detected_topics")}
        {credibilitySignal === keyword("subjectivity_title") &&
          keyword("no_detected_sentences")}
      </p>
    );
  }
  // slider
  const marks = [
    {
      value: 0,
      label: "Low",
    },
    {
      value: 99,
      label: "High",
    },
  ];
  const scaleValue = (value) => {
    return value / 100;
  };
  const thresholdSlider = (
    <List>
      <ListItem key={keyword(credibilitySignal) + "_thresholdSlider"}>
        <Slider
          aria-label="important sentence threshold slider"
          marks={marks}
          step={1}
          min={0}
          max={99}
          scale={scaleValue}
          defaultValue={80} // on loading thing it keeps resetting to 80
          value={importantSentenceThreshold}
          onChange={handleSliderChange}
        />
      </ListItem>
    </List>
  );

  // categories/output
  let output = [];
  let index = 0;
  let backgroundRgb = primaryColour;
  for (const category in categories) {
    if (index > 0) {
      output.push(<Divider key={index} />);
    }
    if (credibilitySignal === keyword("news_framing_title")) {
      backgroundRgb = interpRgb(
        categories[category][0].score,
        thresholdLow,
        thresholdHigh,
        rgbLow,
        rgbHigh,
      );
    }
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
      <Typography sx={{ textAlign: "start" }}>Certainty level:</Typography>
      {thresholdSlider}
      <List>{output}</List>
    </>
  );
}

/*
Takes input from topic classifier and convert them into html sentence highlighting
 */
export function ClassifiedText({
  text,
  spanIndices,
  highlightSpan,
  tooltipText,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  textHtmlMap = null,
  credibilitySignal,
  keyword,
  resolvedMode,
}) {
  console.log("colour scale thresholds=", thresholdLow, thresholdHigh);

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

    // machine generated text and news framing/topic don't require a tooltip on the highlighted sentences
    if (
      credibilitySignal === keyword("machine_generated_text_title") ||
      credibilitySignal === keyword("news_framing_title")
    ) {
      return <span key={uuidv4()}>{highlightedSentence}</span>;
    } else {
      return (
        <Tooltip key={uuidv4()} title={tooltipText}>
          {highlightedSentence}
        </Tooltip>
      );
    }
  }

  if (highlightSpan && spanIndices.length > 0) {
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
