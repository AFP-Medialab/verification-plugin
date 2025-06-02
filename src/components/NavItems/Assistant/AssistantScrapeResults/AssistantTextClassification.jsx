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
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ColourGradientTooltipContent, {
  ColourGradientScale,
} from "./ColourGradientTooltipContent";
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
    sentenceRgbLow = confLow;
    // resolvedMode === "dark" ? configs.orangeRgbDark : configs.orangeRgb;
    sentenceRgbHigh = confHigh;
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
    categoryRgbLow = confLow;
    // resolvedMode === "dark"
    //   ? configs.lightGreenRgbDark
    //   : configs.lightGreenRgb;
    categoryRgbHigh = confHigh;
    // resolvedMode === "dark" ? configs.greenRgbDark : configs.greenRgb;
  } else {
    // news genre
    // machine generated text
    sentenceTooltipText = keyword("importance_tooltip_sentence");
    sentenceTextLow = keyword("low_importance");
    sentenceTextHigh = keyword("high_importance");
    sentenceRgbLow = impLow;
    // resolvedMode === "dark"
    //   ? configs.lightGreenRgbDark
    //   : configs.lightGreenRgb;
    sentenceRgbHigh = impHigh;
    // resolvedMode === "dark" ? configs.greenRgbDark : configs.greenRgb;
    categoryRgbLow = impLow; //primaryRgb;
    categoryRgbHigh = impHigh; //primaryRgb;
  }
  // category is confidence for news framing, news genre and subjectivity
  // TODO rethink threshold code
  sentenceThresholdLow = configs.confidenceThresholdLow;
  categoryThresholdLow = configs.confidenceThresholdLow;
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
  // news framing/topic only
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
  const colours = [
    rgbToString(configs.greenRgb),
    rgbToString(configs.lightGreenRgb),
    rgbToString(configs.orangeRgb),
    rgbToString(configs.redRgb),
  ];
  const coloursDark = [
    rgbToString(configs.greenRgbDark),
    rgbToString(configs.lightGreenRgbDark),
    rgbToString(configs.orangeRgbDark),
    rgbToString(configs.redRgbDark),
  ];
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
        } else if (sentenceIndices[i].score >= configs.confidenceThresholdLow) {
          filteredSentences.push(sentenceIndices[i]);
        }
      }
    } else {
      //Filter categories above confidenceThreshold unless machine generated text
      if (credibilitySignal === keyword("machine_generated_text_title")) {
        filteredCategories[label] = classification[label];
      } else if (
        classification[label][0].score >= configs.confidenceThresholdLow
      ) {
        filteredCategories[label] = classification[label];
      }
    }
  }

  if (Object.keys(filteredCategories).length == 0) {
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

  // highlight important sentences form
  const highlightImportantSentence = (
    <FormControlLabel
      control={
        <Checkbox
          checked={doHighlightSentence}
          onChange={handleHighlightSentences}
        />
      }
      label={keyword("highlight_important_sentence")}
    />
  );

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
          resolvedMode={resolvedMode}
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
                highlightImportantSentence={highlightImportantSentence}
              />
            )}
            {/* {filteredSentences.length > 0 ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={doHighlightSentence}
                    onChange={handleHighlightSentences}
                  />
                }
                label={keyword("highlight_important_sentence")}
              />
            ) : null} */}
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
  colours,
  coloursDark,
  orderedCategories,
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
        needleColor={resolvedMode === "dark" ? "#5A5A5A" : "#D3D3D3"}
        needleBaseColor={resolvedMode === "dark" ? "#5A5A5A" : "#D3D3D3"}
        arcsLength={[0.05, 0.45, 0.45, 0.05]}
        percent={categories[mgtOverallScoreLabel] ? percentScore / 100.0 : null}
        style={{
          width: "100%",
        }}
        colors={resolvedMode === "dark" ? coloursDark : colours}
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
        colors={resolvedMode === "dark" ? coloursDark : colours}
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
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  primaryColour,
  keyword,
  credibilitySignal,
  highlightImportantSentence,
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
    // <>
    //   {credibilitySignal === keyword("news_framing_title") ? (
    //     <Tooltip title={tooltipText}>
    //       <List>{output}</List>
    //     </Tooltip>
    //   ) : (
    //     <List>{output}</List>
    //   )}
    // </>
    <>
      {credibilitySignal === keyword("news_framing_title") ? (
        <List>
          {output}
          {/* <ListItem>
            <Typography>Category colour scale:</Typography>
          </ListItem>
          <ListItem>
            <ColourGradientScale
              textLow={keyword("low_confidence")}
              textHigh={keyword("high_confidence")}
              rgbList={[rgbLow, rgbHigh]}
            />
          </ListItem> */}
          <Divider
            key={"sentence_category"}
            sx={{ height: "1em", color: "white" }}
          />
          <Typography align="left">Category colour scale:</Typography>
          <ColourGradientScale
            textLow={keyword("low_confidence")}
            textHigh={keyword("high_confidence")}
            rgbList={[rgbLow, rgbHigh]}
          />
          {/* <Divider key={"sentence_category"} sx={{ color: "gray"}} /> */}
          <Divider
            key={"sentence_category"}
            sx={{ height: "1em", color: "white" }}
          />
          {highlightImportantSentence}
        </List>
      ) : (
        <>
          <List>
            {output}
            <Divider
              key={"sentence_category"}
              sx={{ height: "1em", color: "white" }}
            />
            {/* <Divider key={"sentence_category"} sx={{ color: "gray"}} /> */}
            {/* {highlightImportantSentence} */}
            {/* <ListItem>
            <Typography>Sentence colour scale:</Typography>
          </ListItem> */}
            {/* <ListItem>
            <ColourGradientScale
              textLow={credibilitySignal === keyword("subjectivity_ttile") ? keyword("low_confidence") : keyword("low_importance")}
              textHigh={credibilitySignal === keyword("subjectivity_ttile") ? keyword("high_confidence") : keyword("high_importance")}
              rgbList={[rgbLow, rgbHigh]}
            />
          </ListItem> */}
          </List>
          <Typography align="left">Sentence colour scale:</Typography>
          <ColourGradientScale
            textLow={
              credibilitySignal === keyword("subjectivity_ttile")
                ? keyword("low_confidence")
                : keyword("low_importance")
            }
            textHigh={
              credibilitySignal === keyword("subjectivity_ttile")
                ? keyword("high_confidence")
                : keyword("high_importance")
            }
            rgbList={[rgbLow, rgbHigh]}
          />
          {highlightImportantSentence}
        </>
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
