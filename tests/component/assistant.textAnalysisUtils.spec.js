import React from "react";
import { expect, test } from "@playwright/experimental-ct-react";
import { WrapPlainTextSpanHarness } from "./TextAnalysisUtilsHarnesses";

test.use({ viewport: { width: 500, height: 500 } });

test("wrapPlainTextSpan: wrapFunc is called for each matched span", async ({ mount }) => {
  const component = await mount(
    <WrapPlainTextSpanHarness
      text="hello world"
      spans={[{ indices: [0, 5] }, { indices: [6, 11] }]}
      withWrapFunc={true}
    />,
  );
  const wrappedSpans = component.getByTestId("wrapped-span");
  await expect(wrappedSpans).toHaveCount(2);
  await expect(wrappedSpans.nth(0)).toHaveText("hello");
  await expect(wrappedSpans.nth(1)).toHaveText("world");
});
