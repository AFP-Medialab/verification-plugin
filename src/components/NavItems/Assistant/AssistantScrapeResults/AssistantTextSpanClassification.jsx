import React, { useState } from "react";

import { useColorScheme } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { styled } from "@mui/system";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
//import ColourGradientTooltipContent from "./ColourGradientTooltipContent";
import {
  //interpRgb,
  mergeSpanIndices,
  rgbToLuminance,
  rgbToString,
  treeMapToElements,
  wrapPlainTextSpan,
} from "./assistantUtils";

// Had to create a custom styled span as the default style attribute does not support
// :hover metaclass
const StyledSpan = styled("span")(({ theme }) => ({
  ...theme,
}));

// split text for category and technique
function getCategoryTechnique(category) {
  return category.split("__");
}

export default function AssistantTextSpanClassification({
  text,
  classification,
  titleText = "Detected Class",
  categoriesTooltipContent = "",
  configs = {
    perCategoryJustificationRgb: [150, 0, 255],
    perCategorySimplificationRgb: [0, 150, 255],
    perCategoryDistractionRgb: [100, 0, 255],
    perCategoryCallRgb: [0, 100, 255],
    perCategoryManipulativeRgb: [220, 0, 255],
    perCategoryAttackRgb: [0, 200, 255],
  },
  textHtmlMap = null,
}) {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // sub card header tooltip for categories
  // const colourScaleText = keyword("colour_scale");
  // const categoryTooltipText = keyword("confidence_tooltip_technique");
  // const categoryTextLow = keyword("low_severity"); // keyword("low_confidence");
  // const categoryTextHigh = keyword("high_severity"); // keyword("high_confidence");
  // const categoryThresholdLow = configs.confidenceThresholdLow;
  // const categoryThresholdHigh = configs.confidenceThresholdHigh;
  // const categoryRgbLow =
  //   resolvedMode === "dark" ? configs.orangeRgbDark : configs.orangeRgb;
  // const categoryRgbHigh =
  //   resolvedMode === "dark" ? configs.redRgbDark : configs.redRgb;
  const primaryRgb = [0, 146, 108];

  // // tooltip for hovering over categories
  // const categoryTooltipContent = (
  //   <ColourGradientTooltipContent
  //     description={keyword("confidence_tooltip_category")}
  //     colourScaleText={keyword("colour_scale")}
  //     textLow={keyword("low_confidence")}
  //     textHigh={keyword("high_confidence")}
  //     rgbLow={resolvedMode === "dark" ? configs.orangeRgbDark : configs.orangeRgb}
  //     rgbHigh={resolvedMode === "dark" ? configs.redRgbDark : configs.redRgb}
  //   />
  // );

  const [doHighlightSentence, setDoHighlightSentence] = useState(true);

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

  // slider set up
  const [importantSentenceThreshold, setImportantSentenceThreshold] =
    React.useState(80);

  const handleSliderChange = (event, newValue) => {
    setImportantSentenceThreshold(newValue);
  };

  // filter classification
  let filteredClassification = filterLabelsWithMinThreshold(
    classification,
    //configs.confidenceThresholdLow, // this to be set by slider
    importantSentenceThreshold / 100.0,
  );

  const [currentLabel, setCurrentLabel] = useState(null);

  function handleCategorySelect(categoryKey) {
    setCurrentLabel(categoryKey);
  }

  // defining persuasion technique category colours
  const persausionTechniqueCategoryColours = {
    Justification: configs.perCategoryJustificationRgb,
    Simplification: configs.perCategorySimplificationRgb,
    Distraction: configs.perCategoryDistractionRgb,
    Call: configs.perCategoryCallRgb,
    Manipulative_Wording: configs.perCategoryManipulativeRgb,
    Attack_on_Reputation: configs.perCategoryAttackRgb,
  };

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
    let backgroundRgbHover = primaryRgb;
    let textColour = "black";

    let techniqueContent = [];
    techniqueContent.push(
      <h2 key={uuidv4()}>{keyword("detected_techniques")}</h2>,
    );

    for (let persuasionTechniqueLabel in spanInfo.techniques) {
      const techniqueScore = spanInfo.techniques[persuasionTechniqueLabel];

      // collect category information for highlighted spans
      if (categories[persuasionTechniqueLabel]) {
        categories[persuasionTechniqueLabel].push({
          indices: [spanStart, spandEnd],
          score: techniqueScore,
        });
      } else {
        categories[persuasionTechniqueLabel] = [
          {
            indices: [spanStart, spandEnd],
            score: techniqueScore,
          },
        ];
      }

      let [persuasionTechniqueCategory, persuasionTechnique] =
        getCategoryTechnique(persuasionTechniqueLabel);
      let divText =
        keyword(persuasionTechniqueCategory) +
        ": " +
        keyword(persuasionTechnique);
      let techniqueBackgroundRgb =
        persausionTechniqueCategoryColours[persuasionTechniqueCategory];
      let bgLuminance = rgbToLuminance(techniqueBackgroundRgb);
      let techniqueTextColour = "white";
      if (bgLuminance > 0.7) techniqueTextColour = "black";
      techniqueContent.push(
        <div
          key={divText}
          style={{
            background: rgbToString(techniqueBackgroundRgb),
            color: rgbToString(techniqueTextColour),
            marginTop: "0.5em",
            marginBottom: "0.5em",
            padding: "0.5em",
            cursor: "pointer",
          }}
        >
          {keyword(divText)}
        </div>,
      );
    }
    //techniqueContent.push(categoryTooltipText);

    let techniquesTooltip = (
      // <ColourGradientTooltipContent
      //   description={techniqueContent}
      //   colourScaleText={colourScaleText}
      //   textLow={categoryTextLow}
      //   textHigh={categoryTextHigh}
      //   rgbLow={categoryRgbLow}
      //   rgbHigh={categoryRgbHigh}
      //   // don't need colour scale here anymore? at least not the scale
      // />
      <div className={"content"}>{techniqueContent}</div>
    );

    // Append highlighted text
    return (
      <Tooltip key={uuidv4()} title={techniquesTooltip}>
        <StyledSpan
          sx={{
            background: rgbToString(backgroundRgb),
            color: textColour,
            ":hover": {
              background: rgbToString(backgroundRgbHover),
              color: resolvedMode === "dark" ? "black" : "white",
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
    } else {
      output = text;
    }

    categoriesText[collection] = output;
  }

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

  return (
    <Grid2 container>
      <Grid2 size={{ xs: 9 }} sx={{ paddingRight: "1em" }}>
        <MultiCategoryClassifiedText
          categoriesText={categoriesText}
          currentLabel={currentLabel}
          allCategoriesLabel={allCategoriesLabel}
        />
      </Grid2>
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
            <CategoriesListToggle
              categories={uniqueCategories}
              colours={persausionTechniqueCategoryColours}
              //tooltipContent={categoryTooltipContent}
              // thresholdLow={configs.confidenceThresholdLow}
              // thresholdHigh={configs.confidenceThresholdHigh}
              // rgbLow={categoryRgbLow}
              // rgbHigh={categoryRgbHigh}
              noCategoriesText={keyword("no_detected_techniques")}
              allCategoriesLabel={allCategoriesLabel}
              onCategoryChange={handleCategorySelect}
              keyword={keyword}
              importantSentenceThreshold={importantSentenceThreshold}
              handleSliderChange={handleSliderChange}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

export function CategoriesListToggle({
  categories,
  colours,
  //tooltipContent,
  // thresholdLow,
  // thresholdHigh,
  // rgbLow,
  // rgbHigh,
  noCategoriesText,
  allCategoriesLabel,
  onCategoryChange = () => {},
  keyword,
  importantSentenceThreshold,
  handleSliderChange,
}) {
  let sliderList = [];

  // slider
  sliderList.push(
    <ListItem key={keyword("important_sentence_threshold")}>
      <Typography>{keyword("important_sentence_threshold")}</Typography>
    </ListItem>,
  );

  const marks = [
    {
      value: 0,
      label: "Low",
    },
    {
      value: 100,
      label: "High",
    },
  ];

  const scaleValue = (value) => {
    return value / 100;
  };

  sliderList.push(
    <ListItem key={"slider"}>
      <Slider
        aria-label="important sentence threshold slider"
        marks={marks}
        scale={scaleValue}
        defaultValue={80} // on loading thing it keeps resetting to 80
        value={importantSentenceThreshold}
        onChange={handleSliderChange}
      />
    </ListItem>,
  );

  // categories
  let categoriesList = [];
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

  // order categories by highest number of sentences first
  const sortedCategories = Object.fromEntries(
    Object.entries(categories).sort(([, a], [, b]) => b.length - a.length),
  );
  for (const category in sortedCategories) {
    // don't display overall category
    if (category == allCategoriesLabel) {
      continue;
    }

    if (index > 0) {
      categoriesList.push(<Divider key={index} />);
    }

    // // find colour of background givens sum(scores)/num_scores
    // let scores = categories[category].map((categoryItem) =>
    //   Number(categoryItem.score),
    // );
    // let scoresSum = scores.reduce(
    //   (accumulator, currentScore) => accumulator + currentScore,
    //   0,
    // );
    // let backgroundRgb = interpRgb(
    //   scoresSum / scores.length,
    //   thresholdLow,
    //   thresholdHigh,
    //   rgbLow,
    //   rgbHigh,
    // );

    // format of category is "persuasionTechniqueCategory__persuasionTechnique"
    const [persuasionTechniqueCategory, persuasionTechnique] =
      getCategoryTechnique(category);
    let backgroundRgb = colours[persuasionTechniqueCategory];
    let bgLuminance = rgbToLuminance(backgroundRgb);
    let textColour = "white";
    if (bgLuminance > 0.7) textColour = "black";
    const itemText =
      keyword(persuasionTechniqueCategory) +
      ": " +
      keyword(persuasionTechnique);
    const itemChip = (
      <Chip color="primary" label={categories[category].length} />
    );

    categoriesList.push(
      <ListItem
        key={category}
        sx={{
          background:
            category === currentCategory || currentCategory === null
              ? rgbToString(backgroundRgb)
              : rgbToString([140, 140, 140]),
          color: textColour,
          ":hover": {
            background: rgbToString(backgroundRgb),
          },
          cursor: "pointer",
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

  if (_.isEmpty(categoriesList)) {
    return (
      <List>
        {sliderList}
        <ListItem key={noCategoriesText}>
          <Typography>{noCategoriesText}</Typography>
        </ListItem>
      </List>
    );
  } else {
    return (
      <List>
        {sliderList}
        <ListItem key={keyword("select_persuasion_technique")}>
          <Typography>{keyword("select_persuasion_technique")}</Typography>
        </ListItem>
        {categoriesList}
      </List>
    );
  }
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
