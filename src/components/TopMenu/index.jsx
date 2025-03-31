import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Settings } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";

import { toolsHome } from "../../constants/tools";
import {
  toggleHumanRightsCheckBox,
  toggleUnlockExplanationCheckBox,
} from "../../redux/actions";
import {
  toggleAnalyticsCheckBox,
  toggleState,
} from "../../redux/reducers/cookiesReducers";
import { selectTopMenuItem } from "../../redux/reducers/navReducer";
import { resetToolSelected } from "../../redux/reducers/tools/toolReducer";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg";
import LogoVera from "../NavBar/images/SVG/Navbar/vera-logo_black.svg";
import Languages from "../NavItems/languages/languages";
import AdvancedTools from "../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";
import ColorModeSelect from "./ColorModeSelect";

const TopMenu = ({ topMenuItems }) => {
  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavBar");

  const keywordAboutSettings = i18nLoadNamespace("components/NavItems/About");

  const dispatch = useDispatch();

  const humanRights = useSelector((state) => state.humanRightsCheckBox);
  const interactiveExplanation = useSelector(
    (state) => state.interactiveExplanation,
  );
  const cookiesUsage = useSelector((state) => state.cookies.active);
  const gaUsage = useSelector((state) => state.cookies.analytics);

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

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleMenuClick = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  useEffect(() => {
    window
      .matchMedia("(max-width: 800px)")
      .addEventListener("change", (e) => setMatchesSmallWidth(e.matches));
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        minWidth: "600px",
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

              <Tooltip title={"Settings"}>
                <IconButton sx={{ p: 1 }} onClick={handleMenuClick}>
                  <Settings />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid2>
        </Grid2>
      </Toolbar>
      <Divider sx={{ width: "100%" }} />
      <Drawer
        anchor="right"
        open={isPanelOpen}
        onClose={handleClosePanel}
        sx={{
          width: "250px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "300px",
            boxSizing: "border-box",
            marginTop: "86px", // Add padding to the top to avoid overlap with the AppBar
            height: "-webkit-fill-available",
          },
        }}
      >
        <Box p={2}>
          <Stack direction="column" spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">{"Settings"}</Typography>
              <Box>
                <IconButton sx={{ p: 1 }} onClick={handleClosePanel}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Stack>

            <Stack direction="column" alignItems="start" spacing={1}>
              <Typography>{"Language"}</Typography>
              <Languages />
            </Stack>

            <Stack direction="column" alignItems="start" spacing={1}>
              <Typography>{"Color theme"}</Typography>
              <ColorModeSelect />
            </Stack>

            <Stack direction="column" alignItems="start" spacing={1}>
              <Typography>{"Font size"}</Typography>
              {/*  Component to add here to change the default font size... */}
            </Stack>

            <Stack direction="column" spacing={0}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={humanRights}
                    onChange={() => dispatch(toggleHumanRightsCheckBox())}
                    value="checkedBox"
                    color="primary"
                  />
                }
                label={keywordAboutSettings("about_human_rights")}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={interactiveExplanation}
                    onChange={() => dispatch(toggleUnlockExplanationCheckBox())}
                    value="checkedBox"
                    color="primary"
                  />
                }
                label={keywordAboutSettings("quiz_unlock_explanations")}
              />
              {cookiesUsage !== null && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cookiesUsage}
                      onChange={() => dispatch(toggleState(cookiesUsage))}
                      value="checkedBox"
                      color="primary"
                    />
                  }
                  label={keywordAboutSettings("storage_usage")}
                />
              )}
              {gaUsage !== null && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={gaUsage}
                      onChange={() =>
                        dispatch(toggleAnalyticsCheckBox(gaUsage))
                      }
                      value="checkedBox"
                      color="primary"
                    />
                  }
                  label={keywordAboutSettings("cookies_usage")}
                />
              )}
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default TopMenu;
