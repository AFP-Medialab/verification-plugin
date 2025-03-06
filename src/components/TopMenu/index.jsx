import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import { useColorScheme } from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";

import { toolsHome } from "../../constants/tools";
import { selectTopMenuItem } from "../../redux/reducers/navReducer";
import { resetToolSelected } from "../../redux/reducers/tools/toolReducer";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg";
import LogoVera from "../NavBar/images/SVG/Navbar/vera-logo_black.svg";
import Languages from "../NavItems/languages/languages";
import AdvancedTools from "../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";

const TopMenu = ({ topMenuItems }) => {
  const { mode, setMode, systemMode } = useColorScheme();

  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavBar");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const LOGO_EU = process.env.REACT_APP_LOGO_EU;

  const topMenuItemSelected = useSelector((state) => state.nav);

  const handleTopMenuChange = (event, newValue) => {
    dispatch(selectTopMenuItem(newValue));

    if (newValue !== toolsHome.titleKeyword) {
      dispatch(resetToolSelected());
    }
  };

  const handleHomeIconClick = () => {
    navigate("/app/" + toolsHome.path);
  };

  const iconConditionalStyling = (toolName) => {
    return {
      fill:
        topMenuItemSelected === toolName
          ? "#00926c"
          : "var(--mui-palette-text-secondary)",
      fontSize: "24px",
    };
  };

  const [matchesSmallWidth, setMatchesSmallWidth] = useState(
    window.matchMedia("(max-width: 800px)").matches,
  );

  useEffect(() => {
    window
      .matchMedia("(max-width: 800px)")
      .addEventListener("change", (e) => setMatchesSmallWidth(e.matches));
  }, []);

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

  console.log(resolvedMode);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMode = (targetMode) => () => {
    setMode(targetMode);
    handleClose();
  };

  return (
    <AppBar position="fixed" sx={{ minWidth: "600px", p: 0, width: "100%" }}>
      <Toolbar sx={{ width: "100%" }}>
        <Grid2
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ sm: 1, md: 2 }}
          width="100%"
          height="100%"
          flexWrap="nowrap"
        >
          <Grid2 size={{ xs: 2 }} height="100%">
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ sm: 1, md: 2 }}
            >
              {LOGO_EU ? (
                <LogoEuCom
                  style={{
                    height: "auto",
                    minWidth: "48px",
                    width: { sm: "48px", md: "80px" },
                  }}
                  alt="logo"
                  className={classes.logoLeft}
                  onClick={handleHomeIconClick}
                />
              ) : (
                <LogoInVidWeverify
                  style={{
                    height: "auto",
                    minWidth: "96px",
                    width: { sm: "96px", md: "96px" },
                  }}
                  alt="logo"
                  className={classes.logoLeft}
                  onClick={handleHomeIconClick}
                />
              )}
              <LogoVera
                style={{
                  height: "auto",
                  minWidth: "48px",
                  width: { sm: "48px", md: "80px" },
                }}
                alt="logo"
                className={classes.logoRight}
                onClick={handleHomeIconClick}
              />
            </Stack>
          </Grid2>
          <Grid2 size={{ xs: 1, sm: "grow" }}>
            <Tabs
              value={topMenuItemSelected}
              variant="scrollable"
              onChange={handleTopMenuChange}
              scrollButtons="auto"
              allowScrollButtonsMobile
              indicatorColor="primary"
              textColor="primary"
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              sx={
                matchesSmallWidth
                  ? {
                      color: "black",
                      maxWidth: "33vw",
                    }
                  : { color: "black" }
              }
            >
              {topMenuItems.map((item, index) => {
                return (
                  <Tab
                    key={index}
                    label={keyword(item.title)}
                    icon={<item.icon sx={iconConditionalStyling(item.title)} />}
                    to={item.path}
                    component={Link}
                    sx={{
                      minWidth: "100px",
                      fontSize: "1rem",
                    }}
                    value={item.title}
                  />
                );
              })}
            </Tabs>
          </Grid2>
          <Grid2>
            <Stack
              direction="row"
              spacing={{ sx: 2, md: 4 }}
              justifyContent="flex-end"
              alignItems="center"
            >
              <AdvancedTools />
              <Languages />
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
                  <MenuItem
                    selected={mode === "system"}
                    onClick={handleMode("system")}
                  >
                    System
                  </MenuItem>
                  <MenuItem
                    selected={mode === "light"}
                    onClick={handleMode("light")}
                  >
                    Light
                  </MenuItem>
                  <MenuItem
                    selected={mode === "dark"}
                    onClick={handleMode("dark")}
                  >
                    Dark
                  </MenuItem>
                </Menu>
              </Box>
            </Stack>
          </Grid2>
        </Grid2>
      </Toolbar>
      <Divider sx={{ width: "100%" }} />
    </AppBar>
  );
};

export default TopMenu;
