import {
  test,
  expect
} from './fixtures';

const MediaType = {
  video: "video",
  image: "image",
  none: "none",
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
  videoDownloadGeneric: "assistant_video_download_generic",
  videoDownloadTiktok: "assistant_video_download_tiktok",
};



[
  // Negative Source Credibility
  {
    url: "https://www.breitbart.com/europe/2024/02/12/german-government-expects-10-million-migrants-to-flee-ukraine-if-russia-wins-war-report",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Gerald Knaus",
        "Roderich Kiesewetter",
        "Heiko Teggatz",
        "Olaf Scholz",
        "Frank", // This should be Frank-Walter Steinmeir, but the named entity recognition does not handle hyphens well
        "Walter Steinmeier"
      ],
      Location: [
        "Ukraine",
        "Russia",
        "Germany",
        "Berlin",
        "Western Europe",
        "Europe",
        "Syria",
        "Turkey",
        "Poland",
        "Middle East",
        "Africa",
        "Canada"
      ],
      Organization: [
        "EU",
        "Bundestag",
        "Christian Democratic Union",
        "CDU",
        "NATO",
        "The UN Refugee Agency",
        "UNHCR",
        "Chairman of the German Police Union",
        "West",
        "Germany’s Federal Office for Migration and Refugees and Federal Institute for Population Research"
      ]
    },
    domainAnalyses: {
        "https://www.unhcr.org/us/emergencies/ukraine-emergency": null,
        "https://www.breitbart.com/europe/2024/01/06/illegal-migrant-arrivals-highest-since-2015-migrant-crisis-says-germany/": "ErrorOutlineOutlinedIcon",
        "https://www.politico.eu/article/germany-migration-president-frank-walter-steinmeier-breaking-point/": null,
        "https://www.breitbart.com/europe/2023/07/14/half-of-ukrainian-refugees-in-germany-want-to-stay-forever/": "ErrorOutlineOutlinedIcon",
        "https://www.theglobeandmail.com/politics/article-displaced-ukrainians-want-to-settle-permanently-in-canada/": null,
        "https://www.welt.de/politik/deutschland/article250007304/Ukraine-Bei-einem-Zerfall-der-Ukraine-droht-eine-Massenflucht.html?icid=search.product.onsitesearch" : "CheckCircleOutlineIcon",
        "https://twitter.com/KurtZindulka": null,
    },
    credibilitySignals: {
      topic: ["Security, Defense and Well-being", "Politics", "International Relations"],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Appeal to Authority",
        "Appeal to fear/prejudice",
        "Appeal to Popularity",
        "Exaggeration or minimisation",
        "Loaded language",
        "Repetition"
      ],
      subjectivity: ["None detected"]
    }
  },
  // Twitter image post
  {
    url: "https://twitter.com/vesinfiltro/status/1253122594976468993/photo/1",
    mediaType: MediaType.image,
    services: [MediaServices.analysisImage, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr]
  },
  // Twitter video post
  {
    url: "https://twitter.com/NatGeo/status/1334635273888514048/video/1",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.metadata, MediaServices.videoDownload]
  },
  // Youtube video
  {
    url: "https://www.youtube.com/watch?v=UXrkN0iQmZQ",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.analysisVideo, MediaServices.keyframes, MediaServices.thumbnails, MediaServices.videoRights],
    hasScrapedText: false
  },
  // Youtube shorts
  // Fails: The Assistant could not display this video content.
  {
    url: "https://www.youtube.com/shorts/RMGOds6SxF0",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric, MediaServices.keyframes],
    hasScrapedText: false
  },
  // Facebook post with video
  {
    url: "https://www.facebook.com/natgeo/videos/10157990199633951",
    videoGridIndex: 0,
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.analysisVideo, MediaServices.keyframes, MediaServices.videoDownload, MediaServices.videoDownloadGeneric]
  },
  // Telegram post with video
  {
    url: "https://t.me/WeAreBREITBART/13745",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.metadata, MediaServices.videoDownload]
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
    services: [MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr]
  },
  // Instagram post with a video reel
  {
    url: "https://www.instagram.com/p/C8JwcyOiFDD/",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric]
  },
  // TikTok video post
  // TO BE DELETED?: Stopped testing tiktok endpoint as we are no longer able to scrape them
  // {
  //   url: "https://www.tiktok.com/@deeptomcruise/video/7223086851236646149",
  //   mediaType: MediaType.video,
  //   mediaStatus: MediaVideoStatus.noEmbed,
  //   services: [MediaServices.videoDownloadTiktok]
  // },
  // VK link with images
  // MF: If you look at the post, it's definitely a video. The only image is the avatar of OP, which isn't loaded
  // because the backend loads the _post_ rather than the _page_, so the avatar isn't seen.
  {
    url: "https://vk.com/wall-57424472_432185",
    mediaType: MediaType.noEmbed,
    services: [MediaServices.videoDownloadGeneric]
  },
  // VK link with embedded video
  {
    url: "https://vk.com/video-221416054_456296074",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric]
  },
  // Vimeo video post
  {
    url: "https://vimeo.com/389685467",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.videoDownloadGeneric],
    hasScrapedText: false
  },
  // Dailymotion video post
  {
    url: "https://www.dailymotion.com/video/x91gv4a",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.videoDownloadGeneric],
    hasScrapedText: false
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
    services: [MediaServices.videoDownload, MediaServices.metadata]
  },
].forEach(({
  url,
  videoGridIndex,
  imageGridIndex,
  mediaType,
  mediaStatus,
  services,
  hasScrapedText = true,
  namedEntities = {},
  domainAnalyses = {},
  credibilitySignals = {}
}) => {
  test(`Test assistant media services for url: ${url}`, async ({
    page,
    extensionId
  }) => {

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
    await expect(page.getByTestId("url-media-results")).toBeVisible();

    // If multiple images/videos exist, click on the media grid first
    if (Number.isInteger(videoGridIndex))
      await page.getByTestId("assistant-media-grid-video-" + videoGridIndex).click();

    if (Number.isInteger(imageGridIndex))
      await page.getByTestId("assistant-media-grid-image-" + imageGridIndex).click();


    // Check that media exists for image and video posts and that all expected services are shown
    switch (mediaType) {
      case MediaType.image:
        await expect(page.getByTestId("assistant-media-image")).toBeVisible();
        await checkMediaServices(page, services)
        break;
      case MediaType.video:
        await expect(page.getByTestId("assistant-media-video-container")).toBeVisible();
        if (mediaStatus !== null && mediaStatus !== undefined) {
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
        await checkMediaServices(page, services)
        break;
      case MediaType.none:
        await expect(page.getByTestId("assistant-media-video-container")).not.toBeVisible();
        break;
    }

    if (hasScrapedText) {
      await expect(page.getByTestId("assistant-text-scraped-text")).toBeVisible();
      // Named entities
      for (const entityType in namedEntities) {
        await page.getByTestId(entityType+"-dropdown").click();
        for (const entity in namedEntities[entityType]) {
          await expect(page.getByTestId(namedEntities[entityType][entity])).toBeVisible();
        }
      }
      // URL domain analysis
      if (Object.keys(domainAnalyses).length > 0){
        for (const url in domainAnalyses) {
          await expect(page.getByTestId("url-domain-analysis").locator("[href*=\""+url+"\"]")).toBeVisible();
          const resultRow = page.getByTestId("url-domain-analysis").locator("div.MuiGrid2-container").filter({ hasText: url });

          if (domainAnalyses[url] != null) {
            await expect(resultRow.locator(">div")).toHaveCount(3);
            await expect(resultRow.getByTestId(domainAnalyses[url])).toBeVisible();
          }
          else {
            await expect(resultRow.locator(">div")).toHaveCount(2);
          }
        }
      }
      // Credibility signals
      if (Object.keys(credibilitySignals).length > 0){
        for (const signal in credibilitySignals) {
          for (const foundIndex in credibilitySignals[signal]) {
            await expect(page.getByTestId(signal+"-result")).toContainText(credibilitySignals[signal][foundIndex]);
          }
        }
      }
    }


  });
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
