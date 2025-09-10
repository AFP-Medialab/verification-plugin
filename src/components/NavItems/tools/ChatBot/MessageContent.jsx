import React, { useState } from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

import { ExpandLess, ExpandMore, Psychology } from "@mui/icons-material";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

/**
 * Parse message content to extract <think> tags and regular content
 * @param {string} content - Raw message content
 * @returns {Object} - Parsed content with think sections and regular content
 */
const parseMessageContent = (content) => {
  if (!content) return { regularContent: "", thinkSections: [] };

  const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
  const thinkSections = [];
  let match;
  let lastIndex = 0;
  let regularContent = "";

  // Extract all <think> sections
  while ((match = thinkRegex.exec(content)) !== null) {
    // Add content before this <think> tag
    regularContent += content.slice(lastIndex, match.index);

    // Store the think section content
    thinkSections.push({
      id: thinkSections.length,
      content: match[1].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining content after last <think> tag
  regularContent += content.slice(lastIndex);

  return {
    regularContent: regularContent.trim(),
    thinkSections,
  };
};

/**
 * Simple markdown-like formatter
 * @param {string} text - Text to format
 * @returns {JSX.Element} - Formatted content
 */
const formatMarkdownLike = (text) => {
  if (!text) return null;

  // Split by paragraphs
  const paragraphs = text.split(/\n\s*\n/);

  return paragraphs
    .map((paragraph, index) => {
      if (!paragraph.trim()) return null;

      // Handle different markdown-like elements
      let formattedText = paragraph
        // Bold text **text**
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Italic text *text*
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        // Code blocks `code`
        .replace(
          /`(.*?)`/g,
          '<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>',
        )
        // Line breaks
        .replace(/\n/g, "<br />");

      return (
        <Typography
          key={index}
          variant="body1"
          sx={{
            mb: paragraph.includes("\n") ? 1 : 0.5,
            textAlign: "left",
          }}
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    })
    .filter(Boolean);
};

/**
 * Expandable think section component
 */
const ThinkSection = ({ thinkContent }) => {
  const [expanded, setExpanded] = useState(false);
  const keyword = i18nLoadNamespace("components/NavItems/tools/ChatBot");
  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ my: 1 }}>
      <Chip
        icon={<Psychology />}
        label={expanded ? keyword("thinking_hide") : keyword("thinking_show")}
        onClick={handleToggle}
        variant="outlined"
        size="small"
        color="primary"
        sx={{
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "primary.light",
            color: "white",
          },
        }}
        deleteIcon={expanded ? <ExpandLess /> : <ExpandMore />}
        onDelete={handleToggle}
      />
      <Collapse in={expanded}>
        <Box
          sx={{
            mt: 1,
            p: 2,
            backgroundColor: "#f8f9fa",
            borderLeft: "4px solid #2196f3",
            borderRadius: 1,
            fontStyle: "italic",
            textAlign: "left",
          }}
        >
          {formatMarkdownLike(thinkContent)}
        </Box>
      </Collapse>
    </Box>
  );
};

/**
 * Main message content component that handles both think tags and markdown formatting
 */
const MessageContent = ({ content, sender }) => {
  const { regularContent, thinkSections } = parseMessageContent(content);

  return (
    <Box sx={{ textAlign: "left" }}>
      {/* Regular content with markdown formatting */}
      {regularContent && (
        <Box sx={{ mb: thinkSections.length > 0 ? 1 : 0 }}>
          {formatMarkdownLike(regularContent)}
        </Box>
      )}

      {/* Think sections - only show for bot messages */}
      {sender === "bot" &&
        thinkSections.map((section) => (
          <ThinkSection
            key={section.id}
            thinkContent={section.content}
            sectionId={section.id}
          />
        ))}
    </Box>
  );
};

export default MessageContent;
