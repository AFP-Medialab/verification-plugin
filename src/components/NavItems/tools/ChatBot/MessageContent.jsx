import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";

import { ExpandLess, ExpandMore, Psychology } from "@mui/icons-material";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import remarkGfm from "remark-gfm";

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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {thinkContent}
          </ReactMarkdown>
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {regularContent}
          </ReactMarkdown>
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
