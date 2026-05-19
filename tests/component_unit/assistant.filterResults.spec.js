import { expect, test } from "@playwright/experimental-ct-react";
import { filterAssistantResults } from "../../src/components/NavItems/Assistant/utils/assistantResultsUtils";
import { KNOWN_LINKS, TOOLS_CATEGORIES } from "../../src/constants/toolsData";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeScrape = (overrides = {}) => ({
  text: "some text",
  lang: "en",
  links: [],
  images: [],
  videos: [],
  text_html_mapping: null,
  ...overrides,
});

// ---------------------------------------------------------------------------
// No-scrape platforms: userInput goes straight into videoList
// ---------------------------------------------------------------------------

for (const urlType of [
  KNOWN_LINKS.YOUTUBE,
  KNOWN_LINKS.YOUTUBESHORTS,
  KNOWN_LINKS.LIVELEAK,
  KNOWN_LINKS.VIMEO,
  KNOWN_LINKS.DAILYMOTION,
]) {
  test(`${urlType}: userInput placed in videoList, no scrapeResult needed`, () => {
    const url = `https://example.com/${urlType}-video`;
    const result = filterAssistantResults(urlType, null, url, null);
    expect(result.videoList).toEqual([url]);
    expect(result.imageList).toEqual([]);
    expect(result.urlText).toBeNull();
    expect(result.linkList).toEqual([]);
    expect(result.collectedComments).toBeNull();
  });
}

// ---------------------------------------------------------------------------
// TikTok
// ---------------------------------------------------------------------------

test("tiktok: scraped videos placed in videoList", () => {
  const scrape = makeScrape({ videos: ["https://cdn.tiktok.com/v1.mp4"] });
  const result = filterAssistantResults(KNOWN_LINKS.TIKTOK, null, "https://tiktok.com/video", scrape);
  expect(result.videoList).toEqual(["https://cdn.tiktok.com/v1.mp4"]);
  expect(result.imageList).toEqual([]);
});

// ---------------------------------------------------------------------------
// Instagram
// ---------------------------------------------------------------------------

test("instagram with video: first video placed in videoList", () => {
  const scrape = makeScrape({ videos: ["https://cdn.ig.com/v.mp4"], images: ["https://cdn.ig.com/img.jpg"] });
  const result = filterAssistantResults(KNOWN_LINKS.INSTAGRAM, null, "https://instagram.com/p/abc", scrape);
  expect(result.videoList).toEqual(["https://cdn.ig.com/v.mp4"]);
  expect(result.imageList).toEqual([]);
});

test("instagram without video: first image placed in imageList", () => {
  const scrape = makeScrape({ videos: [], images: ["https://cdn.ig.com/img1.jpg", "https://cdn.ig.com/img2.jpg"] });
  const result = filterAssistantResults(KNOWN_LINKS.INSTAGRAM, null, "https://instagram.com/p/abc", scrape);
  expect(result.imageList).toEqual(["https://cdn.ig.com/img1.jpg"]);
  expect(result.videoList).toEqual([]);
});

test("instagram with multiple videos: only first video used", () => {
  const scrape = makeScrape({ videos: ["https://cdn.ig.com/v1.mp4", "https://cdn.ig.com/v2.mp4"] });
  const result = filterAssistantResults(KNOWN_LINKS.INSTAGRAM, null, "https://instagram.com/p/abc", scrape);
  // videos.length !== 1, so falls to image branch
  expect(result.videoList).toEqual([]);
  expect(result.imageList).toEqual([scrape.images[0]]);
});

// ---------------------------------------------------------------------------
// Facebook
// ---------------------------------------------------------------------------

test("facebook with videos: videoList populated", () => {
  const scrape = makeScrape({ videos: ["https://video.fb.com/v.mp4"], images: ["https://img.fb.com/img.jpg"] });
  const result = filterAssistantResults(KNOWN_LINKS.FACEBOOK, null, "https://facebook.com/video", scrape);
  expect(result.videoList).toEqual(["https://video.fb.com/v.mp4"]);
  expect(result.imageList).toEqual([]);
});

test("facebook without videos: imageList populated", () => {
  const scrape = makeScrape({ videos: [], images: ["https://img.fb.com/a.jpg", "https://img.fb.com/b.jpg"] });
  const result = filterAssistantResults(KNOWN_LINKS.FACEBOOK, null, "https://facebook.com/post", scrape);
  expect(result.imageList).toEqual(scrape.images);
  expect(result.videoList).toEqual([]);
});

// ---------------------------------------------------------------------------
// Twitter / Snapchat / Bluesky (same branch behaviour)
// ---------------------------------------------------------------------------

for (const urlType of [KNOWN_LINKS.TWITTER, KNOWN_LINKS.SNAPCHAT, KNOWN_LINKS.BLUESKY]) {
  test(`${urlType}: images and videos both populated from scrape`, () => {
    const scrape = makeScrape({
      images: ["https://cdn.example.com/img.jpg"],
      videos: ["https://cdn.example.com/v.mp4"],
    });
    const result = filterAssistantResults(urlType, null, "https://example.com/post", scrape);
    expect(result.imageList).toEqual(scrape.images);
    expect(result.videoList).toEqual(scrape.videos);
  });

  test(`${urlType}: empty scrape gives empty lists`, () => {
    const scrape = makeScrape({ images: [], videos: [] });
    const result = filterAssistantResults(urlType, null, "https://example.com/post", scrape);
    expect(result.imageList).toEqual([]);
    expect(result.videoList).toEqual([]);
  });
}

// ---------------------------------------------------------------------------
// Mastodon / Telegram / VK / BBC (same branch behaviour)
// ---------------------------------------------------------------------------

for (const urlType of [KNOWN_LINKS.MASTODON, KNOWN_LINKS.TELEGRAM, KNOWN_LINKS.VK, KNOWN_LINKS.BBC]) {
  test(`${urlType}: images and videos both populated from scrape`, () => {
    const scrape = makeScrape({
      images: ["https://cdn.example.com/img.jpg"],
      videos: ["https://cdn.example.com/v.mp4"],
    });
    const result = filterAssistantResults(urlType, null, "https://example.com/post", scrape);
    expect(result.imageList).toEqual(scrape.images);
    expect(result.videoList).toEqual(scrape.videos);
  });
}

// ---------------------------------------------------------------------------
// MISC
// ---------------------------------------------------------------------------

test("misc with IMAGE contentType: userInput placed in imageList", () => {
  const url = "https://example.com/photo.jpg";
  const result = filterAssistantResults(KNOWN_LINKS.MISC, TOOLS_CATEGORIES.IMAGE, url, null);
  expect(result.imageList).toEqual([url]);
  expect(result.videoList).toEqual([]);
});

test("misc with VIDEO contentType: userInput placed in videoList", () => {
  const url = "https://example.com/clip.mp4";
  const result = filterAssistantResults(KNOWN_LINKS.MISC, TOOLS_CATEGORIES.VIDEO, url, null);
  expect(result.videoList).toEqual([url]);
  expect(result.imageList).toEqual([]);
});

test("misc without contentType: uses scraped media", () => {
  const scrape = makeScrape({
    images: ["https://example.com/a.jpg", "https://example.com/b.jpg"],
    videos: ["https://example.com/v.mp4"],
  });
  const result = filterAssistantResults(KNOWN_LINKS.MISC, null, "https://example.com", scrape);
  expect(result.imageList).toEqual(scrape.images);
  expect(result.videoList).toEqual(scrape.videos);
});

test("misc without contentType: filters loader.svg from imageList", () => {
  const scrape = makeScrape({
    images: [
      "https://example.com/real.jpg",
      "https://example.com/assets/loader.svg",
      "https://example.com/other.png",
    ],
    videos: [],
  });
  const result = filterAssistantResults(KNOWN_LINKS.MISC, null, "https://example.com", scrape);
  expect(result.imageList).toEqual(["https://example.com/real.jpg", "https://example.com/other.png"]);
});

// ---------------------------------------------------------------------------
// Shared scrapeResult extraction
// ---------------------------------------------------------------------------

test("scrapeResult text and lang are extracted", () => {
  const scrape = makeScrape({ text: "Article text", lang: "fr" });
  const result = filterAssistantResults(KNOWN_LINKS.TWITTER, null, "https://twitter.com/post", scrape);
  expect(result.urlText).toBe("Article text");
  expect(result.textLang).toBe("fr");
});

test("scrapeResult links are sorted and deduplicated", () => {
  const scrape = makeScrape({ links: ["https://c.com", "https://a.com", "https://b.com", "https://a.com"] });
  const result = filterAssistantResults(KNOWN_LINKS.TWITTER, null, "https://twitter.com/post", scrape);
  expect(result.linkList).toEqual(["https://a.com", "https://b.com", "https://c.com"]);
});

test("scrapeResult text_html_mapping is passed through", () => {
  const mapping = { tag: "div", children: [] };
  const scrape = makeScrape({ text_html_mapping: mapping });
  const result = filterAssistantResults(KNOWN_LINKS.TWITTER, null, "https://twitter.com/post", scrape);
  expect(result.urlTextHtmlMap).toBe(mapping);
});

test("collectedComments extracted when present in scrapeResult", () => {
  const comments = [{ id: "1", textOriginal: "hello" }];
  const scrape = makeScrape({ collected_comments: comments });
  const result = filterAssistantResults(KNOWN_LINKS.YOUTUBE, null, "https://youtube.com/watch?v=abc", scrape);
  expect(result.collectedComments).toEqual(comments);
});

test("collectedComments is null when key absent from scrapeResult", () => {
  const scrape = makeScrape(); // no collected_comments key
  const result = filterAssistantResults(KNOWN_LINKS.TWITTER, null, "https://twitter.com/post", scrape);
  expect(result.collectedComments).toBeNull();
});

test("null scrapeResult gives null text fields and empty lists", () => {
  const result = filterAssistantResults(KNOWN_LINKS.YOUTUBE, null, "https://youtube.com/watch?v=abc", null);
  expect(result.urlText).toBeNull();
  expect(result.textLang).toBeNull();
  expect(result.linkList).toEqual([]);
  expect(result.urlTextHtmlMap).toBeNull();
  expect(result.collectedComments).toBeNull();
});
