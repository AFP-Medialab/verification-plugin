import React from "react";

function treeMapToElementsRecursive(
  text,
  treeElem,
  spanHighlightIndices = null,
  wrapFunc = null,
) {
  let childElems = [];
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
        const hSpanEnd = hSpan.indices[1];
        if (
          (span.start <= hSpanStart && hSpanStart <= span.end) ||
          (span.start <= hSpanEnd && hSpanEnd <= span.end)
        ) {
          if (hSpanStart > currentIndex) {
            // If span doesn't start before the current index, add unlighlighted text
            childElems.push(text.substring(currentIndex, hSpanStart));
          }

          const boundedStart =
            hSpanStart < span.start ? span.start : hSpanStart;
          const boundedEnd = hSpanEnd > span.end ? span.end : hSpanEnd;
          if (wrapFunc) {
            // Add parts of text that needs to be wrapped in wrapFunc()
            childElems.push(
              wrapFunc(text.substring(boundedStart, boundedEnd), hSpan),
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

  //Collect attributes
  let attributes = {};
  if (treeElem.attributes) {
    attributes = treeElem.attributes;
  }

  return React.createElement(treeElem.tag, attributes, childElems);
}

/**
 * Combines text and html tree to generate dynamic DOM elements. A handler function can be provided in order to
 * insert dynamic elements around each text span.
 * @param text
 * @param mapping
 * @param spanHighlightIndices Indices of text spans that should be wrapped, in the format of [{indices: [start, end]}, ...]
 * @param wrapFunc Called for each span indices in spanHighlightIndices the function should take the form of: (text, spanInfo): Element => {}
 * @returns {React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>|*}
 */
export const treeMapToElements = (
  text,
  mapping,
  spanHighlightIndices = null,
  wrapFunc = null,
) => {
  if (mapping) {
    return treeMapToElementsRecursive(
      text,
      mapping,
      spanHighlightIndices,
      wrapFunc,
    );
  } else {
    return text;
  }
};
