import React, { useState } from "react";

import Box from "@mui/material/Box";

import { tools } from "../../constants/tools";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
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
      <SideMenu tools={tools} setOpenAlert={setOpenAlert} />
      <TopMenu topMenuItems={TOP_MENU_ITEMS} />
      <MainContent tools={tools} />
    </Box>
  );
};

export default ApplicationLayout;
