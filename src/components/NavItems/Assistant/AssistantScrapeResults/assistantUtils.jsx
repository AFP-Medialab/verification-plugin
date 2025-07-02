import React from "react";
import GaugeChart from "react-gauge-chart";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ArrowBack } from "@mui/icons-material";

import GaugeChartModalExplanation from "@/components/Shared/GaugeChartResults/GaugeChartModalExplanation/index.jsx";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

/**
 * Interpolate RGB between an arbitrary range
 * @param value
 * @param low
 * @param high
 * @param rgbLow RGB Value represented as an array e.g. [255, 255, 255] for white
 * @param rgbHigh RGB Value represented as an array e.g. [255, 255, 255] for white
 * @returns {*[]}
 */
export const interpRgb = (value, low, high, rgbLow, rgbHigh) => {
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
};

/**
 * Converts an array-based RGB representation to rgba() format used by CSS
 * @param rgb RGB value represented as an array e.g. [255, 255, 255] for white
 * @returns {string}
 */
export const rgbToString = (rgb) => {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",1)";
};

/**
 * Calculates the luminance of an RGB colour
 * @param rgb RGB value represented as an array e.g. [255, 255, 255] for white
 * @returns {number}
 */
export const rgbToLuminance = (rgb) => {
  let rgbNorm = rgb.map((c) => c / 255);
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
};

/**
 * Generate CSS gradient from a list of RGB values
 * @param rgbList List RGB value represented as an array e.g. [[0,0,0], [255, 255, 255]] for a black to white gradient
 * @returns {string}
 */
export const rgbListToGradient = (rgbList) => {
  let gradientStr = "";
  for (let i = 0; i < rgbList.length; i++) {
    let colourStr = rgbToString(rgbList[i]);
    let percentageStr = Math.round((i / (rgbList.length - 1)) * 100).toString();

    if (i > 0) gradientStr += ",";
    gradientStr += colourStr + " " + percentageStr + "%";
  }
  const output = "linear-gradient(90deg, " + gradientStr + ")";
  return output;
};

/**
 * Recursively takes tree map and returns highlighted spans
 * @param text
 * @param treeElem
 * @param spanHighlightIndices
 * @param wrapFunc function(spanText, spanInfo)
 * @returns Array of plaintext or components directly renderable by react
 */
function treeMapToElementsRecursive(
  text,
  treeElem,
  spanHighlightIndices = null,
  wrapFunc = null,
) {
  let childElems = [];
  const textLength = text.length;
  if ("span" in treeElem) {
    // If there's text in the node

    const span = treeElem.span;
    if (spanHighlightIndices === null) {
      childElems.push(text.substring(span.start, span.end));
    } else {
      // If text span matches with indices for highlighting
      // then try to wrap them in wrapFunc()
      let currentIndex = span.start;
      for (let groupId = 0; groupId < spanHighlightIndices.length; groupId++) {
        const hSpan = spanHighlightIndices[groupId];
        const hSpanStart = hSpan.indices[0];
        // Sometimes the end index is negative so we have to check this
        let hSpanEnd = hSpan.indices[1] > -1 ? hSpan.indices[1] : textLength;

        if (
          (span.start <= hSpanStart && hSpanStart <= span.end) ||
          (span.start <= hSpanEnd && hSpanEnd <= span.end) ||
          (hSpanStart <= span.start && span.end <= hSpanEnd)
        ) {
          if (hSpanStart > currentIndex) {
            // If span doesn't start before the current index, add unhighlighted text
            childElems.push(text.substring(currentIndex, hSpanStart));
          }

          const boundedStart =
            hSpanStart < span.start ? span.start : hSpanStart;
          const boundedEnd = hSpanEnd > span.end ? span.end : hSpanEnd;
          if (wrapFunc) {
            childElems.push(
              wrapFunc(
                text.substring(boundedStart, boundedEnd),
                hSpan,
                boundedStart,
                boundedEnd,
                groupId,
              ),
            );
          } else {
            // No wrapFunc(), inserting plaintext
            childElems.push(text.substring(boundedStart, boundedEnd));
          }

          currentIndex = boundedEnd;
        }
      }

      // Append the rest of text
      if (currentIndex < span.end) {
        childElems.push(text.substring(currentIndex, span.end));
      }
    }
  }

  for (let i = 0; i < treeElem.children.length; i++) {
    childElems.push(
      treeMapToElementsRecursive(
        text,
        treeElem.children[i],
        spanHighlightIndices,
        wrapFunc,
      ),
    );
  }

  // Collect attributes
  let attributes = {};
  if (treeElem.attributes) {
    attributes = { ...treeElem.attributes, key: uuidv4() };
  }

  return React.createElement(treeElem.tag, attributes, childElems);
}

/**
 * Converts tree map to React components
 * @param text
 * @param mapping
 * @param spanHighlightIndices
 * @param wrapFunc function(spanText, spanInfo)
 * @returns Array of plaintext or components directly renderable by react
 */
export const treeMapToElements = (
  text,
  mapping,
  spanHighlightIndices = null,
  wrapFunc = null,
) => {
  if (mapping) {
    let output = treeMapToElementsRecursive(
      text,
      mapping,
      spanHighlightIndices,
      wrapFunc,
    );

    return output;
  } else {
    return text;
  }
};

/**
 * Function for wrapping hightlighted spans
 * @param text
 * @param spanHighlightIndices
 * @param wrapFunc
 * @returns Array of plaintext or components directly renderable by react
 */
export const wrapPlainTextSpan = (text, spanHighlightIndices, wrapFunc) => {
  let outputSentences = [];
  const textLength = text.length;
  let currentIndex = 0;

  for (let i = 0; i < spanHighlightIndices.length; i++) {
    const spanInfo = spanHighlightIndices[i];
    const spanIndexStart = spanInfo.indices[0];
    // Sometimes the end index is negative so we have to check this
    const spanIndexEnd =
      spanInfo.indices[1] > -1 ? spanInfo.indices[1] : textLength;

    // Append but don't highlight any span before
    if (currentIndex < spanIndexStart) {
      outputSentences.push(text.substring(currentIndex, spanIndexStart));
    }

    const spanText = text.substring(spanIndexStart, spanIndexEnd);
    if (wrapFunc) {
      outputSentences.push(wrapFunc(spanText, spanInfo));
    } else {
      outputSentences.push(spanText);
    }

    currentIndex = spanIndexEnd;
  }

  // Append anything not highlighted
  if (currentIndex < textLength) {
    outputSentences.push(text.substring(currentIndex, textLength));
  }

  return outputSentences;
};

/**
 * Classification variable is a map of categories where each one has a list of classified spans, we
 * have to invert that so that we have a list of spans that contains all categories in that span
 * @param filteredClassification
 * @returns {*[]}
 */
export const mergeSpanIndices = (filteredClassification) => {
  // classification variable is a map of categories where each one has a list of classified spans, we
  // have to invert that so that we have a list of spans that contains all categories in that span
  let mergedSpanIndices = [];
  for (let label in filteredClassification) {
    for (let i = 0; i < filteredClassification[label].length; i++) {
      const spanInfo = filteredClassification[label][i];
      let matchingSpanFound = false;

      //Finds an existing matching span and append the technique, otherwise add the span to the list
      for (let j = 0; j < mergedSpanIndices.length; j++) {
        const mergedSpanInfo = mergedSpanIndices[j];
        if (
          spanInfo["indices"][0] === mergedSpanInfo["indices"][0] &&
          spanInfo["indices"][1] === mergedSpanInfo["indices"][1]
        ) {
          //Add technique to existing span
          mergedSpanInfo["techniques"][label] = spanInfo["score"];
          matchingSpanFound = true;
        }
      }
      if (!matchingSpanFound) {
        mergedSpanIndices.push({
          indices: spanInfo["indices"],
          techniques: { [label]: spanInfo["score"] },
        });
      }
    }
  }

  //Sort the spans by start index
  mergedSpanIndices = _.orderBy(mergedSpanIndices, (obj) => {
    return obj.indices[0];
  });

  return mergedSpanIndices;
};

// persuasion techniques: split text for category and technique
export function getPersuasionCategoryTechnique(category) {
  return category.split("__");
}

// persuasion techniques: defining persuasion technique category colours
export function getPersuasionCategoryColours(configs) {
  const categoryColours = {
    Justification: configs.perCategoryJustificationRgb,
    Simplification: configs.perCategorySimplificationRgb,
    Distraction: configs.perCategoryDistractionRgb,
    Call: configs.perCategoryCallRgb,
    Manipulative_Wording: configs.perCategoryManipulativeRgb,
    Attack_on_Reputation: configs.perCategoryAttackRgb,
  };
  return categoryColours;
}

// machine generated text and subjectivity: gauge chart explanation
export function createGaugeExplanation(keyword, arcsLength, colours) {
  let keywordsArr;
  if (arcsLength.length === 3) {
    keywordsArr = [
      "gauge_scale_modal_explanation_rating_1_sub",
      "gauge_scale_modal_explanation_rating_2_sub",
      "gauge_scale_modal_explanation_rating_3_sub",
    ];
  } else if (arcsLength.length === 4) {
    keywordsArr = [
      "gauge_scale_modal_explanation_rating_1_mgt",
      "gauge_scale_modal_explanation_rating_2_mgt",
      "gauge_scale_modal_explanation_rating_3_mgt",
      "gauge_scale_modal_explanation_rating_4_mgt",
    ];
  }
  return (
    <Box sx={{ textAlign: "start", mt: 2 }}>
      <GaugeChartModalExplanation
        keyword={keyword}
        keywordsArr={keywordsArr}
        keywordLink={"gauge_scale_explanation_link"}
        keywordModalTitle={"gauge_scale_modal_explanation_title"}
        colors={colours}
      />
    </Box>
  );
}

/**
 * Creates a GaugeChart required by machine generated text and subjectivity
 * @param mgtOverallScoreLabel
 * @param overallClassificationScore
 * @param resolvedMode
 * @param colours
 * @param keyword
 * @param gaugeDetectionText
 * @param explanation
 * @param arcsLength
 * @returns GaugeChart
 */
export function createGaugeChart(
  mgtOverallScoreLabel,
  overallClassificationScore,
  resolvedMode,
  colours,
  keyword,
  gaugeDetectionText,
  explanation,
  arcsLength,
) {
  const percentScore = Math.round(Number(overallClassificationScore) * 100.0);
  return (
    <>
      {/* Gauge title */}
      <Typography sx={{ textAlign: "start" }}>
        {keyword(mgtOverallScoreLabel)}
      </Typography>

      {/* Gauge chart */}
      <GaugeChart
        id={"gauge-chart"}
        animate={false}
        nrOfLevels={4}
        textColor={resolvedMode === "dark" ? "white" : "black"}
        needleColor={resolvedMode === "dark" ? "#5A5A5A" : "#D3D3D3"}
        needleBaseColor={resolvedMode === "dark" ? "#5A5A5A" : "#D3D3D3"}
        arcsLength={arcsLength}
        percent={overallClassificationScore ? percentScore / 100.0 : null}
        style={{
          width: "100%",
        }}
        colors={colours}
      />

      {/* Gauge labels */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle2" align="left" sx={{ flex: 1 }}>
          {keyword(gaugeDetectionText[0])}
        </Typography>
        <Typography variant="subtitle2" align="right">
          {keyword(gaugeDetectionText[1])}
        </Typography>
      </Box>

      {/* Gauge explanation */}
      {explanation && createGaugeExplanation(keyword, arcsLength, colours)}
    </>
  );
}

/**
 * Defines the colours required by machine generated text
 * @param configs
 * @returns colours for light and dark mode
 */
export function getMgtColours(configs) {
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
  return [colours, coloursDark];
}

/**
 * Defines the colours required by subjectivity
 * @param configs
 * @returns colours for light and dark mode
 */
export function getSubjectivityColours(configs) {
  const colours = [
    rgbToString(configs.greenRgb),
    rgbToString(configs.orangeRgb),
    rgbToString(configs.redRgb),
  ];
  const coloursDark = [
    rgbToString(configs.greenRgbDark),
    rgbToString(configs.orangeRgbDark),
    rgbToString(configs.redRgbDark),
  ];
  return [colours, coloursDark];
}

/**
 * Primary colour code
 */
export const primaryRgb = [0, 146, 108];

/**
 * Crediblity signal summary button
 * @param { setTextTabIndex, text }
 * @returns button to return to summary tab
 */
export function SummaryReturnButton({ setTextTabIndex, text }) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "flex-start",
        alignItems: "left",
        paddingTop: 1,
      }}
    >
      <Button
        onClick={() => setTextTabIndex(0)}
        startIcon={<ArrowBack />}
        sx={{ cursor: "pointer" }}
      >
        {text}
      </Button>
    </Stack>
  );
}

/**
 * Slider component utilised by news framing, news genre, persuasion techniques and subjectivity
 * @param { credibilitySignal, importantSentenceThreshold, handleSliderChange }
 * @returns slider component
 */
export function ThresholdSlider({
  credibilitySignal,
  importantSentenceThreshold,
  handleSliderChange,
  keyword,
}) {
  const marks = [
    {
      value: 0,
      label: keyword("threshold_slider_low"),
    },
    {
      value: 99,
      label: keyword("threshold_slider_high"),
    },
  ];

  /**
   * Scales slider threshold to change from range 0 to 100 to 0 to 1
   * @param value
   * @returns number between 0 and 1
   */
  const scaleValue = (value) => {
    return value / 100;
  };

  return (
    <List>
      <ListItem key={`${credibilitySignal}_thresholdSlider`}>
        <Slider
          aria-label="important sentence threshold slider"
          marks={marks}
          step={1}
          min={0}
          max={99}
          scale={scaleValue}
          value={importantSentenceThreshold}
          onChange={handleSliderChange}
          sx={{
            "& .MuiSlider-markLabel": {
              fontSize: "small",
            },
          }}
        />
      </ListItem>
    </List>
  );
}

/**
 * Function to take user direct to a specific element on the page
 * @param id
 * @param padding
 */
export function scrollToElement(id, padding = 0) {
  const element = document.getElementById(id);
  if (element) {
    const targetPosition =
      element.getBoundingClientRect().top + window.scrollY - padding;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  }
}
