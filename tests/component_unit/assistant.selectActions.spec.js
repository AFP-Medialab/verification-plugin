import { expect, test } from "@playwright/experimental-ct-react";
import { selectCorrectActions } from "../../src/components/NavItems/Assistant/AssistantRuleBook";
import { KNOWN_LINKS, TOOLS_CATEGORIES } from "../../src/constants/toolsData";
import { ROLES } from "../../src/constants/roles";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const titles = (actions) => actions.map((a) => a.title);

const NO_ROLE = [];
const NO_AUTH = false;
const BETA_ROLE = [ROLES.BETA_TESTER];
const REGISTERED_ROLE = [ROLES.REGISTERED_USER];
const EXTRA_ROLE = [ROLES.EXTRA_FEATURE];

// ---------------------------------------------------------------------------
// YouTube video
// ---------------------------------------------------------------------------

test("youtube video, unauthenticated: returns analysis, keyframes, thumbnails, generic download", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.YOUTUBE,
    KNOWN_LINKS.YOUTUBE,
    "https://www.youtube.com/watch?v=abc",
    NO_ROLE,
    NO_AUTH,
  );
  const t = titles(actions);
  expect(t).toContain("navbar_analysis_video");
  expect(t).toContain("navbar_keyframes");
  expect(t).toContain("navbar_thumbnails");
  expect(t).toContain("assistant_video_download_generic");
  expect(t).not.toContain("navbar_deepfake_video");
  expect(t).not.toContain("navbar_poiforensics");
  expect(t).not.toContain("assistant_video_download_action");
  expect(t).not.toContain("assistant_video_download_tiktok");
});

test("youtube video, BETA_TESTER: also includes deepfake video", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.YOUTUBE,
    KNOWN_LINKS.YOUTUBE,
    "https://www.youtube.com/watch?v=abc",
    BETA_ROLE,
    true,
  );
  const t = titles(actions);
  expect(t).toContain("navbar_deepfake_video");
  expect(t).toContain("navbar_analysis_video");
  expect(t).toContain("navbar_keyframes");
  expect(t).not.toContain("navbar_poiforensics"); // needs EXTRA_FEATURE, not BETA_TESTER
});

test("youtube video, EXTRA_FEATURE: includes poi forensics", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.YOUTUBE,
    KNOWN_LINKS.YOUTUBE,
    "https://www.youtube.com/watch?v=abc",
    EXTRA_ROLE,
    true,
  );
  expect(titles(actions)).toContain("navbar_poiforensics");
});

// ---------------------------------------------------------------------------
// Twitter video
// ---------------------------------------------------------------------------

test("twitter video, unauthenticated: returns keyframes and specific download only", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.TWITTER,
    KNOWN_LINKS.MISC,
    "https://pbs.twimg.com/ext_tw_video/123/pu/vid/video.mp4",
    NO_ROLE,
    NO_AUTH,
  );
  const t = titles(actions);
  expect(t).toContain("navbar_keyframes");
  expect(t).toContain("assistant_video_download_action");
  expect(t).not.toContain("navbar_analysis_video"); // TWITTER not in videoAnalysis linksAccepted
  expect(t).not.toContain("navbar_thumbnails");    // TWITTER not in thumbnails linksAccepted
  expect(t).not.toContain("assistant_video_download_generic");
  // videoMetadata excluded: processLinksAccepted is MISC/OWN but exception matches pbs.twimg.com
  expect(t).not.toContain("navbar_metadata_video");
});

// ---------------------------------------------------------------------------
// TikTok video
// ---------------------------------------------------------------------------

test("tiktok video, unauthenticated: returns only tiktok download", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.TIKTOK,
    KNOWN_LINKS.TIKTOK,
    "https://www.tiktok.com/@user/video/123",
    NO_ROLE,
    NO_AUTH,
  );
  const t = titles(actions);
  expect(t).toContain("assistant_video_download_tiktok");
  expect(t).not.toContain("navbar_analysis_video");
  expect(t).not.toContain("navbar_keyframes");
  expect(t).not.toContain("assistant_video_download_generic");
  expect(t).not.toContain("assistant_video_download_action");
});

// ---------------------------------------------------------------------------
// Uploaded file (OWN)
// ---------------------------------------------------------------------------

test("own video, unauthenticated: returns analysis, keyframes, thumbnails, metadata", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.OWN,
    KNOWN_LINKS.OWN,
    "blob:http://localhost/file-handle",
    NO_ROLE,
    NO_AUTH,
  );
  const t = titles(actions);
  expect(t).toContain("navbar_analysis_video");
  expect(t).toContain("navbar_keyframes");
  expect(t).toContain("navbar_thumbnails");
  expect(t).toContain("navbar_metadata_video");
  expect(t).not.toContain("navbar_deepfake_video");
  expect(t).not.toContain("assistant_video_download_generic"); // OWN not in generic download
  expect(t).not.toContain("assistant_video_download_action");
});

// ---------------------------------------------------------------------------
// MISC image
// ---------------------------------------------------------------------------

test("misc image, unauthenticated: returns magnifier, forensic, ocr, metadata", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.IMAGE,
    KNOWN_LINKS.MISC,
    KNOWN_LINKS.MISC,
    "https://example.com/photo.jpg",
    NO_ROLE,
    NO_AUTH,
  );
  const t = titles(actions);
  expect(t).toContain("navbar_magnifier");
  expect(t).toContain("navbar_forensic");
  expect(t).toContain("navbar_ocr");
  expect(t).toContain("navbar_metadata_image");
  expect(t).not.toContain("navbar_gif");                        // always excluded
  expect(t).not.toContain("navbar_synthetic_image_detection"); // needs BETA_TESTER
  expect(t).not.toContain("navbar_geolocation");               // needs BETA_TESTER
  expect(t).not.toContain("navbar_c2pa");                      // needs REGISTERED_USER
});

test("misc image, REGISTERED_USER: also includes c2pa", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.IMAGE,
    KNOWN_LINKS.MISC,
    KNOWN_LINKS.MISC,
    "https://example.com/photo.jpg",
    REGISTERED_ROLE,
    true,
  );
  const t = titles(actions);
  expect(t).toContain("navbar_c2pa");
  expect(t).not.toContain("navbar_gif");                        // still always excluded
  expect(t).not.toContain("navbar_synthetic_image_detection"); // needs BETA_TESTER specifically
  expect(t).not.toContain("navbar_geolocation");
});

test("misc image, BETA_TESTER: includes synthetic detection, geolocation, and c2pa", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.IMAGE,
    KNOWN_LINKS.MISC,
    KNOWN_LINKS.MISC,
    "https://example.com/photo.jpg",
    BETA_ROLE,
    true,
  );
  const t = titles(actions);
  expect(t).toContain("navbar_synthetic_image_detection");
  expect(t).toContain("navbar_geolocation");
  expect(t).toContain("navbar_c2pa");
  expect(t).not.toContain("navbar_gif"); // still always excluded
});

// ---------------------------------------------------------------------------
// imageGif is always excluded regardless of user eligibility
// ---------------------------------------------------------------------------

test("imageGif is never included even when user qualifies", () => {
  // REGISTERED_USER qualifies for imageGif via rolesNeeded, but it is explicitly excluded
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.IMAGE,
    KNOWN_LINKS.MISC,
    KNOWN_LINKS.MISC,
    "https://example.com/photo.jpg",
    REGISTERED_ROLE,
    true,
  );
  expect(titles(actions)).not.toContain("navbar_gif");
});

// ---------------------------------------------------------------------------
// Exception filtering: videoMetadata excluded for CDN URLs
// ---------------------------------------------------------------------------

test("videoMetadata excluded when processUrl matches CDN exception", () => {
  // pbs.twimg.com triggers the exception regex on videoMetadata
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.TWITTER,
    KNOWN_LINKS.MISC,
    "https://pbs.twimg.com/ext_tw_video/123/video.mp4",
    NO_ROLE,
    NO_AUTH,
  );
  expect(titles(actions)).not.toContain("navbar_metadata_video");
});

test("videoMetadata included when processUrl does not match CDN exception", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.VIDEO,
    KNOWN_LINKS.OWN,
    KNOWN_LINKS.OWN,
    "blob:http://localhost/file-handle",
    NO_ROLE,
    NO_AUTH,
  );
  expect(titles(actions)).toContain("navbar_metadata_video");
});

// ---------------------------------------------------------------------------
// Unauthenticated users cannot see role-gated tools
// ---------------------------------------------------------------------------

test("unauthenticated users cannot see any role-gated tools", () => {
  const actions = selectCorrectActions(
    TOOLS_CATEGORIES.IMAGE,
    KNOWN_LINKS.MISC,
    KNOWN_LINKS.MISC,
    "https://example.com/photo.jpg",
    NO_ROLE,
    NO_AUTH,
  );
  const t = titles(actions);
  expect(t).not.toContain("navbar_synthetic_image_detection");
  expect(t).not.toContain("navbar_geolocation");
  expect(t).not.toContain("navbar_c2pa");
  expect(t).not.toContain("navbar_gif");
});
