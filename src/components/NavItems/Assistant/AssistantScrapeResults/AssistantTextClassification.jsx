import React, { useState } from "react";
import Card from "@mui/material/Card";
import {
  CardHeader,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import {
  interpRgb,
  rgbToString,
  rgbToLuminance,
  treeMapToElements,
  wrapPlainTextSpan,
} from "./assistantUtils";
import ColourGradientTooltipContent from "./ColourGradientTooltipContent";

import "./assistantTextResultStyle.css";

export default function AssistantTextClassification({
  text,
  classification,
  titleText = "Detected Class",
  importantSentenceKey = "Important_Sentence",
  helpDescription = "",
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
  subjectivity = false,
}) {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // subjectivity or not
  let toolipText;
  let textLow, textHigh;
  let rgbLow, rgbHigh;
  if (subjectivity) {
    toolipText = <p>{keyword("confidence_tooltip_sentence")}</p>;
    textLow = keyword("low_confidence");
    textHigh = keyword("high_confidence");
    rgbLow = configs.confidenceRgbLow;
    rgbHigh = configs.confidenceRgbHigh;
  } else {
    toolipText = <p>{keyword("importance_tooltip")}</p>;
    textLow = keyword("low_importance");
    textHigh = keyword("high_importance");
    rgbLow = configs.importanceRgbLow;
    rgbHigh = configs.importanceRgbHigh;
  }

  const importanceTooltipContent = (
    <ColourGradientTooltipContent
      description={toolipText}
      colourScaleText={keyword("colour_scale")}
      textLow={textLow}
      textHigh={textHigh}
      rgbLow={rgbLow}
      rgbHigh={rgbHigh}
    />
  );
  const confidenceTooltipContent = (
    <ColourGradientTooltipContent
      description={keyword(helpDescription)}
      colourScaleText={keyword("colour_scale")}
      textLow={keyword("low_importance")}
      textHigh={keyword("high_importance")}
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
      // Filter sentences above importanceThresholdLow
      const sentenceIndices = classification[label];
      for (let i = 0; i < sentenceIndices.length; i++) {
        if (sentenceIndices[i].score >= configs.importanceThresholdLow) {
          filteredSentences.push(sentenceIndices[i]);
        }
      }
    } else {
      //Filter categories above confidenceThreshold
      if (classification[label][0].score >= configs.confidenceThresholdLow) {
        filteredCategories[label] = classification[label];
      }
    }
  }

  // disabled category box for Subjectivity classifier
  // subjectivty or not
  let width = 12;
  if (!subjectivity) {
    width = 9;
  }

  return (
    <Grid container>
      <Grid item xs={width} sx={{ paddingRight: "1em" }}>
        <ClassifiedText
          text={text}
          spanIndices={filteredSentences}
          highlightSpan={doHighlightSentence}
          tooltipText={importanceTooltipContent}
          thresholdLow={configs.importanceThresholdLow}
          thresholdHigh={configs.importanceThresholdHigh}
          rgbLow={rgbLow}
          rgbHigh={rgbHigh}
          textHtmlMap={textHtmlMap}
        />
      </Grid>
      {!subjectivity ? (
        <Grid item xs={3}>
          <Card>
            <CardHeader
              className={classes.assistantCardHeader}
              title={titleText}
              action={
                <div style={{ display: "flex" }}>
                  <Tooltip
                    interactive={"true"}
                    title={confidenceTooltipContent}
                    classes={{ tooltip: classes.assistantTooltip }}
                  >
                    <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
                  </Tooltip>
                </div>
              }
            />
            <CardContent>
              <CategoriesList
                categories={filteredCategories}
                noCategoriesText={keyword("no_detected_categories")}
                thresholdLow={configs.confidenceThresholdLow}
                thresholdHigh={configs.confidenceThresholdHigh}
                rgbLow={configs.confidenceRgbLow}
                rgbHigh={configs.confidenceRgbHigh}
                keyword={keyword}
              />
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
        </Grid>
      ) : null}
    </Grid>
  );
}

export function CategoriesList({
  categories,
  noCategoriesText,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  keyword,
}) {
  if (categories.length < 1) return <p>{noCategoriesText}</p>;

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
}) {
  let output = text; //Defaults to text output

  function wrapHighlightedText(spanText, spanInfo) {
    const spanScore = spanInfo.score;
    let backgroundRgb = interpRgb(
      spanScore,
      thresholdLow,
      thresholdHigh,
      rgbLow,
      rgbHigh,
    );
    let bgLuminance = rgbToLuminance(backgroundRgb);
    let textColour = "white";
    if (bgLuminance > 0.7) textColour = "black";

    return (
      <Tooltip title={tooltipText}>
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
