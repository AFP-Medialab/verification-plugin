import React from "react";

import YouTubeEmbed from "./YouTubeEmbed";

/**
 * Renders an HTML string from translations, replacing YouTube <iframe> tags
 * with the YouTubeEmbed component to avoid error 152-154 in browser extensions
 * (chrome-extension:// origin is blocked by YouTube's embed player).
 *
 * Falls back to dangerouslySetInnerHTML for non-YouTube content.
 *
 * @param {string} html - Raw HTML string (e.g. from i18n translations)
 * @param {object} style - Optional inline style for the HTML wrapper divs
 * @param {string} className - Optional className for the HTML wrapper divs
 */
const HtmlWithYouTubeEmbed = ({ html, style, className }) => {
  const youtubeRegex =
    /<iframe[^>]+src="https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)[^"]*"[^>]*>(?:<\/iframe>)?/gi;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = youtubeRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "html", content: html.slice(lastIndex, match.index) });
    }
    parts.push({ type: "youtube", videoId: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    parts.push({ type: "html", content: html.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return (
      <div
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <>
      {parts.map((part, i) =>
        part.type === "youtube" ? (
          <YouTubeEmbed key={i} videoId={part.videoId} />
        ) : part.content.trim() ? (
          <div
            key={i}
            className={className}
            style={style}
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        ) : null,
      )}
    </>
  );
};

export default HtmlWithYouTubeEmbed;
