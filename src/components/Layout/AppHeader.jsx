import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useColorScheme, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

import { Settings } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import { toolsHome } from "@/constants/tools";
import { selectTopMenuItem } from "@/redux/reducers/navReducer";
import { resetToolSelected } from "@/redux/reducers/tools/toolReducer";
import { theme } from "@/theme";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";

import LogoEuComWhite from "../NavBar/images/SVG/Navbar/ep-logo-white.svg";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg";
import LogoVeraBlack from "../NavBar/images/SVG/Navbar/vera-logo_black.svg";
import LogoVeraWhite from "../NavBar/images/SVG/Navbar/vera-logo_white.svg";
import AdvancedTools from "../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";
import useAuthenticationAPI from "../Shared/Authentication/useAuthenticationAPI";
import SettingsDrawer from "./SettingsDrawer";

const AppHeader = ({ topMenuItems }) => {
  const [selectedCollection, setSelectedCollection] =
    useState("Default Collection");

  const [recording, setRecording] = useState(false);

  const [collections, setCollections] = useState(["Default Collection"]);

  const getRecordingInfo = async () => {
    let recInfo = await browser.runtime.sendMessage({
      prompt: "getRecordingInfo",
    });
    setCollections(recInfo.collections.map((x) => x.id).flat());
    setRecording(recInfo.recording[0].state != false);
    recInfo.recording[0].state != false
      ? setSelectedCollection(recInfo.recording[0].state)
      : {};
  };

  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavBar");
  const authKeyword = i18nLoadNamespace("components/Shared/Authentication");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const LOGO_EU = import.meta.env.VITE_LOGO_EU;

  const topMenuItemSelected = useSelector((state) => state.nav);
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const authenticationAPI = useAuthenticationAPI();

  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchor);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    authenticationAPI.logout().catch((error) => {
      console.error("Logout error:", error);
    });
    handleProfileMenuClose();
  };

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
          ? "var(--mui-palette-primary-main)"
          : "var(--mui-palette-text-secondary)",
      fontSize: "24px",
    };
  };

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleMenuClick = () => {
    getRecordingInfo();
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
          spacing={{ sm: 1, md: 2 }}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "100%",
            flexWrap: "nowrap",
            minHeight: "86px",
          }}
        >
          <Grid
            size={{ xs: 2 }}
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "start",
                width: "100%",
                height: "auto",
              }}
            >
              {LOGO_EU ? (
                resolvedMode === "light" ? (
                  <LogoEuCom
                    style={{
                      height: "auto",
                      width: "100%",
                      minWidth: "48px",
                      maxWidth: "96px",
                      maxHeight: "48px",
                    }}
                    alt="logo"
                    className={classes.logoLeft}
                    onClick={handleHomeIconClick}
                  />
                ) : (
                  <LogoEuComWhite
                    style={{
                      height: "auto",
                      width: "100%",
                      minWidth: "48px",
                      maxWidth: "96px",
                      maxHeight: "48px",
                    }}
                    alt="logo"
                    className={classes.logoLeft}
                    onClick={handleHomeIconClick}
                  />
                )
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
            sx={{
              pl: isDisplayMobile ? 4 : 0,
              pr: isDisplayMobile ? 4 : 0,
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
              slotProps={{
                indicator: {
                  ...{
                    style: { display: "none" },
                  },

                  ...{
                    display: "none",
                  },
                },
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
              sx={{
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <AdvancedTools />

              {userAuthenticated && (
                <>
                  <Tooltip title={keyword("drawer_settings_account")}>
                    <IconButton
                      sx={{ p: 1 }}
                      onClick={handleProfileMenuOpen}
                      aria-controls={
                        isProfileMenuOpen ? "profile-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={isProfileMenuOpen ? "true" : undefined}
                    >
                      <AccountCircle
                        sx={{ color: "var(--mui-palette-primary-main)" }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="profile-menu"
                    anchorEl={profileMenuAnchor}
                    open={isProfileMenuOpen}
                    onClose={handleProfileMenuClose}
                    onClick={handleProfileMenuClose}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>
                        {authKeyword("LOGUSER_LOGOUT_LABEL")}
                      </ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}

              <Tooltip title={keyword("drawer_settings_title")}>
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
        recording={recording}
        setRecording={setRecording}
        collections={collections}
        setCollections={setCollections}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
      />
    </AppBar>
  );
};

export default AppHeader;
