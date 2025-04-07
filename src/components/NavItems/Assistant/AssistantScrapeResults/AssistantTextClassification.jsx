import React, { useState } from "react";
import GaugeChart from "react-gauge-chart";

import { useColorScheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid2 from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import GaugeChartModalExplanation from "components/Shared/GaugeChartResults/GaugeChartModalExplanation";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { v4 as uuidv4 } from "uuid";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ColourGradientTooltipContent from "./ColourGradientTooltipContent";
import "./assistantTextResultStyle.css";
import {
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
    confidenceThresholdLow: 0.8,
    confidenceThresholdHigh: 1.0,
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
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

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
  let sentenceThresholdLow, sentenceThresholdHigh;
  const colourScaleText = keyword("colour_scale");
  if (credibilitySignal == keyword("subjectivity_title")) {
    // subjectivity requires confidence for sentence
    sentenceTooltipText = keyword("confidence_tooltip_sentence");
    sentenceTextLow = keyword("low_confidence");
    sentenceTextHigh = keyword("high_confidence");
    sentenceRgbLow = configs.confidenceRgbLow;
    sentenceRgbHigh = configs.confidenceRgbHigh;
    sentenceThresholdLow = configs.confidenceThresholdLow;
    sentenceThresholdHigh = configs.confidenceThresholdHigh;
  } else {
    // news framing and news genre requires importance for sentence
    sentenceTooltipText = keyword("importance_tooltip_sentence");
    sentenceTextLow = keyword("low_importance");
    sentenceTextHigh = keyword("high_importance");
    sentenceRgbLow = configs.importanceRgbLow;
    sentenceRgbHigh = configs.importanceRgbHigh;
    sentenceThresholdLow = configs.importanceThresholdLow;
    sentenceThresholdHigh = configs.importanceThresholdHigh;
  }
  // category is confidence for news framing, news genre and subjectivity
  const categoryRgbLow = configs.confidenceRgbLow;
  const categoryRgbHigh = configs.confidenceRgbHigh;
  const categoryThresholdLow = configs.confidenceThresholdLow;
  const categoryThresholdHigh = configs.confidenceThresholdHigh;

  // tooltip for hovering over highlighted sentences
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
      rgbLow={configs.confidenceRgbLow}
      rgbHigh={configs.confidenceRgbHigh}
    />
  );

  let filteredCategories = {};
  let filteredSentences = [];

  const [doHighlightSentence, setDoHighlightSentence] = useState(true);
  const handleHighlightSentences = (event) => {
    setDoHighlightSentence(event.target.checked);
  };

  // Separate important sentences from categories, filter by threshold
  for (let label in classification) {
    if (label === importantSentenceKey) {
      // Filter sentences above importanceThresholdLow unless machine generated text
      const sentenceIndices = classification[label];
      for (let i = 0; i < sentenceIndices.length; i++) {
        if (
          credibilitySignal != keyword("machine_generated_text_title") &&
          sentenceIndices[i].score >= configs.importanceThresholdLow
        ) {
          filteredSentences.push(sentenceIndices[i]);
        } else {
          filteredSentences.push(sentenceIndices[i]);
        }
      }
    } else {
      //Filter categories above confidenceThreshold unless machine generated text
      if (
        credibilitySignal != keyword("machine_generated_text_title") &&
        classification[label][0].score >= configs.confidenceThresholdLow
      ) {
        filteredCategories[label] = classification[label];
      } else {
        filteredCategories[label] = classification[label];
      }
    }
  }

  if (Object.keys(filteredCategories).length == 0) {
    filteredSentences = [];
  }

  return (
    <Grid2 container>
      {/* text being displayed */}
      <Grid2 sx={{ paddingRight: "1em" }} size={9}>
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
        />
      </Grid2>

      {/* credibility signal box with categories */}
      <Grid2 size={{ xs: 3 }}>
        <Card variant="outlined">
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
                categories={filteredCategories}
                keyword={keyword}
                mgtOverallScoreLabel={mgtOverallScoreLabel}
                overallClassificationScore={overallClassificationScore}
                resolvedMode={resolvedMode}
              />
            ) : (
              <CategoriesList
                categories={filteredCategories}
                tooltipText={categoryTooltipContent}
                thresholdLow={categoryThresholdLow}
                thresholdHigh={categoryThresholdHigh}
                rgbLow={categoryRgbLow}
                rgbHigh={categoryRgbHigh}
                keyword={keyword}
                credibilitySignal={credibilitySignal}
              />
            )}
            {filteredSentences.length > 0 ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={doHighlightSentence}
                    onChange={handleHighlightSentences}
                  />
                }
                label={keyword("highlight_important_sentence")}
              />
            ) : null}
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

export function MgtCategoriesList({
  categories,
  keyword,
  mgtOverallScoreLabel,
  overallClassificationScore,
  resolvedMode,
}) {
  // list of categories with overall score first as GaugeUI
  let output = [];
  output.push(
    <ListItem key={`text_${mgtOverallScoreLabel}`}>
      <Typography>{keyword(mgtOverallScoreLabel)}</Typography>
    </ListItem>,
  );
  // gauge chart
  const percentScore = Math.round(Number(overallClassificationScore) * 100.0);
  output.push(
    <ListItem key="gauge_chart">
      <GaugeChart
        id={"gauge-chart"}
        animate={false}
        nrOfLevels={4}
        textColor={resolvedMode === "dark" ? "white" : "black"}
        needleColor={"#767d86"}
        needleBaseColor={"#767d86"}
        arcsLength={[0.05, 0.45, 0.45, 0.05]}
        percent={categories[mgtOverallScoreLabel] ? percentScore / 100.0 : null}
        style={{
          width: "100%",
        }}
      />
    </ListItem>,
  );
  // gauge labels
  output.push(
    <ListItem key="gauge_labels">
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={7}
      >
        <Typography variant="subtitle2">
          {keyword("gauge_no_detection")}
        </Typography>
        <Typography variant="subtitle2">
          {keyword("gauge_detection")}
        </Typography>
      </Stack>
    </ListItem>,
  );
  // gauge explanation
  output.push(
    <ListItem key="gauge_explanantion">
      <GaugeChartModalExplanation
        keyword={keyword}
        keywordsArr={[
          "gauge_scale_modal_explanation_rating_1",
          "gauge_scale_modal_explanation_rating_2",
          "gauge_scale_modal_explanation_rating_3",
          "gauge_scale_modal_explanation_rating_4",
        ]}
        keywordLink={"gauge_scale_explanation_link"}
        keywordModalTitle={"gauge_scale_modal_explanation_title"}
        colors={["#00FF00", "#AAFF03", "#FFA903", "#FF0000"]}
      />
    </ListItem>,
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
  const orderedCategories = [
    "highly_likely_machine",
    "likely_machine",
    "likely_human",
    "highly_likely_human",
  ];
  for (const category of orderedCategories) {
    if (category != mgtOverallScoreLabel && category in categories) {
      output.push(
        <ListItem
          key={category}
          sx={{
            background: rgbToString(categories[category][0]["rgb"]),
            color:
              rgbToLuminance(categories[category][0]["rgb"]) > 0.7
                ? "black"
                : "white",
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
  keyword,
  credibilitySignal,
}) {
  if (_.isEmpty(categories)) {
    return (
      <p>
        {credibilitySignal == keyword("news_framing_title") &&
          keyword("no_detected_topics")}
        {credibilitySignal == keyword("subjectivity_title") &&
          keyword("no_detected_sentences")}
      </p>
    );
  }

  let output = [];
  let index = 0;
  for (const category in categories) {
    if (index > 0) {
      output.push(<Divider key={index} />);
    }
    let backgroundRgb = interpRgb(
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
      {credibilitySignal != keyword("subjectivity_title") ? (
        <Tooltip title={tooltipText}>
          <List>{output}</List>
        </Tooltip>
      ) : (
        <List>{output}</List>
      )}
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
}) {
  let output = text; //Defaults to text output

  function wrapHighlightedText(spanText, spanInfo) {
    const spanScore = spanInfo.score;
    let backgroundRgb;
    //let mgtTooltipText;
    if (credibilitySignal === keyword("machine_generated_text_title")) {
      backgroundRgb = spanInfo.rgb;
      //mgtTooltipText = keyword("mgt_detected_sentence_class") + keyword(spanInfo.pred)
    } else {
      backgroundRgb = interpRgb(
        spanScore,
        thresholdLow,
        thresholdHigh,
        rgbLow,
        rgbHigh,
      );
    }
    let bgLuminance = rgbToLuminance(backgroundRgb);
    let textColour = "white";
    if (bgLuminance > 0.7) textColour = "black";

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

    // machine generated text doesn't require a tooltip on the highlighted sentences
    if (credibilitySignal != keyword("machine_generated_text_title")) {
      return (
        <Tooltip key={uuidv4()} title={tooltipText}>
          {highlightedSentence}
        </Tooltip>
      );
    } else {
      return <span key={uuidv4()}>{highlightedSentence}</span>;
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
