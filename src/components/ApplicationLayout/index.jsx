import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { tools } from "../../constants/tools";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
import { theme as defaultTheme, getStoredFontSize } from "../../theme";
import MainContent from "../MainContent";
import NotificationSnackbar from "../NotificationSnackbar";
import SideMenu from "../SideMenu";
import TopMenu from "../TopMenu";

const ApplicationLayout = () => {
  // Used to display warning messages
  const [openAlert, setOpenAlert] = useState(false);

  const [fontSize, setFontSize] = useState(getStoredFontSize());

  useEffect(() => {
    const handleStorageChange = () => {
      const newFontSize = getStoredFontSize();
      setFontSize(newFontSize);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const currentLang = useSelector((state) => state.language);

  // Set UI direction based on language reading direction
  const direction = currentLang !== "ar" ? "ltr" : "rtl";

  const theme = {
    ...defaultTheme,
    direction: direction,
    typography: {
      fontSize: fontSize,
    },
  };

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
