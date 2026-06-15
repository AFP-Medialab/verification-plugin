import { expect, test } from "./fixtures";

const MediaType = {
  video: "video",
  image: "image",
  none: "none",
};

const MediaVideoStatus = {
  iframe: 0,
  video: 1,
  noEmbed: 2,
  youtube: 3,
};

const MediaServices = {
  analysisVideo: "navbar_analysis_video",
  keyframes: "navbar_keyframes",
  thumbnails: "navbar_thumbnails",
  magnifier: "navbar_magnifier",
  metadataVideo: "navbar_metadata_video",
  metadataImage: "navbar_metadata_image",
  forensic: "navbar_forensic",
  ocr: "navbar_ocr",
  videoDownload: "assistant_video_download_action",
  videoDownloadGeneric: "assistant_video_download_generic",
  videoDownloadTiktok: "assistant_video_download_tiktok",
  deepfakeVideo: "navbar_deepfake_video",
  poiForensics: "navbar_poiforensics",
};

[
  // Twitter image post
  {
    url: "https://twitter.com/vesinfiltro/status/1253122594976468993/photo/1",
    mediaType: MediaType.image,
    services: [
      MediaServices.magnifier,
      MediaServices.forensic,
      MediaServices.ocr,
    ],
  },
  // Twitter video post
  {
    url: "https://twitter.com/NatGeo/status/1334635273888514048/video/1",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [
      MediaServices.keyframes,
      MediaServices.metadataVideo,
      MediaServices.videoDownload,
    ],
  },
  // Youtube video
  {
    url: "https://www.youtube.com/watch?v=UXrkN0iQmZQ",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.youtube,
    services: [
      MediaServices.analysisVideo,
      MediaServices.keyframes,
      MediaServices.thumbnails,
      MediaServices.videoDownloadGeneric,
    ],
    hasScrapedText: false,
  },
  // Youtube shorts
  {
    url: "https://www.youtube.com/shorts/RMGOds6SxF0",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.keyframes, MediaServices.videoDownloadGeneric],
    hasScrapedText: false,
  },
  // Facebook post with video
  {
    url: "https://www.facebook.com/natgeo/videos/10157990199633951",
    videoGridIndex: 0,
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [
      MediaServices.analysisVideo,
      MediaServices.keyframes,
      MediaServices.videoDownload,
    ],
  },
  // Telegram post with video
  {
    url: "https://t.me/WeAreBREITBART/13745",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.metadataVideo, MediaServices.videoDownload],
  },
  // Telegram post with video - Fails, goes to the group page
  // {
  //   url: "https://t.me/disclosetv/13970",
  //   mediaType: MediaType.video,
  //   mediaStatus: MediaVideoStatus.video,
  //   services: [MediaServices.metadata, MediaServices.videoDownload]
  // },
  // Instagram post with an image
  {
    url: "https://www.instagram.com/p/CI2b-3usJoH/",
    mediaType: MediaType.image,
    services: [
      MediaServices.magnifier,
      MediaServices.forensic,
      MediaServices.ocr,
    ],
  },
  // Instagram post with a video reel
  {
    url: "https://www.instagram.com/p/C8JwcyOiFDD/",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric],
  },
  // TikTok video post
  {
    url: "https://www.tiktok.com/@deeptomcruise/video/7223086851236646149",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadTiktok],
    skip: true,
  },
  // VK link with images
  {
    url: "https://vk.com/wall-57424472_432185",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [
      MediaServices.magnifier,
      MediaServices.metadataImage,
      MediaServices.forensic,
      MediaServices.ocr,
    ],
    skip: true,
  },
  // VK link with embedded video
  {
    url: "https://vk.com/video-221416054_456296074",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric],
    skip: true,
  },
  // Vimeo video post
  {
    url: "https://vimeo.com/389685467",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.videoDownloadGeneric],
    hasScrapedText: false,
  },
  // Dailymotion video post
  {
    url: "https://www.dailymotion.com/video/x91gv4a",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.videoDownloadGeneric],
    hasScrapedText: false,
  },
  // Mastodon link with youtube video link
  {
    url: "https://mstdn.social/@BBC/105203076554056414",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.videoDownload],
  },
  // Mastodon link with embedded video
  {
    url: "https://mstdn.social/@dtnsshow/112728823075224415",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.videoDownload, MediaServices.metadataVideo],
  },
].forEach(
  ({
    url,
    videoGridIndex,
    imageGridIndex,
    mediaType,
    mediaStatus,
    services,
    hasScrapedText = true,
    skip = false,
  }) => {
    test(`Test assistant media services for url: ${url}`, async ({
      page,
      extensionId,
    }) => {
      test.skip(skip, "External service blocks automated scraping");
      // Navigate to the assistant page
      await page.goto(
        `chrome-extension://${extensionId}/popup.html#/app/assistant/`,
      );
      // Accept local storage usage
      await page.getByText("Accept").click();

      // Component to display media should not be displayed at the start
      await expect(page.getByTestId("url-media-results")).not.toBeVisible();

      await page
        .locator("[data-testid='assistant-url-selected-input'] input")
        .fill(url);
      await page.getByTestId("assistant-url-selected-analyse-btn").click();

      // Expecting a media post with images or video
      await expect(
        page.getByTestId("url-media-results"),
        `Scraping did not complete within 30s for ${url} — check assistant backend is reachable`,
      ).toBeVisible({ timeout: 30000 });

      // If multiple images/videos exist, click on the media grid first
      if (Number.isInteger(videoGridIndex))
        await page
          .getByTestId("assistant-media-grid-video-" + videoGridIndex)
          .click();

      if (Number.isInteger(imageGridIndex))
        await page
          .getByTestId("assistant-media-grid-image-" + imageGridIndex)
          .click();

      // Check that media exists for image and video posts and that all expected services are shown
      switch (mediaType) {
        case MediaType.image:
          await expect(page.getByTestId("assistant-media-image")).toBeVisible();
          await checkMediaServices(page, services);
          break;
        case MediaType.video:
          await expect(
            page.getByTestId("assistant-media-video-container"),
          ).toBeVisible();
          if (mediaStatus !== null && mediaStatus !== undefined) {
            switch (mediaStatus) {
              case MediaVideoStatus.iframe:
                await expect(
                  page.getByTestId("assistant-media-video-iframe"),
                ).toBeVisible();
                break;
              case MediaVideoStatus.youtube:
                await expect(
                  page.getByTestId("assistant-media-video-youtube"),
                ).toBeVisible();
                break;
              case MediaVideoStatus.video:
                await expect(
                  page.getByTestId("assistant-media-video-tag"),
                ).toBeVisible();
                break;
              case MediaVideoStatus.noEmbed:
                await expect(
                  page.getByTestId("assistant-media-video-noembed"),
                ).toBeVisible();
                break;
            }
          }
          await checkMediaServices(page, services);
          break;
        case MediaType.none:
          await expect(
            page.getByTestId("assistant-media-video-container"),
          ).not.toBeVisible();
          break;
      }

      if (hasScrapedText) {
        await expect(
          page.getByTestId("assistant-text-scraped-text"),
        ).toBeVisible();
      }
    });
  },
);

// ---------------------------------------------------------------------------
// Role-gated tool tests
//
// These use the authenticated fixtures from fixtures.ts which pre-seed
// { cookies: true } in chrome.storage, so the cookie consent Accept
// button does not appear and must not be clicked.
//
// Note: syntheticImageDetection, geolocation, and c2pa are restricted to
// MISC/OWN/BBC link types — they cannot be tested via social media URLs.
// ---------------------------------------------------------------------------

test("youtube video + BETA_TESTER role: deepfake tool is visible", async ({
  page,
  authenticatedBetaTesterExtensionId,
}) => {
  await page.goto(
    `chrome-extension://${authenticatedBetaTesterExtensionId}/popup.html#/app/assistant/`,
  );

  await page
    .locator("[data-testid='assistant-url-selected-input'] input")
    .fill("https://www.youtube.com/watch?v=UXrkN0iQmZQ");
  await page.getByTestId("assistant-url-selected-analyse-btn").click();

  await expect(page.getByTestId("url-media-results")).toBeVisible({
    timeout: 30000,
  });
  await checkMediaServices(page, [
    MediaServices.deepfakeVideo,
    MediaServices.analysisVideo,
    MediaServices.keyframes,
    MediaServices.thumbnails,
    MediaServices.videoDownloadGeneric,
  ]);
});

test("youtube video + EXTRA_FEATURE role: POI forensics tool is visible", async ({
  page,
  authenticatedExtraFeaturesExtensionId,
}) => {
  await page.goto(
    `chrome-extension://${authenticatedExtraFeaturesExtensionId}/popup.html#/app/assistant/`,
  );

  await page
    .locator("[data-testid='assistant-url-selected-input'] input")
    .fill("https://www.youtube.com/watch?v=UXrkN0iQmZQ");
  await page.getByTestId("assistant-url-selected-analyse-btn").click();

  await expect(page.getByTestId("url-media-results")).toBeVisible({
    timeout: 30000,
  });
  await checkMediaServices(page, [
    MediaServices.poiForensics,
    MediaServices.analysisVideo,
    MediaServices.keyframes,
    MediaServices.thumbnails,
    MediaServices.videoDownloadGeneric,
  ]);
});

async function checkMediaServices(page, availableServices) {
  // Checks that expected services are shown
  for (const serviceId of availableServices) {
    await expect(page.getByTestId(serviceId)).toBeVisible();
  }

  // Ensure disabled services are not showing
  for (const serviceKey in MediaServices) {
    const serviceId = MediaServices[serviceKey];
    if (!availableServices.includes(serviceId))
      await expect(page.getByTestId(serviceId)).not.toBeVisible();
  }
}
