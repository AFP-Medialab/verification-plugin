import React, { useState } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { tools } from "../../constants/tools";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
import MainContent from "../MainContent";
import NotificationSnackbar from "../NotificationSnackbar";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import SideMenu from "../SideMenu";
import TopMenu from "../TopMenu";

const ApplicationLayout = () => {
  const theme = createTheme({
    cssVariables: true,
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
      MuiCardHeader: {
        styleOverrides: {
          title: {
            fontSize: 18,
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
          wrapper: {
            fontSize: 12,
          },
        },
      },
    },
  });

  // Used to display warning messages
  const [openAlert, setOpenAlert] = useState(false);

  const classes = useMyStyles();

  return (
    <div className={classes.flex}>
      <NotificationSnackbar openAlert={openAlert} setOpenAlert={setOpenAlert} />
      <ThemeProvider theme={theme}>
        <SideMenu tools={tools} setOpenAlert={setOpenAlert} />
        <TopMenu topMenuItems={TOP_MENU_ITEMS} />
        <MainContent tools={tools} />
      </ThemeProvider>
    </div>
  );
};

export default ApplicationLayout;
