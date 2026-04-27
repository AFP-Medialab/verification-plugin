import React from "react";
import GaugeChart from "react-gauge-chart";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

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
 * Function for wrapping highlighted spans
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

/**
 * Persuasion techniques: split text for category and technique
 */
export function getPersuasionCategoryTechnique(category) {
  return category.split("__");
}

/**
 * Creates a GaugeChart required by machine generated text and subjectivity
 * @param mgtOverallScoreLabel
 * @param overallClassificationScore
 * @param resolvedMode
 * @param colours
 * @param keyword
 * @param gaugeDetectionText
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
  arcsLength,
) {
  const percentScore = Math.round(Number(overallClassificationScore) * 100.0);
  return (
    <>
      {/* Gauge title */}
      <Typography fontSize="small" sx={{ textAlign: "start" }}>
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
        <Typography fontSize="small" align="left" sx={{ flex: 1 }}>
          {keyword(gaugeDetectionText[0])}
        </Typography>
        <Typography fontSize="small" align="right">
          {keyword(gaugeDetectionText[1])}
        </Typography>
      </Box>
    </>
  );
}
