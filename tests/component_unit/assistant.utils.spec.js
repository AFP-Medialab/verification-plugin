import React from "react";
import {expect, test} from "@playwright/experimental-ct-react";
import {TestTreeMapToElementHarness, TestTreeMapToElementHighlightWrapHarness} from "./TestTreeMapToElementHarness";


test.use({ viewport: { width: 500, height: 500 } });

test('Test treeMapToElement - No highlighting', async ({ mount }) => {

  const component = await mount(<TestTreeMapToElementHarness />);
  await expect(component.locator("h1")).toContainText("word0");
  await expect(component.locator("p")).toContainText("word1");

});

test('Test treeMapToElement - Dynamic text highlighting', async ({ mount }) => {

  const component = await mount(<TestTreeMapToElementHighlightWrapHarness />);
  await expect(component.locator("h1")).toContainText("word0");
  await expect(component.locator("p")).toContainText("word1");
  await expect(component.getByTestId("highlighted-span")).toContainText("word1");

});


