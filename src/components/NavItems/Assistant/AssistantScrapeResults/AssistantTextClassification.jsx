import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
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
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  WarningOutlined,
} from "@mui/icons-material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import Grid from "@mui/material/Grid";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import TranslateIcon from "@mui/icons-material/Translate";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import IconButton from "@mui/material/IconButton";
import FileCopyOutlined from "@mui/icons-material/FileCopy";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import {
  interpRgb,
  rgbToString,
  rgbToLuminance,
  rgbListToGradient,
} from "./assistantUtils";

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
}) {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const importanceToolipText = (
    <p>
      The background of highlighted sentences varies depending on the detection
      algorithm's rating of its importance.
    </p>
  );
  const importanceTooltipContent = (
    <ColourGradientTooltipContent
      description={importanceToolipText}
      textLow={"Low importance"}
      textHigh={"High importance"}
      rgbLow={configs.importanceRgbLow}
      rgbHigh={configs.importanceRgbHigh}
    />
  );
  const confidenceTooltipContent = (
    <ColourGradientTooltipContent
      description={helpDescription}
      textLow={"Low Confidence"}
      textHigh={"High Confidence"}
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

  return (
    <Grid container>
      <Grid item xs={9} sx={{ paddingRight: "1em" }}>
        <ClassifiedText
          text={text}
          sentenceIndices={filteredSentences}
          highlightSentence={doHighlightSentence}
          tooltipText={importanceTooltipContent}
          thresholdLow={configs.importanceThresholdLow}
          thresholdHigh={configs.importanceThresholdHigh}
          rgbLow={configs.importanceRgbLow}
          rgbHigh={configs.importanceRgbHigh}
        />
      </Grid>
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
              thresholdLow={configs.confidenceThresholdLow}
              thresholdHigh={configs.confidenceThresholdHigh}
              rgbLow={configs.confidenceRgbLow}
              rgbHigh={configs.confidenceRgbHigh}
            />
            {filteredSentences.length > 0 ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={doHighlightSentence}
                    onChange={handleHighlightSentences}
                  />
                }
                label="Highlight important sentences"
              />
            ) : null}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export function CategoriesList({
  categories,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
}) {
  if (categories.length < 1) return <p>No detected categories</p>;

  let output = [];
  let index = 0;
  for (const category in categories) {
    if (index > 0) {
      output.push(<Divider />);
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
        <ListItemText primary={category.replaceAll("_", " ")} />
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
  sentenceIndices,
  highlightSentence,
  tooltipText,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
}) {
  let output = text; //Defaults to text output

  let outputSentences = [];

  if (highlightSentence && sentenceIndices.length > 0) {
    const textLength = text.length;
    let currentIndex = 0;

    // Find span to highlight
    for (let i = 0; i < sentenceIndices.length; i++) {
      const spanIndexStart = sentenceIndices[i]["indices"][0];
      // Sometimes the end index is negative so we have to check this
      const spanIndexEnd =
        sentenceIndices[i]["indices"][1] > -1
          ? sentenceIndices[i]["indices"][1]
          : textLength;
      const spanScore = sentenceIndices[i]["score"];

      // Append but don't highlight any span before
      if (currentIndex < spanIndexStart) {
        outputSentences.push(text.substring(currentIndex, spanIndexStart));
      }

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

      // Append highlighted text
      outputSentences.push(
        <Tooltip title={tooltipText}>
          <span
            style={{
              background: rgbToString(backgroundRgb),
              color: textColour,
            }}
          >
            {text.substring(spanIndexStart, spanIndexEnd)}
          </span>
        </Tooltip>,
      );

      currentIndex = spanIndexEnd;
    }

    // Append anything not highlighted
    if (currentIndex < textLength) {
      outputSentences.push(text.substring(currentIndex, textLength));
    }

    output = outputSentences;
  }

  return (
    <Typography align={"left"}>
      <FormatQuoteIcon fontSize={"large"} />
      {output}
    </Typography>
  );
}

export function ColourGradientScale({ textLow, textHigh, rgbList }) {
  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Typography align="left" fontSize="small" fontWeight="bold">
            {textLow}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography align="right" fontSize="small" fontWeight="bold">
            {textHigh}
          </Typography>
        </Grid>
      </Grid>
      <div
        style={{
          width: "100%",
          height: "1em",
          background: rgbListToGradient(rgbList),
        }}
      />
    </>
  );
}

export function ColourGradientTooltipContent({
  description = "",
  textLow = "Low",
  textHigh = "High",
  rgbLow = [0, 0, 0],
  rgbHigh = [255, 255, 255],
}) {
  return (
    <div className={"content"}>
      {description}
      <p>The colour scale is shown below:</p>
      <ColourGradientScale
        textLow={textLow}
        textHigh={textHigh}
        rgbList={[rgbLow, rgbHigh]}
      />
    </div>
  );
}
