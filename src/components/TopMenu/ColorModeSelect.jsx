import React, { useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useColorScheme } from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const ColorModeSelect = () => {
  const keyword = i18nLoadNamespace("components/NavBar");

  const { mode, setMode, systemMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const resolvedMode = systemMode || mode;
  const icon = {
    light: (
      <LightModeIcon
        fontSize="inherit"
        sx={{ color: "var(--mui-palette-text-primary)" }}
      />
    ),
    dark: (
      <DarkModeIcon
        fontSize="inherit"
        sx={{ color: "var(--mui-palette-text-primary)" }}
      />
    ),
  }[resolvedMode];

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMode = (targetMode) => () => {
    setMode(targetMode);
    handleClose();
  };

  return (
    <Box>
      <IconButton size="medium" sx={{ p: 1 }} onClick={handleClick}>
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem selected={mode === "system"} onClick={handleMode("system")}>
          {keyword("color_mode_system")}
        </MenuItem>
        <MenuItem selected={mode === "light"} onClick={handleMode("light")}>
          {keyword("color_mode_light")}
        </MenuItem>
        <MenuItem selected={mode === "dark"} onClick={handleMode("dark")}>
          {keyword("color_mode_dark")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ColorModeSelect;
