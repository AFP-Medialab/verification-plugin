import React, { useState } from "react";
import { Box, Grid2, Typography } from "@mui/material/";
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

  const showNew = tool.rolesIcons && tool.rolesIcons.includes("new");
  const showRedesign =
    tool.rolesIcons && tool.rolesIcons.includes("redesigned");
  const showLock = tool.rolesIcons && tool.rolesIcons.includes("lock");
  const showExperimental =
    tool.rolesIcons && tool.rolesIcons.includes("experimental");

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
      <Box sx={{ p: 2 }}>
        <Box sx={{ mr: 1 }}>
          <Grid2 container direction="row" alignItems="center">
            <Grid2>
              <tool.icon sx={{ color: "#00926c" }} />
            </Grid2>
            <Grid2>
              <Box sx={{ ml: 1 }} />
            </Grid2>

            <Grid2 size="grow">
              <Typography letiant="h6">{keyword(tool.titleKeyword)}</Typography>
            </Grid2>

            {showRedesign && (
              <Grid2 style={{ marginLeft: "auto", color: "#F44336" }}>
                <ImprovedIcon title="Upgraded" width="40px" height="40px" />
              </Grid2>
            )}

            {showNew && (
              <Grid2 style={{ marginLeft: "auto", color: "#F44336" }}>
                <FiberNewIcon />
              </Grid2>
            )}

            {showExperimental && (
              <Grid2 style={{ marginLeft: "auto", color: "#F44336" }}>
                <ScienceIcon />
              </Grid2>
            )}

            {showLock && !userAuthenticated && (
              <Grid2 style={{ marginLeft: "auto" }}>
                <Box sx={{ ml: 2 }}>
                  <AuthenticationIcon />
                </Box>
              </Grid2>
            )}
          </Grid2>
        </Box>

        <Box sx={{ m: 1 }} />

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
