import React, { useState } from "react";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

import CopyButton from "@Shared/CopyButton";

/**
 * A presentational component that renders JSON content in a styled, scrollable block.
 * It uses the current MUI color scheme to adjust background color for dark/light modes.
 *
 * @component
 * @param {string} children - The stringified JSON content to display.
 * @returns {JSX.Element} A styled block with the JSON content.
 */
const JsonBlock = ({ children }) => {
  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;
  const [collapsedKeys, setCollapsedKeys] = useState({});

  const toggleCollapse = (path) => {
    setCollapsedKeys((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Utility to parse JSON and render as styled JSX
  const parseJsonToJsx = (json, resolvedMode, path = "") => {
    if (typeof json === "string") {
      try {
        json = JSON.parse(json);
      } catch {
        return <span style={{ color: "red" }}>Invalid JSON</span>;
      }
    }

    const keyColor = resolvedMode === "dark" ? "#9cdcfe" : "#0000ff";
    const stringColor = resolvedMode === "dark" ? "#ce9178" : "#a31515";
    const numberColor = resolvedMode === "dark" ? "#b5cea8" : "#098658";
    const booleanColor = resolvedMode === "dark" ? "#569cd6" : "#0000ff";
    const nullColor = resolvedMode === "dark" ? "#569cd6" : "#0000ff";

    const renderValue = (value, currentPath) => {
      if (typeof value === "string")
        return <span style={{ color: stringColor }}>{`"${value}"`}</span>;
      if (typeof value === "number")
        return <span style={{ color: numberColor }}>{value}</span>;
      if (typeof value === "boolean")
        return <span style={{ color: booleanColor }}>{value.toString()}</span>;
      if (value === null) return <span style={{ color: nullColor }}>null</span>;
      if (Array.isArray(value) || typeof value === "object")
        return renderObject(value, 2, currentPath);
      return <span>{String(value)}</span>;
    };

    const renderObject = (obj, indent = 2, parentPath = "") => {
      const entries = Array.isArray(obj) ? obj : Object.entries(obj);
      const isArray = Array.isArray(obj);
      const open = !collapsedKeys[parentPath];

      return (
        <>
          <span
            onClick={() => toggleCollapse(parentPath)}
            style={{ cursor: "pointer", userSelect: "none", marginRight: 4 }}
          >
            {open ? "▾" : "▸"}
          </span>
          <span>{isArray ? "[" : "{"}</span>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {entries.map((entry, idx) => {
              const key = isArray ? idx : entry[0];
              const val = isArray ? entry : entry[1];
              const currentPath = parentPath + "." + key;
              return (
                <Box key={idx} style={{ marginLeft: indent * 8 }}>
                  {!isArray && (
                    <>
                      <span style={{ color: keyColor }}>{`"${key}"`}</span>
                      <span>: </span>
                    </>
                  )}
                  {renderValue(val, currentPath)}
                  {idx < entries.length - 1 ? "," : ""}
                </Box>
              );
            })}
          </Collapse>
          <span>{isArray ? "]" : "}"}</span>
        </>
      );
    };

    return [renderObject(json, 2, path)];
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: resolvedMode === "dark" ? "#1e1e1e" : "#f5f5f5",
        padding: 2,
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <CopyButton
          strToCopy={children}
          labelBeforeCopy={"Copy JSON"}
          labelAfterCopy={"Copied!"}
        />
      </Box>
      <Typography
        component="pre"
        sx={{
          overflowX: "auto",
          fontFamily: "monospace",
          flexGrow: 1,
          marginRight: 2,
          marginTop: 0,
        }}
      >
        {parseJsonToJsx(children, resolvedMode)}
      </Typography>
    </Box>
  );
};

export default JsonBlock;
