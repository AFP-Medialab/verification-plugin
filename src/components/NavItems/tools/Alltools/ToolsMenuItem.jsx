import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material/";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import AuthenticationIcon from "./AdvancedTools/AuthenticationIcon";
import ImprovedIcon from "../../../NavBar/images/SVG/Improved.svg";
import ScienceIcon from "@mui/icons-material/Science";
import { i18nLoadNamespace } from "../../../Shared/Languages/i18nLoadNamespace";
import { useSelector } from "react-redux";

/**
 *
 * @param tool {Tool}
 * @returns {Element}
 * @constructor
 */
const ToolsMenuItem = ({ tool }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Alltools");

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const [isHovered, setIsHovered] = useState(false);

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const showNew =
    tool.rolesIcons && tool.rolesIcons.includes("new") ? true : false;
  let showRedesign =
    tool.rolesIcons && tool.rolesIcons.includes("redesigned") ? true : false;
  let showLock =
    tool.rolesIcons && tool.rolesIcons.includes("lock") ? true : false;
  let showExperimental =
    tool.rolesIcons && tool.rolesIcons.includes("experimental") ? true : false;

  const styleCard = isHovered
    ? {
        border: "solid #90A4AE 2px",
        borderRadius: "10px",
        cursor: "pointer",
        backgroundColor: "#ffffff",
      }
    : {
        border: "solid #dce0e2 2px",
        borderRadius: "10px",
        cursor: "pointer",
        backgroundColor: "#ffffff",
      };

  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={styleCard}
    >
      <Box p={2}>
        <Box mr={1}>
          <Grid container direction="row" alignItems="center">
            <Grid item>{tool.icon}</Grid>
            <Grid item>
              <Box ml={1} />
            </Grid>

            <Grid item xs>
              <Typography letiant="h6">{keyword(tool.titleKeyword)}</Typography>
            </Grid>

            {showRedesign && (
              <Grid item style={{ marginLeft: "auto", color: "#F44336" }}>
                <ImprovedIcon title="Upgraded" width="40px" height="40px" />
              </Grid>
            )}

            {showNew && (
              <Grid item style={{ marginLeft: "auto", color: "#F44336" }}>
                <FiberNewIcon />
              </Grid>
            )}

            {showExperimental && (
              <Grid item style={{ marginLeft: "auto", color: "#F44336" }}>
                <ScienceIcon />
              </Grid>
            )}

            {showLock && !userAuthenticated && (
              <Grid item style={{ marginLeft: "auto" }}>
                <Box ml={2}>
                  <AuthenticationIcon />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box m={1} />

        <div style={{ minHeight: "45px" }}>
          <span style={{ fontSize: "10px" }}>
            {keyword(tool.descriptionKeyword)}
          </span>
        </div>
      </Box>
    </Box>
  );
};

export default ToolsMenuItem;
