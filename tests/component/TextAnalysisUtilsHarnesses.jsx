import React from "react";
import { wrapPlainTextSpan } from "../../src/components/NavItems/Assistant/utils/textAnalysisUtils";

export function WrapPlainTextSpanHarness({ text, spans, withWrapFunc = false }) {
  const wrapFunc = withWrapFunc
    ? (spanText) => <span data-testid="wrapped-span">{spanText}</span>
    : null;
  const output = wrapPlainTextSpan(text, spans, wrapFunc);
  return <div data-testid="output-container">{output}</div>;
}
