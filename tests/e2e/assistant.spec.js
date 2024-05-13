import { test, expect } from './fixtures';

// test('example test', async ({ page }) => {
//   await page.goto('https://example.com');
//   await expect(page.locator('body')).toHaveText('Changed by my-extension');
// });

test('Assstant page', async ({ page, extensionId }) => {
  // Navigate to the assistant page
  await page.goto(`chrome-extension://${extensionId}/popup.html#/app/assistant/`);
  // Accept local storage usage
  await page.getByText("Accept").click();
  await expect(page.getByTestId("url-media-results")).not.toBeVisible();
  await page.getByTestId("assistant-webpage-link").click();
  await page.locator("[data-testid='assistant-url-selected-input'] input").fill("https://www.youtube.com/watch?v=WaaL75G0qu0");
  await page.getByTestId("assistant-url-selected-analyse-btn").click();
  await expect(page.getByTestId("url-media-results")).toBeVisible();

});
