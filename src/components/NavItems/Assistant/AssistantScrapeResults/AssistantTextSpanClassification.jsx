import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import { styled } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import {
  SummaryReturnButton,
  ThresholdSlider,
  getPersuasionCategoryColours,
  getPersuasionCategoryTechnique,
  mergeSpanIndices,
  primaryRgb,
  rgbToLuminance,
  rgbToString,
  treeMapToElements,
  wrapPlainTextSpan,
} from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { setImportantSentenceThreshold } from "@/redux/actions/tools/assistantActions";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

// Had to create a custom styled span as the default style attribute does not support
// :hover metaclass
const StyledSpan = styled("span")(({ theme }) => ({
  ...theme,
}));

export default function AssistantTextSpanClassification({
  text,
  classification,
  titleText = "",
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
  setTextTabIndex = 0,
}) {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // title
  const persuasionTitle = keyword("persuasion_techniques_title");

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // slider
  const importantSentenceThreshold = useSelector(
    (state) => state.assistant.importantSentenceThreshold,
  );

  const handleSliderChange = (event, newValue) => {
    dispatch(setImportantSentenceThreshold(newValue));
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

  // filter classification
  let filteredClassification = filterLabelsWithMinThreshold(
    classification,
    importantSentenceThreshold / 100.0,
  );

  const [currentLabel, setCurrentLabel] = useState(null);

  function handleCategorySelect(categoryKey) {
    setCurrentLabel(categoryKey);
  }

  // defining persuasion technique category colours
  const persuasionTechniqueCategoryColours =
    getPersuasionCategoryColours(configs);

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
        getPersuasionCategoryTechnique(persuasionTechniqueLabel);
      let divText =
        keyword(persuasionTechniqueCategory) +
        ": " +
        keyword(persuasionTechnique);
      let techniqueBackgroundRgb =
        persuasionTechniqueCategoryColours[persuasionTechniqueCategory];
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

    let techniquesTooltip = <div className={"content"}>{techniqueContent}</div>;

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

    if (mergedSpanIndices.length > 0) {
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
    <Grid container>
      <Grid size={{ xs: 9 }} sx={{ paddingRight: "1em" }}>
        <MultiCategoryClassifiedText
          categoriesText={categoriesText}
          currentLabel={currentLabel}
          allCategoriesLabel={allCategoriesLabel}
        />
      </Grid>
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
            <CategoriesListToggle
              categories={uniqueCategories}
              colours={persuasionTechniqueCategoryColours}
              noCategoriesText={keyword("no_detected_techniques")}
              allCategoriesLabel={allCategoriesLabel}
              onCategoryChange={handleCategorySelect}
              keyword={keyword}
              importantSentenceThreshold={importantSentenceThreshold}
              handleSliderChange={handleSliderChange}
              credibilitySignal={persuasionTitle}
            />
            <SummaryReturnButton
              setTextTabIndex={setTextTabIndex}
              text={keyword("summary_title")}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export function CategoriesListToggle({
  categories,
  colours,
  noCategoriesText,
  allCategoriesLabel,
  onCategoryChange = () => {},
  keyword,
  importantSentenceThreshold,
  handleSliderChange,
  credibilitySignal,
}) {
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
    if (category === allCategoriesLabel) {
      continue;
    }

    if (index > 0) {
      categoriesList.push(<Divider key={index} />);
    }

    // format of category is "persuasionTechniqueCategory__persuasionTechnique"
    const [persuasionTechniqueCategory, persuasionTechnique] =
      getPersuasionCategoryTechnique(category);
    let backgroundRgb = colours[persuasionTechniqueCategory];
    let bgLuminance = rgbToLuminance(backgroundRgb);
    let textColour = "white";
    if (bgLuminance > 0.7) textColour = "black";
    const itemText =
      keyword(persuasionTechniqueCategory) +
      ": " +
      keyword(persuasionTechnique);
    const itemChip = (
      <Chip
        label={categories[category].length}
        sx={{
          color: rgbToString(backgroundRgb),
          backgroundColor: "white",
        }}
      />
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
          boxShadow: "0.15em 0.15em 0.15em gray",
          ":hover": {
            background: rgbToString(backgroundRgb),
            boxShadow: "0.25em 0.25em 0.25em gray",
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

  return (
    <>
      <Typography fontSize="small" sx={{ textAlign: "start" }}>
        {keyword("threshold_slider_certainty")}
      </Typography>
      <ThresholdSlider
        credibilitySignal={credibilitySignal}
        importantSentenceThreshold={importantSentenceThreshold}
        handleSliderChange={handleSliderChange}
      />
      <List>
        {_.isEmpty(categoriesList) ? (
          <ListItem key={noCategoriesText}>
            <Typography>{noCategoriesText}</Typography>
          </ListItem>
        ) : (
          categoriesList
        )}
      </List>
    </>
  );
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
