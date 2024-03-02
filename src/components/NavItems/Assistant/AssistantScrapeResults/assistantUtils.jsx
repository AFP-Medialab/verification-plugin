import React from "react";

function treeMapToElementsRecursive(
  text,
  treeElem,
  spanHighlightIndices = null,
  wrapFunc = null,
) {
  let childElems = [];
  if ("span" in treeElem) {
    const span = treeElem.span;
    if (spanHighlightIndices === null) {
      console.log("No span highlight: ", text.substring(span.start, span.end));
      childElems.push(text.substring(span.start, span.end));
    } else {
      console.log("Span highlight: ", text.substring(span.start, span.end));
      let currentIndex = span.start;
      for (let i = 0; i < spanHighlightIndices.length; i++) {
        const hSpan = spanHighlightIndices[i];
        console.log(
          "Matching span",
          span.start,
          span.end,
          hSpan.indices[0],
          hSpan.indices[1],
        );
        const hSpanStart = hSpan.indices[0];
        const hSpanEnd = hSpan.indices[1];
        if (
          (span.start <= hSpanStart && hSpanStart <= span.end) ||
          (span.start <= hSpanEnd && hSpanEnd <= span.end)
        ) {
          //If there's an overlap
          console.log(
            "Found lapping span ",
            span.start,
            span.end,
            hSpanStart,
            hSpanEnd,
          );

          // If span doesn't start before the current index
          if (hSpanStart > currentIndex) {
            childElems.push(text.substring(currentIndex, hSpanStart));
          }

          const boundedStart =
            hSpanStart < span.start ? span.start : hSpanStart;
          const boundedEnd = hSpanEnd > span.end ? span.end : hSpanEnd;
          if (wrapFunc) {
            console.log("Wrapping: ", text.substring(boundedStart, boundedEnd));
            childElems.push(
              wrapFunc(text.substring(boundedStart, boundedEnd), hSpan),
            );
          } else {
            console.log(
              "Not wrapping: ",
              text.substring(boundedStart, boundedEnd),
            );
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
  return React.createElement(treeElem.tag, null, childElems);
}

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
