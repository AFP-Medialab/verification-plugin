import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {
  CardHeader,
  Checkbox,
  Chip,
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
  treeMapToElements,
  mergeSpanIndices,
  wrapPlainTextSpan,
} from "./assistantUtils";
import {
  ClassifiedText,
  ColourGradientTooltipContent,
} from "./AssistantTextClassification";
import { styled } from "@mui/system";
import _ from "lodash";

export default function AssistantTextSpanClassification({
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
}) {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const tooltipTextLowThreshold = "Low confidence";
  const tooltipTextHighThresoled = "High confidence";

  const confidenceTooltipContent = (
    <ColourGradientTooltipContent
      description={helpDescription}
      textLow={tooltipTextLowThreshold}
      textHigh={tooltipTextHighThresoled}
      rgbLow={configs.confidenceRgbLow}
      rgbHigh={configs.confidenceRgbHigh}
    />
  );

  const [doHighlightSentence, setDoHighlightSentence] = useState(true);
  const handleHighlightSentences = (event) => {
    setDoHighlightSentence(event.target.checked);
  };

  function filterLabelsWithMinThreshold(classification, minThreshold) {
    let filteredLabels = {};
    for (let label in classification) {
      let spanList = [];
      for (let i = 0; i < classification[label].length; i++) {
        if (classification[label][i].score >= minThreshold) {
          spanList.push(classification[label][i]);
        }
      }

      if (spanList.length > 0) {
        filteredLabels[label] = spanList;
      }
    }
    return filteredLabels;
  }

  let filteredClassification = filterLabelsWithMinThreshold(
    classification,
    configs.confidenceThresholdLow,
  );
  const [currentLabel, setCurrentLabel] = useState(null);

  function handleCategorySelect(categoryKey) {
    setCurrentLabel(categoryKey);
  }

  return (
    <Grid container>
      <Grid item xs={9} sx={{ paddingRight: "1em" }}>
        <MultiCategoryClassifiedText
          text={text}
          classification={filteredClassification}
          currentLabel={currentLabel}
          highlightSpan={doHighlightSentence}
          tooltipText={helpDescription}
          thresholdLowText={tooltipTextLowThreshold}
          thresholdHighText={tooltipTextHighThresoled}
          thresholdLow={configs.confidenceThresholdLow}
          thresholdHigh={configs.confidenceThresholdHigh}
          rgbLow={configs.confidenceRgbLow}
          rgbHigh={configs.confidenceRgbHigh}
          textHtmlMap={textHtmlMap}
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
            <CategoriesListToggle
              categories={filteredClassification}
              thresholdLow={configs.confidenceThresholdLow}
              thresholdHigh={configs.confidenceThresholdHigh}
              rgbLow={configs.confidenceRgbLow}
              rgbHigh={configs.confidenceRgbHigh}
              onCategoryChange={handleCategorySelect}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export function CategoriesListToggle({
  categories,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  onCategoryChange = () => {},
}) {
  if (categories.length < 1) return <p>No detected categories</p>;

  let output = [];
  let index = 0;
  const [currentCategory, setCurrentCategory] = useState(null);

  function handleCategorySelect(categoryLabel) {
    if (categoryLabel === currentCategory) {
      setCurrentCategory(null);
      onCategoryChange(null);
    } else {
      setCurrentCategory(categoryLabel);
      onCategoryChange(categoryLabel);
    }
  }

  function handleCategoryHover(categoryLabel) {
    onCategoryChange(categoryLabel);
  }

  function handleCategoryOut() {
    onCategoryChange(currentCategory);
  }

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

    const itemText = category.replaceAll("_", " ");
    const itemChip = (
      <Chip color="primary" label={categories[category].length} />
    );

    output.push(
      <ListItem
        key={category}
        sx={{
          background:
            category === currentCategory || currentCategory === null
              ? rgbToString(rgbHigh)
              : rgbToString([140, 140, 140]),
          color: textColour,
          ":hover": {
            background: rgbToString(rgbHigh),
          },
        }}
        secondaryAction={itemChip}
        onMouseOver={() => handleCategoryHover(category)}
        onMouseLeave={() => handleCategoryOut()}
        onClick={() => handleCategorySelect(category)}
      >
        <ListItemText key={category} primary={itemText} />
      </ListItem>,
    );
    index++;
  }
  return <List>{output}</List>;
}

// Had to create a custom styled span as the default style attribute does not support
// :hover metaclass
const StyledSpan = styled("span")();

export function MultiCategoryClassifiedText({
  text,
  classification,
  currentLabel,
  highlightSpan,
  tooltipText,
  thresholdLowText,
  thresholdHighText,
  thresholdLow,
  thresholdHigh,
  rgbLow,
  rgbHigh,
  textHtmlMap = null,
}) {
  let output = text; //Defaults to text output

  // Filter for selecting all labels (currentLabel == null) or just a single label
  const filteredClassification =
    currentLabel !== null && currentLabel in classification
      ? { [currentLabel]: classification[currentLabel] }
      : classification;

  // Classification variable is a map of categories where each one has a list of classified spans, we
  // have to invert that so that we have a list of spans that contains all categories in that span
  let mergedSpanIndices = mergeSpanIndices(filteredClassification);

  function wrapHighlightedText(spanText, spanInfo) {
    let backgroundRgb = [210, 210, 210];
    let backgroundRgbHover = [255, 100, 100];
    let textColour = "black";

    let techniqueContent = [];
    techniqueContent.push(<h2>Detected techniques</h2>);

    for (let persuasionTechnique in spanInfo.techniques) {
      const techniqueScore = spanInfo.techniques[persuasionTechnique];
      let techniqueBackgroundRgb = interpRgb(
        techniqueScore,
        thresholdLow,
        thresholdHigh,
        rgbLow,
        rgbHigh,
      );
      let bgLuminance = rgbToLuminance(techniqueBackgroundRgb);
      let techniqueTextColour = "white";
      if (bgLuminance > 0.7) techniqueTextColour = "black";
      techniqueContent.push(
        <div
          style={{
            background: rgbToString(techniqueBackgroundRgb),
            color: rgbToString(techniqueTextColour),
            marginTop: "0.5em",
            marginBottom: "0.5em",
            padding: "0.5em",
          }}
        >
          {persuasionTechnique.replaceAll("_", " ")}
        </div>,
      );
    }
    techniqueContent.push(tooltipText);

    let techniquesTooltip = (
      <ColourGradientTooltipContent
        description={techniqueContent}
        textLow={thresholdLowText}
        textHigh={thresholdHighText}
        rgbLow={rgbLow}
        rgbHigh={rgbHigh}
      />
    );

    // Append highlighted text
    return (
      <Tooltip title={techniquesTooltip}>
        <StyledSpan
          sx={{
            background: rgbToString(backgroundRgb),
            color: textColour,
            ":hover": {
              background: rgbToString(backgroundRgbHover),
            },
          }}
        >
          {spanText}
        </StyledSpan>
      </Tooltip>
    );
  }

  if (highlightSpan && mergedSpanIndices.length > 0) {
    if (textHtmlMap) {
      // Text formatted & highlighted
      output = treeMapToElements(
        text,
        textHtmlMap,
        mergedSpanIndices,
        wrapHighlightedText,
      );
    } else {
      // Plaintex & highlighted
      output = wrapPlainTextSpan(text, mergedSpanIndices, wrapHighlightedText);
    }
  } else if (textHtmlMap) {
    // Text formatted but not highlighted
    output = treeMapToElements(text, textHtmlMap);
  }

  return <Typography align={"left"}>{output}</Typography>;
}
