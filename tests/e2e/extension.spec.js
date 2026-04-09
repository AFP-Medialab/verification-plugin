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

test(`Test tool analysis video`, async ({ page, extensionId }) => {

  // Navigate to the demo page
  await page.goto(`chrome-extension://${extensionId}/popup.html#/app/tools/analysis`);
  // Accept local storage usage
  await page.getByText("Accept").click();

  //Test Youtube
  await  page.locator('[data-testid="analysis_video_input"] input').fill(
    "https://www.youtube.com/watch?v=WaaL75G0qu0"
  );
  await page.locator('[data-testid="analysis_video_submit"]').click();
  //Test results
  await expect(page.locator('[data-testid="analysis-yt-result"]')).toBeVisible();
  await page.locator('[data-testid="close-result-yt-btn"]').click();
  await expect(page.locator('[data-testid="analysis-yt-result"]')).toHaveCount(0);
});

// test generated with codegen
test('Test tool keyframes', async ({ page, extensionId }) => {
  // Navigate to the demo page
  await page.goto(`chrome-extension://${extensionId}/popup.html#/app/tools/keyframes`);
  // Accept local storage usage
  await page.getByText("Accept").click();

  await page.locator('[data-testid="keyframes-input"] input').fill('https://www.youtube.com/watch?v=QQFgQ1uBQtk');

  await page.locator('[data-testid="keyframes-submit"]').click();
  
  // test of zoom in and out
  await page.locator('[data-testid="keyframes-zoomout"]').click();
  await page.locator('[data-testid="keyframes-zoomin"]').click();

  // test of detailed view
  await page.locator('[data-testid="keyframes-toggle-detailed"]').click();

  // test of download
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-testid="keyframes-download"]').click();
  const download = await downloadPromise;
  
  // test of closing button 
  await page.locator('[data-testid="keyframes-close"]').click();
});
