import React, { useState } from "react";

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
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

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
  titleText = "Detected Class",
  importantSentenceKey = "Important_Sentence",
  categoriesTooltipContent = "",
  configs = {
    confidenceThresholdLow: 0.8,
    confidenceThresholdHigh: 1.0,
    importanceThresholdLow: 0.0,
    importanceThresholdHigh: 1.0,
    confidenceRgbLow: [175, 9, 193],
    confidenceRgbHigh: [34, 0, 255],
    importanceRgbLow: [221, 222, 7],
    importanceRgbHigh: [228, 25, 25],
  },
  textHtmlMap = null,
  credibilitySignal = keyword("news_framing_title"),
}) {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // define category for machine generated text overall score
  const mgtOverallScore = "mgt_overall_score";

  // define sentence and category details
  let sentenceTooltipText;
  let sentenceTextLow, sentenceTextHigh;
  let sentenceRgbLow, sentenceRgbHigh;
  let sentenceThresholdLow, sentenceThresholdHigh;
  const colourScaleText = keyword("colour_scale");
  let highlyLikelyHumanRgb,
    likelyHumanRgb,
    likelyMachineRgb,
    highlyLikelyMachineRgb;
  if (credibilitySignal == keyword("machine_generated_text_title")) {
    highlyLikelyHumanRgb = configs.highlyLikelyHumanRgb;
    likelyHumanRgb = configs.likelyHumanRgb;
    likelyMachineRgb = configs.likelyMachineRgb;
    highlyLikelyMachineRgb = configs.highlyLikelyMachineRgb;
  } else if (credibilitySignal == keyword("subjectivity_title")) {
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
                categories={filteredCategories}
                keyword={keyword}
                mgtOverallScore={mgtOverallScore}
                highlyLikelyHumanRgb={highlyLikelyHumanRgb}
                likelyHumanRgb={likelyHumanRgb}
                likelyMachineRgb={likelyMachineRgb}
                highlyLikelyMachineRgb={highlyLikelyMachineRgb}
              />
            ) : (
              <CategoriesList
                categories={filteredCategories}
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
  mgtOverallScore,
  // highlyLikelyHumanRgb,
  // likelyHumanRgb,
  // likelyMachineRgb,
  // highlyLikelyMachineRgb
}) {
  console.log("categories=", categories);

  const orderedMgtCategories = [
    "highly_likely_human",
    "likely_human",
    "likely_machine",
    "highly_likely_machine",
  ];

  const mgtOverallScorePred = categories[mgtOverallScore][0]["pred"];
  const mgtOverallScorePredRgb = categories[mgtOverallScore][0]["rgb"];

  let output = [];
  output.push(
    <ListItem>
      <Typography>{keyword(mgtOverallScore)}</Typography>
    </ListItem>,
  );
  output.push(
    <ListItem
      key={mgtOverallScore}
      sx={{
        background: rgbToString(mgtOverallScorePredRgb),
        color: rgbToLuminance(mgtOverallScorePredRgb) > 0.7 ? "black" : "white",
      }}
    >
      <ListItemText primary={keyword(mgtOverallScorePred)} />
    </ListItem>,
  );
  output.push(
    <ListItem>
      {/* TODO check if a good translation exists already */}
      <Typography>{keyword("sentence_types_detected")}</Typography>
    </ListItem>,
  );
  for (const category in orderedMgtCategories) {
    //}.forEach((category) => (
    // TODO problem with this not returning the code?
    // <>
    // {console.log(category, categories[category])}
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
    //   {/* <Divider key={`divider_${category}`} />
    // </> */}
  }

  return <List>{output}</List>;
}
// return (
//   <List>
//     <ListItem>
//       <Typography>{keyword(mgtOverallScore)}</Typography>
//     </ListItem>
//     <ListItem
//       key={mgtOverallScore}
//       sx={{
//         background: rgbToString(mgtOverallScorePredRgb),
//         color: rgbToLuminance(mgtOverallScorePredRgb) > 0.7 ? "black" : "white",
//       }}
//     >
//       <ListItemText primary={keyword(mgtOverallScorePred)} />
//     </ListItem>
//     <ListItem>
//       {/* TODO check if a good translation exists already */}
//       <Typography>{keyword("sentence_types_detected")}</Typography>
//     </ListItem>
//     {orderedMgtCategories.forEach((category) => (
//       // TODO problem with this not returning the code?
//       // <>
//         // {console.log(category, categories[category])}

//         <ListItem
//           key={category}
//           sx={{
//             background: rgbToString(categories[category][0]["rgb"]),
//             color: rgbToLuminance(categories[category][0]["rgb"]) > 0.7 ? "black" : "white",
//           }}
//         >
//           <ListItemText primary={keyword(category)} />
//         </ListItem>
//       //   {/* <Divider key={`divider_${category}`} />
//       // </> */}

//     ))}
//   </List>
//)}

export function CategoriesList({
  categories,
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
  return <List>{output}</List>;
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
  // highlyLikelyHumanRgb,
  // likelyHumanRgb,
  // likelyMachineRgb,
  // highlyLikelyMachineRgb,
}) {
  let output = text; //Defaults to text output

  function wrapHighlightedText(spanText, spanInfo) {
    const spanScore = spanInfo.score;
    let backgroundRgb;
    if (credibilitySignal === keyword("machine_generated_text_title")) {
      backgroundRgb = spanInfo.rgb;
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

    return (
      <Tooltip key={uuidv4()} title={tooltipText}>
        <span
          style={{
            background: rgbToString(backgroundRgb),
            color: textColour,
          }}
        >
          {spanText}
        </span>
      </Tooltip>
    );
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
