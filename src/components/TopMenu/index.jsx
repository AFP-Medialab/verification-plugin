import React from "react";
import { AppBar, Grid, Stack, Tab, Tabs, Toolbar } from "@mui/material";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg";
import LogoVera from "../NavBar/images/SVG/Navbar/vera-logo_black.svg";
import { Link, useNavigate } from "react-router-dom";
import AdvancedTools from "../NavItems/tools/Alltools/AdvancedTools/AdvancedTools";
import Languages from "../NavItems/languages/languages";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import { useDispatch, useSelector } from "react-redux";
import { i18nLoadNamespace } from "../Shared/Languages/i18nLoadNamespace";
import { selectTopMenuItem } from "../../redux/reducers/navReducer";
import { toolsHome } from "../../constants/tools";
import { resetToolSelected } from "../../redux/reducers/tools/toolReducer";

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
      fill: topMenuItemSelected === toolName ? "#00926c" : "#4c4c4c",
      fontSize: "24px",
    };
  };

  return (
    <AppBar position="fixed" width={"100%"}>
      <Toolbar
        className={classes.toolbar}
        style={{ borderBottom: "solid 1px #dedbdb" }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ sm: 1, md: 2 }}
        >
          <Grid item xs={2}>
            <Stack
              direction="row"
              justifyContent="flex-start"
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
          </Grid>
          <Grid item xs={7}>
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
              sx={{ color: "black" }}
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
                      minWidth: "120px",
                    }}
                    value={item.title}
                  />
                );
              })}
            </Tabs>
          </Grid>
          <Grid item xs={2}>
            <AdvancedTools />
          </Grid>
          <Grid item xs={1}>
            <Languages />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
