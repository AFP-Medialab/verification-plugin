import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useColorScheme, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

import { Settings } from "@mui/icons-material";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";

import { toolsHome } from "../../constants/tools";
import { selectTopMenuItem } from "../../redux/reducers/navReducer";
import { resetToolSelected } from "../../redux/reducers/tools/toolReducer";
import { theme } from "../../theme";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg";
import LogoVeraBlack from "../NavBar/images/SVG/Navbar/vera-logo_black.svg";
import LogoVeraWhite from "../NavBar/images/SVG/Navbar/vera-logo_white.svg";
import AdvancedTools from "../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";
import SettingsDrawer from "./SettingsDrawer";

const TopMenu = ({ topMenuItems }) => {
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

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleMenuClick = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const isDisplayMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  return (
    <AppBar
      position="fixed"
      sx={{
        p: 0,
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          backgroundColor: "var(--mui-palette-background-paper)",
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ sm: 1, md: 2 }}
          width="100%"
          height="100%"
          flexWrap="nowrap"
          minHeight="86px"
        >
          <Grid
            size={{ xs: 2 }}
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="start"
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="start"
              spacing={1}
              sx={{
                width: "100%",
                height: "auto",
              }}
            >
              {LOGO_EU ? (
                <LogoEuCom
                  style={{
                    height: "auto",
                    width: "100%",
                    minWidth: "24px",
                    maxWidth: "48px",
                    maxHeight: "48px",
                  }}
                  alt="logo"
                  className={classes.logoLeft}
                  onClick={handleHomeIconClick}
                />
              ) : (
                <LogoInVidWeverify
                  style={{
                    height: "auto",
                    width: "200%",
                    minWidth: "48px",
                    maxWidth: "96px",
                    maxHeight: "48px",
                  }}
                  alt="logo"
                  className={classes.logoLeft}
                  onClick={handleHomeIconClick}
                />
              )}

              {resolvedMode === "light" ? (
                <LogoVeraBlack
                  style={{
                    height: "auto",
                    width: "100%",
                    minWidth: "24px",
                    maxWidth: "48px",
                    maxHeight: "48px",
                  }}
                  alt="logo"
                  className={classes.logoRight}
                  onClick={handleHomeIconClick}
                />
              ) : (
                <LogoVeraWhite
                  style={{
                    height: "auto",
                    width: "100%",
                    minWidth: "24px",
                    maxWidth: "48px",
                    maxHeight: "48px",
                  }}
                  alt="logo"
                  className={classes.logoRight}
                  onClick={handleHomeIconClick}
                />
              )}
            </Stack>
          </Grid>
          <Grid
            size={{ xs: 1, sm: "grow" }}
            pl={isDisplayMobile ? 4 : 0}
            pr={isDisplayMobile ? 4 : 0}
            sx={{
              width: "-webkit-fill-available",
            }}
          >
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
              sx={{
                color: "var(--mui-palette-text-primary)",
              }}
            >
              {topMenuItems.map((item, index) => (
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
              ))}
            </Tabs>
          </Grid>

          <Grid>
            <Stack
              direction="row"
              spacing={{ sx: 2, md: 4 }}
              justifyContent="flex-end"
              alignItems="center"
            >
              <AdvancedTools />

              <Tooltip title={"Settings"}>
                <IconButton sx={{ p: 1 }} onClick={handleMenuClick}>
                  <Settings />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Toolbar>
      <Divider sx={{ width: "100%" }} />
      <SettingsDrawer
        isPanelOpen={isPanelOpen}
        handleClosePanel={handleClosePanel}
      />
    </AppBar>
  );
};

export default TopMenu;
