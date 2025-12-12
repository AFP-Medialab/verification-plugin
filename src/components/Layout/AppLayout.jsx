import React, { useState } from "react";

import Box from "@mui/material/Box";

import { tools } from "@/constants/tools";
import { TOP_MENU_ITEMS } from "@/constants/topMenuItems";

import NotificationSnackbar from "../NotificationSnackbar";
import AppContent from "./AppContent";
import AppHeader from "./AppHeader";
import NavigationSidebar from "./NavigationSidebar";

const AppLayout = () => {
  // Used to display warning messages
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <NotificationSnackbar openAlert={openAlert} setOpenAlert={setOpenAlert} />
      <NavigationSidebar tools={tools} setOpenAlert={setOpenAlert} />
      <AppHeader topMenuItems={TOP_MENU_ITEMS} />
      <AppContent tools={tools} />
    </Box>
  );
};

export default AppLayout;
