import React, { useState } from "react";

import Card from "@mui/material/Card";
import { CardHeader, Chip, List, ListItem, ListItemText } from "@mui/material";
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
  mergeSpanIndices,
  wrapPlainTextSpan,
} from "./assistantUtils";
import ColourGradientTooltipContent from "./ColourGradientTooltipContent";
import { styled } from "@mui/system";

// Had to create a custom styled span as the default style attribute does not support
// :hover metaclass
const StyledSpan = styled("span")();

export default function AssistantTextSpanClassification({
  text,
  classification,
  titleText = "Detected Class",
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
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const tooltipTextLowThreshold = keyword("low_confidence");
  const tooltipTextHighThreshold = keyword("high_confidence");

  const confidenceTooltipContent = (
    <ColourGradientTooltipContent
      description={keyword(helpDescription)}
      textLow={tooltipTextLowThreshold}
      textHigh={tooltipTextHighThreshold}
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

  // finding categories and their spans with scores, and the text for each category
  let categories = {};
  let categoriesText = {};

  // combine all sentences for an overall category
  let collectFilteredClassification = {};
  for (let category in filteredClassification) {
    collectFilteredClassification[category] = {
      [category]: filteredClassification[category],
    };
  }
  const allCategoriesLabel = "all";
  collectFilteredClassification[allCategoriesLabel] = filteredClassification;

  // wrap function for calculating spanhighlights and categories
  function wrapHighlightedText(spanText, spanInfo, spanStart, spandEnd) {
    let backgroundRgb = [210, 210, 210];
    let backgroundRgbHover = [255, 100, 100];
    let textColour = "black";

    let techniqueContent = [];
    techniqueContent.push(<h2>{keyword("detected_techniques")}</h2>);

    for (let persuasionTechnique in spanInfo.techniques) {
      const techniqueScore = spanInfo.techniques[persuasionTechnique];

      // collect category information for highlighted spans
      // let span = {
      //   indices: [spanStart, spandEnd],
      //   score: techniqueScore,
      // };
      if (categories[persuasionTechnique]) {
        categories[persuasionTechnique].push({
          indices: [spanStart, spandEnd],
          score: techniqueScore,
        });
      } else {
        categories[persuasionTechnique] = [
          {
            indices: [spanStart, spandEnd],
            score: techniqueScore,
          },
        ];
      }

      let techniqueBackgroundRgb = interpRgb(
        techniqueScore,
        configs.confidenceThresholdLow,
        configs.confidenceThresholdHigh,
        configs.confidenceRgbLow,
        configs.confidenceRgbHigh,
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
    techniqueContent.push(keyword("confidence_tooltip_technique"));

    let techniquesTooltip = (
      <ColourGradientTooltipContent
        description={techniqueContent}
        textLow={tooltipTextLowThreshold}
        textHigh={tooltipTextHighThreshold}
        rgbLow={configs.confidenceRgbLow}
        rgbHigh={configs.confidenceRgbHigh}
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

  // find the highlighted spans for each category and overall category
  for (let collection in collectFilteredClassification) {
    let output;

    // Classification variable is a map of categories where each one has a list of classified spans, we
    // have to invert that so that we have a list of spans that contains all categories in that span
    let mergedSpanIndices = mergeSpanIndices(
      collectFilteredClassification[collection],
    );

    if (doHighlightSentence && mergedSpanIndices.length > 0) {
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
        output = wrapPlainTextSpan(
          text,
          mergedSpanIndices,
          wrapHighlightedText,
        );
      }
    } else if (textHtmlMap) {
      // Text formatted but not highlighted
      output = treeMapToElements(text, textHtmlMap);
    }

    categoriesText[collection] = output;
  }

  // console.log("categories=", categories);
  // console.log("categoriesText=", categoriesText);

  // remove duplicate spans from array of categories
  // duplicates occur as categories are counted then repeated for category allCategoriesLabel
  let uniqueCategories = {};
  for (let cat in categories) {
    uniqueCategories[cat] = categories[cat].filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        categories[cat].findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });
  }

  // console.log("uniqueCategories=", uniqueCategories);

  return (
    <Grid container>
      <Grid item xs={9} sx={{ paddingRight: "1em" }}>
        <MultiCategoryClassifiedText
          categoriesText={categoriesText}
          currentLabel={currentLabel}
          allCategoriesLabel={allCategoriesLabel}
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
              categories={uniqueCategories}
              thresholdLow={configs.confidenceThresholdLow}
              thresholdHigh={configs.confidenceThresholdHigh}
              rgbLow={configs.confidenceRgbLow}
              rgbHigh={configs.confidenceRgbHigh}
              noCategoriesText={keyword("no_detected_categories")}
              allCategoriesLabel={allCategoriesLabel}
              onCategoryChange={handleCategorySelect}
              keyword={keyword}
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
  noCategoriesText,
  allCategoriesLabel,
  onCategoryChange = () => {},
  keyword,
}) {
  if (categories.length < 1) return <p>{noCategoriesText}</p>;

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
    // don't display overall category
    if (category == allCategoriesLabel) {
      continue;
    }

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

    const itemText = keyword(category);
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

export function MultiCategoryClassifiedText({
  categoriesText,
  currentLabel,
  allCategoriesLabel,
}) {
  // Filter for selecting all labels (currentLabel == null) or just a single label
  const category =
    currentLabel !== null && currentLabel in categoriesText
      ? currentLabel
      : allCategoriesLabel;

  let output = categoriesText[category];

  return (
    <Typography component={"div"} sx={{ textAlign: "start" }}>
      {output}
    </Typography>
  );
}
