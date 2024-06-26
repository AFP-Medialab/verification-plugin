import React, { useState } from "react";
import { Box } from "@mui/material";
import NotificationSnackbar from "../NotificationSnackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TopMenu from "../TopMenu";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
import SideMenu from "../SideMenu";
import { tools } from "../../constants/tools";

const ApplicationLayout = () => {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "#ffffff",
          },
          root: {
            zIndex: 1300,
            height: "87px",
            boxShadow: "none",
            paddingTop: "12px",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          gutters: {
            paddingLeft: "26px",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          popupIndicatorOpen: {
            transform: "none!important",
          },
          popper: {
            zIndex: 99999,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "10px!important",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minWidth: "160px",
          },
        },
      },
    },
  });

  // Used to display warning messages
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <Box>
      <NotificationSnackbar openAlert={openAlert} setOpenAlert={setOpenAlert} />
      <ThemeProvider theme={theme}>
        <SideMenu tools={tools} setOpenAlert={setOpenAlert} />
        <TopMenu topMenuItems={TOP_MENU_ITEMS} />
        {/*<MainContentMenu />*/}
      </ThemeProvider>
    </Box>
  );
};

export default ApplicationLayout;
