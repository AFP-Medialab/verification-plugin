import React from "react";
import { useSelector } from "react-redux";

import { Box, Grid2, Typography } from "@mui/material/";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";

import FiberNewIcon from "@mui/icons-material/FiberNew";
import ScienceIcon from "@mui/icons-material/Science";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import ImprovedIcon from "../../../NavBar/images/SVG/Improved.svg";
import AuthenticationIcon from "./AdvancedTools/AuthenticationIcon";

/**
 *
 * @param tool {Tool}
 * @returns {Element}
 * @constructor
 */
const ToolsMenuItem = ({ tool, onClick }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Alltools");

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const showNew = tool.rolesIcons && tool.rolesIcons.includes("new");
  const showRedesign =
    tool.rolesIcons && tool.rolesIcons.includes("redesigned");
  const showLock = tool.rolesIcons && tool.rolesIcons.includes("lock");
  const showExperimental =
    tool.rolesIcons && tool.rolesIcons.includes("experimental");

  return (
    <Card variant="outlined" onClick={onClick} sx={{ height: "100%" }}>
      <CardActionArea sx={{ height: "100%" }}>
        <CardContent sx={{ height: "100%" }}>
          <Grid2
            container
            direction="row"
            alignItems="flex-start"
            justifyContent="flex-start"
            spacing={1}
          >
            <Grid2>
              <tool.icon sx={{ color: "#00926c" }} />
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
                <AuthenticationIcon />
              </Grid2>
            )}
          </Grid2>

          <Box style={{ minHeight: "45px" }}>
            <Typography sx={{ fontSize: "10px" }}>
              {keyword(tool.descriptionKeyword)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ToolsMenuItem;
