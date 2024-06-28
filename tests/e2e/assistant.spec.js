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

const MediaType = {
  video: "video",
  image: "image"
};

const MediaVideoStatus = {
  iframe: 0,
  video: 1,
  noEmbed: 2,
};

const MediaServices = {
  analysisVideo: "navbar_analysis_video",
  analysisImage: "navbar_analysis_image",
  keyframes: "navbar_keyframes",
  thumbnails: "navbar_thumbnails",
  magnifier: "navbar_magnifier",
  metadata: "navbar_metadata",
  videoRights: "navbar_rights",
  forensic: "navbar_forensic",
  ocr: "navbar_ocr",
  videoDownload: "assistant_video_download_action",
};

[
  // Youtube video
  {
    url: "https://www.youtube.com/watch?v=UXrkN0iQmZQ",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.analysisVideo, MediaServices.keyframes, MediaServices.thumbnails, MediaServices.videoRights]
  },
  // Facebook post with video
  {
    url: "https://www.facebook.com/natgeo/videos/10157990199633951",
    videoGridIndex: 0,
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.analysisVideo, MediaServices.keyframes, MediaServices.videoDownload]
  },
  // Telegram post with video
  {
    url: "https://t.me/disclosetv/13970",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.metadata, MediaServices.videoDownload]
  },
  // Instagram post with an image
  {
    url: "https://www.instagram.com/p/CI2b-3usJoH/",
    mediaType: MediaType.image,
    services: [MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr]
  },
  // Instagram post with a video reel
  {
    url: "https://www.instagram.com/p/C8JwcyOiFDD/",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: []
  }
].forEach(({url, videoGridIndex, imageGridIndex, mediaType, mediaStatus, services}) => {
    test(`Test assistant media services for url: ${url}`, async ({ page, extensionId }) => {

      // Navigate to the assistant page
      await page.goto(`chrome-extension://${extensionId}/popup.html#/app/assistant/`);
      // Accept local storage usage
      await page.getByText("Accept").click();

      // Component to display media should not be displayed at the start
      await expect(page.getByTestId("url-media-results")).not.toBeVisible();

      // Choose to enter url instead of uploading a file
      await page.getByTestId("assistant-webpage-link").click();
      await page.locator("[data-testid='assistant-url-selected-input'] input").fill(url);
      await page.getByTestId("assistant-url-selected-analyse-btn").click();

      // Expecting a media post with images or video
      await expect(page.getByTestId("url-media-results")).toBeVisible({timeout: 20000});

      // If multiple images/videos exist, click on the media grid first
      if(Number.isInteger(videoGridIndex))
        await page.getByTestId("assistant-media-grid-video-"+videoGridIndex).click();

      if(Number.isInteger(imageGridIndex))
        await page.getByTestId("assistant-media-grid-image-"+imageGridIndex).click();

      // If expecting an image, check that the image is shown
      if(mediaType === MediaType.image){
        await expect(page.getByTestId("assistant-media-image")).toBeVisible();
      }

      if(mediaType === MediaType.video){
        await expect(page.getByTestId("assistant-media-video-container")).toBeVisible();
        if(mediaStatus !== null && mediaStatus !== undefined){
          switch (mediaStatus) {
            case MediaVideoStatus.iframe:
              await expect(page.getByTestId("assistant-media-video-iframe")).toBeVisible();
              break;
            case MediaVideoStatus.video:
              await expect(page.getByTestId("assistant-media-video-tag")).toBeVisible();
              break;
            case MediaVideoStatus.noEmbed:
              await expect(page.getByTestId("assistant-media-video-noembed")).toBeVisible();
              break;

          }
        }
      }

      // Checks that expected services are shown
      for( const serviceId of services){
        await expect(page.getByTestId(serviceId)).toBeVisible({timeout: 10000});
      }

      // Ensure disabled services are not showing
      for( const serviceKey in MediaServices){
        const serviceId = MediaServices[serviceKey];
        if(!services.includes(serviceId))
          await expect(page.getByTestId(serviceId)).not.toBeVisible();
      }

    });
  }
);


