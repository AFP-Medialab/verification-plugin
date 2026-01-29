import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useColorScheme, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
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
import MenuIcon from "@mui/icons-material/Menu";

import { canUserSeeTool, toolsHome } from "@/constants/tools";
import { selectTopMenuItem } from "@/redux/reducers/navReducer";
import {
  resetToolSelected,
  selectTool,
} from "@/redux/reducers/tools/toolReducer";
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

const AppHeader = ({ topMenuItems, tools }) => {
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
  const selectedToolTitleKeyword = useSelector((state) => state.tool.toolName);
  const pinnedTools = useSelector((state) => state.tool?.pinnedTools || []);
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );
  const role = useSelector((state) => state.userSession.user.roles);

  const authenticationAPI = useAuthenticationAPI();

  // Get pinned tool objects
  const pinnedToolObjects = pinnedTools
    .map((toolKeyword) => tools.find((t) => t.titleKeyword === toolKeyword))
    .filter((tool) => tool && canUserSeeTool(tool, role, userAuthenticated));

  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchor);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileMenuItemClick = (item) => {
    dispatch(selectTopMenuItem(item.title));
    if (item.title !== toolsHome.titleKeyword) {
      dispatch(resetToolSelected());
    }
    navigate("/app/" + item.path);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    authenticationAPI.logout().catch((error) => {
      console.error("Logout error:", error);
    });
    handleProfileMenuClose();
  };

  const handleTopMenuChange = (event, newValue) => {
    // Check if the new value is a pinned tool
    const isPinnedTool = pinnedToolObjects.some(
      (tool) => tool.titleKeyword === newValue,
    );

    if (isPinnedTool) {
      // Handle pinned tool click
      const tool = pinnedToolObjects.find((t) => t.titleKeyword === newValue);
      if (tool) {
        dispatch(selectTopMenuItem(toolsHome.titleKeyword));
        dispatch(selectTool(tool.titleKeyword));
        navigate("/app/tools/" + tool.path);
      }
    } else {
      // Handle regular top menu item click
      dispatch(selectTopMenuItem(newValue));

      if (newValue !== toolsHome.titleKeyword) {
        dispatch(resetToolSelected());
      }
    }
  };

  const handlePinnedToolClick = (tool) => {
    dispatch(selectTopMenuItem(toolsHome.titleKeyword));
    dispatch(selectTool(tool.titleKeyword));
    navigate("/app/tools/" + tool.path);
  };

  const handleHomeIconClick = () => {
    navigate("/app/" + toolsHome.path);
  };

  const iconConditionalStyling = (toolName) => {
    // For "Tools" tab, don't highlight if the selected tool is pinned
    if (
      toolName === "navbar_tools" &&
      topMenuItemSelected === toolName &&
      pinnedTools.includes(selectedToolTitleKeyword)
    ) {
      return {
        fill: "var(--mui-palette-text-secondary)",
        fontSize: "24px",
      };
    }

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
            size={{ xs: isDisplayMobile ? 4 : 2 }}
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Stack
              direction="row"
              spacing={isDisplayMobile ? 0.5 : 1}
              sx={{
                alignItems: "center",
                justifyContent: "start",
                width: "100%",
                height: "auto",
              }}
            >
              {isDisplayMobile && (
                <IconButton
                  sx={{ p: 0.5, flexShrink: 0 }}
                  onClick={handleMobileMenuToggle}
                  aria-label="Toggle navigation menu"
                >
                  <MenuIcon />
                </IconButton>
              )}
              {LOGO_EU ? (
                resolvedMode === "light" ? (
                  <LogoEuCom
                    style={{
                      height: "auto",
                      width: "100%",
                      minWidth: "64px",
                      maxWidth: "96px",
                      maxHeight: "48px",
                      flexShrink: 1,
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
                      minWidth: "64px",
                      maxWidth: "96px",
                      maxHeight: "48px",
                      flexShrink: 1,
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
                    minWidth: "64px",
                    maxWidth: "96px",
                    maxHeight: "48px",
                    flexShrink: 1,
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
                    minWidth: "40px",
                    maxWidth: "48px",
                    maxHeight: "48px",
                    flexShrink: 1,
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
                    minWidth: "40px",
                    maxWidth: "48px",
                    maxHeight: "48px",
                    flexShrink: 1,
                  }}
                  alt="logo"
                  className={classes.logoRight}
                  onClick={handleHomeIconClick}
                />
              )}
            </Stack>
          </Grid>
          {!isDisplayMobile && (
            <Grid
              size={{ xs: 1, sm: "grow" }}
              sx={{
                pl: isDisplayMobile ? 4 : 0,
                pr: isDisplayMobile ? 4 : 0,
                width: "-webkit-fill-available",
              }}
            >
              <Tabs
                value={
                  topMenuItemSelected === "navbar_tools" &&
                  pinnedTools.includes(selectedToolTitleKeyword)
                    ? selectedToolTitleKeyword
                    : topMenuItemSelected
                }
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
                      ...(index === topMenuItems.length - 1 &&
                        pinnedToolObjects.length > 0 && {
                          borderRight: "1px solid var(--mui-palette-divider)",
                          mr: 1,
                        }),
                    }}
                    value={item.title}
                  />
                ))}
                {pinnedToolObjects.map((tool, index) => {
                  const isToolSelected =
                    topMenuItemSelected === "navbar_tools" &&
                    selectedToolTitleKeyword === tool.titleKeyword;
                  return (
                    <Tab
                      key={`pinned-${index}`}
                      label={keyword(tool.titleKeyword)}
                      icon={
                        <tool.icon
                          sx={{
                            fill: isToolSelected
                              ? "var(--mui-palette-primary-main)"
                              : "var(--mui-palette-text-secondary)",
                            fontSize: "24px",
                          }}
                        />
                      }
                      sx={{
                        minWidth: "100px",
                        fontSize: "1rem",
                      }}
                      value={tool.titleKeyword}
                    />
                  );
                })}
              </Tabs>
            </Grid>
          )}

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

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            marginTop: "86px",
            height: "calc(100% - 86px)",
          },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            {topMenuItems.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  p: 0,
                }}
              >
                <ListItemButton
                  selected={topMenuItemSelected === item.title}
                  onClick={() => handleMobileMenuItemClick(item)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&.Mui-selected": {
                      backgroundColor: "var(--mui-palette-action-selected)",
                    },
                    pl: 2.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <item.icon
                      sx={{
                        fontSize: "32px",
                        fill:
                          topMenuItemSelected === item.title
                            ? "var(--mui-palette-primary-main)"
                            : "var(--mui-palette-text-secondary)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={keyword(item.title)}
                    sx={{
                      color:
                        topMenuItemSelected === item.title
                          ? "var(--mui-palette-primary-main)"
                          : "var(--mui-palette-text-primary)",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {pinnedToolObjects.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItemText
                  primary={keyword("navbar_pinned")}
                  sx={{
                    px: 2.5,
                    py: 1,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "text.secondary",
                    textTransform: "uppercase",
                  }}
                />
                {pinnedToolObjects.map((tool, index) => (
                  <ListItem
                    key={`mobile-pinned-${index}`}
                    sx={{
                      p: 0,
                    }}
                  >
                    <ListItemButton
                      selected={
                        topMenuItemSelected === "navbar_tools" &&
                        selectedToolTitleKeyword === tool.titleKeyword
                      }
                      onClick={() => {
                        handlePinnedToolClick(tool);
                        handleMobileMenuClose();
                      }}
                      sx={{
                        py: 1.5,
                        px: 2,
                        "&.Mui-selected": {
                          backgroundColor: "var(--mui-palette-action-selected)",
                        },
                        pl: 2.5,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        <tool.icon
                          sx={{
                            fontSize: "32px",
                            fill:
                              topMenuItemSelected === "navbar_tools" &&
                              selectedToolTitleKeyword === tool.titleKeyword
                                ? "var(--mui-palette-primary-main)"
                                : "var(--mui-palette-text-secondary)",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={keyword(tool.titleKeyword)}
                        sx={{
                          color:
                            topMenuItemSelected === "navbar_tools" &&
                            selectedToolTitleKeyword === tool.titleKeyword
                              ? "var(--mui-palette-primary-main)"
                              : "var(--mui-palette-text-primary)",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default AppHeader;
