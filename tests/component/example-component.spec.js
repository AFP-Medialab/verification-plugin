/**
 * Example component testing
 * Mounts the ExampleTestComponent and perform various interactions
 */
import { test, expect } from '@playwright/experimental-ct-react';
import ExampleTestComponent from "./ExampleTestComponent";

test.use({ viewport: { width: 500, height: 500 } });

test('Example component test', async ({ mount }) => {
  const component = await mount(<ExampleTestComponent />);

  //Check the header element exists
  await expect(component.getByRole("heading", { name: "Test header"})).toBeVisible();

  //Type into text field and check the text output
  const testOutputValue = "Test output";
  await expect(component.getByTestId("test-output")).not.toContainText(testOutputValue);
  await component.getByTestId("test-input").fill(testOutputValue)
  await expect(component.getByTestId("test-output")).toContainText(testOutputValue);


  // Clicks a button and check that there is a text output
  await expect(component.getByTestId("test-btn-output")).not.toContainText("Hello world");
  await component.getByTestId("test-btn").click();
  await expect(component.getByTestId("test-btn-output")).toContainText("Hello world");

});
