// components/Shared/AdvancedSettingsContainer.jsx
import React from "react";

import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

/**
 * AdvancedSettingsContainer
 *
 * A container component for displaying advanced settings with toggle and reset functionality.
 *
 * @param {boolean} showAdvancedSettings - Whether advanced settings are visible.
 * @param {function} setShowAdvancedSettings - Setter function to toggle advanced settings visibility.
 * @param {boolean} showResetAdvancedSettings - Whether the reset button should be displayed.
 * @param {function} resetSearchSettings - Callback when reset button is clicked.
 * @param {React.ReactNode} children - Advanced settings content to display.
 * @param {function} keywordFn - Function that receives a string key and returns the translated string.
 * @param {string} keywordShow - Label text for the "show" button.
 * @param {string} keywordHide - Label text for the "hide" button.
 * @param {string} keywordReset - Label text for the "reset settings to default" button.
 */

const AdvancedSettingsContainer = ({
  showAdvancedSettings,
  setShowAdvancedSettings,
  showResetAdvancedSettings,
  resetSearchSettings,
  children,
  keywordFn,
  keywordShow,
  keywordHide,
  keywordReset,
}) => {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          endIcon={
            showAdvancedSettings ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
          onClick={() => setShowAdvancedSettings((prev) => !prev)}
        >
          {showAdvancedSettings
            ? keywordFn(keywordHide)
            : keywordFn(keywordShow)}
        </Button>
        {showResetAdvancedSettings && (
          <Button variant="text" onClick={resetSearchSettings}>
            {keywordFn(keywordReset)}
          </Button>
        )}
      </Stack>

      <Collapse
        in={showAdvancedSettings}
        mountOnEnter
        // unmountOnExit
      >
        {children}
      </Collapse>
    </>
  );
};

export default AdvancedSettingsContainer;
