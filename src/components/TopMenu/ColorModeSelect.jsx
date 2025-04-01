import React from "react";

import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useColorScheme } from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const ColorModeSelect = () => {
  const keyword = i18nLoadNamespace("components/NavBar");

  const { mode, setMode } = useColorScheme();

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Box>
      <ToggleButtonGroup
        color="primary"
        value={mode}
        exclusive
        onChange={handleModeChange}
        variant="outlined"
      >
        <ToggleButton value="light">
          <LightModeIcon sx={{ mr: 1 }} />
          {keyword("color_mode_light")}
        </ToggleButton>
        <ToggleButton value="system">
          <SettingsBrightnessIcon sx={{ mr: 1 }} />
          {keyword("color_mode_system")}
        </ToggleButton>
        <ToggleButton value="dark">
          <DarkModeIcon sx={{ mr: 1 }} />
          {keyword("color_mode_dark")}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ColorModeSelect;
