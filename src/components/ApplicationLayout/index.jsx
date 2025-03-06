import React, { useState } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { tools } from "../../constants/tools";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
import { theme } from "../../theme";
import MainContent from "../MainContent";
import NotificationSnackbar from "../NotificationSnackbar";
import SideMenu from "../SideMenu";
import TopMenu from "../TopMenu";

const ApplicationLayout = () => {
  // Used to display warning messages
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <NotificationSnackbar openAlert={openAlert} setOpenAlert={setOpenAlert} />
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <SideMenu tools={tools} setOpenAlert={setOpenAlert} />
        <TopMenu topMenuItems={TOP_MENU_ITEMS} />
        <MainContent tools={tools} />
      </ThemeProvider>
    </Box>
  );
};

export default ApplicationLayout;
