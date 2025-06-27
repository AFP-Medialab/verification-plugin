import React from "react";

import { useColorScheme } from "@mui/material";
import Typography from "@mui/material/Typography";

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

  // Utility to parse JSON and render as styled JSX
  const parseJsonToJsx = (json, resolvedMode) => {
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

    const renderValue = (value) => {
      if (typeof value === "string")
        return <span style={{ color: stringColor }}>{`"${value}"`}</span>;
      if (typeof value === "number")
        return <span style={{ color: numberColor }}>{value}</span>;
      if (typeof value === "boolean")
        return <span style={{ color: booleanColor }}>{value.toString()}</span>;
      if (value === null) return <span style={{ color: nullColor }}>null</span>;
      if (Array.isArray(value)) return renderObject(value);
      if (typeof value === "object") return renderObject(value);
      return <span>{String(value)}</span>;
    };

    const renderObject = (obj, indent = 2) => {
      const entries = Array.isArray(obj) ? obj : Object.entries(obj);
      const isArray = Array.isArray(obj);
      return (
        <>
          <span>{isArray ? "[" : "{"}</span>
          <br />
          {entries.map((entry, idx) => {
            const key = isArray ? idx : entry[0];
            const val = isArray ? entry : entry[1];
            return (
              <div key={idx} style={{ marginLeft: indent * 8 }}>
                {!isArray && (
                  <>
                    <span style={{ color: keyColor }}>{`"${key}"`}</span>
                    <span>: </span>
                  </>
                )}
                {renderValue(val)}
                {idx < entries.length - 1 ? "," : ""}
              </div>
            );
          })}
          <br />
          <span>{isArray ? "]" : "}"}</span>
        </>
      );
    };

    return [renderObject(json, 2)];
  };

  return (
    <Typography
      component="pre"
      sx={{
        backgroundColor: resolvedMode === "dark" ? "#1e1e1e" : "#f5f5f5",
        padding: 2,
        borderRadius: 2,
        overflowX: "auto",
        fontFamily: "monospace",
        flexGrow: 1,
        marginRight: 2,
      }}
    >
      {parseJsonToJsx(children, resolvedMode)}
    </Typography>
  );
};

export default JsonBlock;
