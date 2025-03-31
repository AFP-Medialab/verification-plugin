import React from "react";

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
      for (let i = 0; i < spanHighlightIndices.length; i++) {
        const hSpan = spanHighlightIndices[i];
        const hSpanStart = hSpan.indices[0];
        // Sometimes the end index is negative so we have to check this
        let hSpanEnd = hSpan.indices[1] > -1 ? hSpan.indices[1] : textLength;
        // mismatch on last highlight span ending before last span end with machine generated text
        if (i === spanHighlightIndices.length - 1) {
          hSpanEnd = textLength;
        }

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
 *
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
 *
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
 *   Classification variable is a map of categories where each one has a list of classified spans, we
 *   have to invert that so that we have a list of spans that contains all categories in that span
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
