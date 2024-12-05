import { test, expect } from './fixtures';


test(`Test interactive demo page`, async ({ page, extensionId }) => {
  // Navigate to the demo page
  await page.goto(`chrome-extension://${extensionId}/popup.html#/app/interactive`);
  // Accept local storage usage
  await page.getByText("Accept").click();
  // Click on the "Forensic seach" button that's visible
  await page.locator("[data-testid='interactive-forensic']:visible").click();
  // Checks that we've navigated to the forensic page
  await expect(page.url()).toContain("/app/tools/forensic")
});

test(`Test tool analysis youtube video`, async ({ page, extensionId }) => {
  // Navigate to the demo page
  await page.goto(`chrome-extension://${extensionId}/popup.html#/app/tools/analysis`);
  // Accept local storage usage
  await page.getByText("Accept").click();

  //Test Youtube
  await page.locator('[data-testid="analysis_video_input"] input').fill(
    "https://www.youtube.com/watch?v=WaaL75G0qu0"
  );
  await page.locator('[data-testid="analysis_video_submit"]').click();
  //Test results
  await expect(page.locator('[data-testid="analysis-yt-result"]')).toBeVisible();

  // This causes the whole lot to time out
  // I can only find one instance of a CancelIcon in the whole project, which is in ForensicResult.jsx
  // I guess this button has been removed at some point and the test hasn't been updated
  // await page.locator('[data-testid="CancelIcon"]').click();
  await expect(page.locator('[data-testid="analysis-yt-result"]')).toHaveCount(1);

});

test(`Test tool analysis twitter video`, async ({ page, extensionId }) => {
  // Navigate to the demo page
  await page.goto(`chrome-extension://${extensionId}/popup.html#/app/tools/analysis`);
  // Accept local storage usage
  await page.getByText("Accept").click();

  //Test Twitter
  await page.locator('[data-testid="analysis_video_input"] input').fill(
    "https://twitter.com/olex_scherba/status/1505991194018557955"
  );
  await page.locator('[data-testid="analysis_video_submit"]').click();
  await expect(page.locator('[data-testid="analysis-tw-result"]')).toBeVisible();
});
