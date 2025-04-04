import React from "react";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const ColorModeSelect = () => {
  const keyword = i18nLoadNamespace("components/NavBar");
  const { mode, setMode } = useColorScheme();

  return (
    <Box>
      <Select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        variant="outlined"
        sx={{ minWidth: 120 }}
        size="small"
      >
        <MenuItem value="light">
          <Stack direction="row" alignItems="center" spacing={1}>
            <LightModeIcon />
            <Typography>{keyword("color_mode_light")}</Typography>
          </Stack>
        </MenuItem>
        <MenuItem value="system">
          <Stack direction="row" alignItems="center" spacing={1}>
            <SettingsBrightnessIcon />
            <Typography>{keyword("color_mode_system")}</Typography>
          </Stack>
        </MenuItem>
        <MenuItem value="dark">
          <Stack direction="row" alignItems="center" spacing={1}>
            <DarkModeIcon />
            <Typography>{keyword("color_mode_dark")}</Typography>
          </Stack>
        </MenuItem>
      </Select>
    </Box>
  );
};

export default ColorModeSelect;
