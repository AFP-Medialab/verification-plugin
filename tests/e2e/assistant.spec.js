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

[
  {url: "https://www.facebook.com/natgeo/videos/10157990199633951", gridIndex: 0, services: ["navbar_analysis_video", "navbar_keyframes", "assistant_video_download_action"]},
  {url: "https://t.me/disclosetv/13970", services: ["navbar_metadata", "assistant_video_download_action"]},
].forEach(({url, gridIndex, services}) => {
    test(`Test assistant services for url ${url}`, async ({ page, extensionId }) => {

      // Navigate to the assistant page
      await page.goto(`chrome-extension://${extensionId}/popup.html#/app/assistant/`);
      // Accept local storage usage
      await page.getByText("Accept").click();
      await expect(page.getByTestId("url-media-results")).not.toBeVisible();
      await page.getByTestId("assistant-webpage-link").click();
      await page.locator("[data-testid='assistant-url-selected-input'] input").fill(url);
      await page.getByTestId("assistant-url-selected-analyse-btn").click();
      await expect(page.getByTestId("url-media-results")).toBeVisible({timeout: 20000});

      if(gridIndex !== undefined && gridIndex !== null){
        await page.getByTestId("assistant-media-grid-video-"+gridIndex).click();
      }

      for( const serviceId of services){
        await expect(page.getByTestId(serviceId)).toBeVisible({timeout: 10000});
      }
    });
  }
);


