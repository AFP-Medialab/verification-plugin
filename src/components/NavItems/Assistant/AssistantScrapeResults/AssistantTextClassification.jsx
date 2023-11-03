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
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import sharedTsv from "../../../../LocalDictionary/components/Shared/utils.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import IconButton from "@mui/material/IconButton";
import FileCopyOutlined from "@mui/icons-material/FileCopy";

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
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv
  );
  const sharedKeyword = useLoadLanguage(
    "components/Shared/utils.tsv",
    sharedTsv
  );

  const classes = useMyStyles();
  const dispatch = useDispatch();

  let filteredCategories = {};
  let filteredSentences = [];
  const [highlightSentences, setHighlightSentences] = useState(true);
  const handleHighlightSentences = (event) => {
    setHighlightSentences(event.target.checked);
  };

  function interpRgb(value, low, high, rgbLow, rgbHigh) {
    let interp = value;
    if (value < low) interp = low;
    if (value > high) interp = high;
    interp = (interp - low) / (high - low);

    let output = [];
    for (let i = 0; i < rgbLow.length; i++) {
      let channelLow = rgbLow[i];
      let channelHigh = rgbHigh[i];
      let delta = channelHigh - channelLow;
      output.push(channelLow + delta * interp);
    }

    return output;
  }

  function rgbToString(rgbList) {
    return "rgba(" + rgbList[0] + "," + rgbList[1] + "," + rgbList[2] + ",1)";
  }

  function rgbToLuminance(rgbList) {
    let rgbNorm = rgbList.map((c) => c / 255);
    let rgbLinear = rgbNorm.map((c) => {
      if (c <= 0.04045) {
        return c / 12.92;
      } else {
        return Math.pow((c + 0.055) / 1.055, 2.4);
      }
    });
    let luminance =
      rgbLinear[0] * 0.2126 + rgbLinear[1] * 0.7152 + rgbLinear[2] * 0.0722;
    return luminance;
  }

  function rgbListToGradient(rgbList) {
    let gradientStr = "";
    for (let i = 0; i < rgbList.length; i++) {
      let colourStr = rgbToString(rgbList[i]);
      let percentageStr = Math.round(
        (i / (rgbList.length - 1)) * 100
      ).toString();

      if (i > 0) gradientStr += ",";
      gradientStr += colourStr + " " + percentageStr + "%";
    }
    const output = "linear-gradient(90deg, " + gradientStr + ")";
    return output;
  }

  function CategoriesList({ categories }) {
    if (categories.length < 1) return <p>No detected categories</p>;

    let output = [];
    let index = 0;
    for (const category in categories) {
      if (index > 0) {
        output.push(<Divider />);
      }
      let backgroundRgb = interpRgb(
        categories[category][0].score,
        configs.confidenceThresholdLow,
        configs.confidenceThresholdHigh,
        configs.confidenceRgbLow,
        configs.confidenceRgbHigh
      );
      let bgLuminance = rgbToLuminance(backgroundRgb);
      let textColour = "white";
      if (bgLuminance > 0.7) textColour = "black";

      output.push(
        <ListItem
          key={index}
          sx={{
            background: rgbToString(backgroundRgb),
            color: textColour,
          }}
        >
          <ListItemText primary={category.replaceAll("_", " ")} />
        </ListItem>
      );
      index++;
    }
    return <List>{output}</List>;
  }

  /*
  Takes input from topic classifier and convert them into html sentence highlighting
   */
  function ClassifiedText({ text, sentenceIndices, highlightSentence }) {
    let output = text; //Defaults to text output

    let outputSentences = [];

    if (highlightSentence && importantSentenceKey in classification) {
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
          configs.importanceThresholdLow,
          configs.importanceThresholdHigh,
          configs.importanceRgbLow,
          configs.importanceRgbHigh
        );
        let bgLuminance = rgbToLuminance(backgroundRgb);
        let textColour = "white";
        if (bgLuminance > 0.7) textColour = "black";

        // Append highlighted text
        outputSentences.push(
          <Tooltip title={importanceTooltip()}>
            <span
              style={{
                background: rgbToString(backgroundRgb),
                color: textColour,
              }}
            >
              {text.substring(spanIndexStart, spanIndexEnd)}
            </span>
          </Tooltip>
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

  function ColourGradientScale({ textLow, textHigh, rgbList }) {
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

  function confidenceTooltip() {
    return (
      <div className={"content"}>
        {helpDescription}
        <p>The colour scale is shown below:</p>
        <ColourGradientScale
          textLow={"Low Confidence"}
          textHigh={"High Confidence"}
          rgbList={[configs.confidenceRgbLow, configs.confidenceRgbHigh]}
        />
      </div>
    );
  }

  function importanceTooltip() {
    return (
      <div className={"content"}>
        <p>
          The background of highlighted sentences varies depending on the
          detection algorithm's rating of its importance. The colour scale is
          shown below:
        </p>
        <ColourGradientScale
          textLow={"Low Importance"}
          textHigh={"High Importance"}
          rgbList={[configs.importanceRgbLow, configs.importanceRgbHigh]}
        />
      </div>
    );
  }

  // Separate important sentences from categories, filter by threshold
  let categoriesObj = {};
  let sentencesList = [];
  for (let key in classification) {
    if (key === importantSentenceKey) {
      // Filter sentences above importanceThresholdLow
      const sentenceIndices = classification[key];
      for (let i = 0; i < sentenceIndices.length; i++) {
        if (sentenceIndices[i].score >= configs.importanceThresholdLow) {
          sentencesList.push(sentenceIndices[i]);
        }
      }
      filteredSentences = sentencesList;
    } else {
      //Filter categories above confidenceThreshold
      if (classification[key][0].score >= configs.confidenceThresholdLow) {
        categoriesObj[key] = classification[key];
      }
    }
  }
  filteredCategories = categoriesObj;

  return (
    <Grid container>
      <Grid item xs={9} sx={{ paddingRight: "1em" }}>
        <ClassifiedText
          text={text}
          sentenceIndices={filteredSentences}
          highlightSentence={highlightSentences}
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
                  title={confidenceTooltip()}
                  classes={{ tooltip: classes.assistantTooltip }}
                >
                  <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
                </Tooltip>
              </div>
            }
          />
          <CardContent>
            <CategoriesList categories={filteredCategories} />
            {filteredCategories.length > 0 && filteredSentences.length > 0 ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={highlightSentences}
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
