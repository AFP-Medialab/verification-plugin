import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { browser } from "wxt/browser";

/**
 * YouTube Embed component for browser extensions
 * Shows a clickable thumbnail that opens the video in YouTube
 *
 * Direct embedding often fails in browser extensions (error 152-4),
 * so this provides a reliable click-to-watch experience
 *
 * @param {string} [videoId] - YouTube video ID (e.g. "xf8mjbVRqao")
 * @param {string} [embedLink] - Full YouTube embed URL (e.g. "https://www.youtube.com/embed/xf8mjbVRqao?rel=0").
 *   The video ID is extracted automatically. Used when videoId is not provided.
 */
const YouTubeEmbed = ({
  videoId,
  embedLink,
  width = "560",
  height = "315",
}) => {
  if (!videoId && embedLink) {
    const match = embedLink.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    videoId = match ? match[1] : null;
  }
  const handleWatchOnYouTube = () => {
    browser.tabs.create({
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  };

  return (
    <Box
      onClick={handleWatchOnYouTube}
      sx={{
        width: width + "px",
        height: height + "px",
        position: "relative",
        backgroundColor: "#000",
        backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 2,
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 4,
        },
        "&:hover .overlay": {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      }}
    >
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          transition: "background-color 0.2s",
        }}
      >
        <PlayArrowIcon sx={{ fontSize: 80, color: "white", opacity: 0.9 }} />
        <Button
          variant="contained"
          color="error"
          size="large"
          startIcon={<OpenInNewIcon />}
          onClick={handleWatchOnYouTube}
          sx={{
            pointerEvents: "none", // Let the parent Box handle clicks
          }}
        >
          Watch on YouTube
        </Button>
      </Box>
    </Box>
  );
};

export default YouTubeEmbed;
