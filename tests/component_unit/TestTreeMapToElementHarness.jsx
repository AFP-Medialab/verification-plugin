import React from "react";
import {treeMapToElements } from "../../src/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";

const text = "word0 word1";
const mapping = {
  tag: "div",
  children: [
    {
      tag: "h1",
      span: { start: 0, end: 5},
      children: []
    },
    {
      tag: "p",
      span: { start: 6, end: 11},
      children: []
    }
  ]
}
export function TestTreeMapToElementHarness(){

  const output = treeMapToElements(text, mapping);

  return output;
}

export function TestTreeMapToElementHighlightWrapHarness(){
  // Highlight the second word
  const highlightIndices = [{indices: [6,11]}];

  // Returns the text span wrapp in a <span> tag
  function wrapFunc(text, spanInfo){
    return (<span data-testid="highlighted-span">{text}</span>);
  }

  const output = treeMapToElements(text, mapping, highlightIndices, wrapFunc);

  return output;
}

