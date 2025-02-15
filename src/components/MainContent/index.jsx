import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { KeyboardArrowUp } from "@mui/icons-material";

import { canUserSeeTool } from "../../constants/tools";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
import { setFalse, setTrue } from "../../redux/reducers/cookiesReducers";
import {
  cleanError,
  cleanErrorNetwork,
} from "../../redux/reducers/errorReducer";
import Feedback from "../Feedback/Feedback";
import MySnackbar from "../MySnackbar/MySnackbar";
import MainContentMenuTopMenuItems from "../NavBar/MainContentMenuTabItems/MainContentMenuTopMenuItems";
import { i18nLoadNamespace } from "../Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import ScrollTop from "../Shared/ScrollTop/ScrollTop";

/**
 *
 * @param tools {Tool[]}
 * @returns {Element}
 * @constructor
 */
const MainContent = ({ tools }) => {
  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavBar");

  const dispatch = useDispatch();

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const error = useSelector((state) => state.error.tools);
  const errorNetwork = useSelector((state) => state.error.network);

  const cookiesUsage = useSelector((state) => state.cookies);

  const role = useSelector((state) => state.userSession.user.roles);

  const userAuthenticated = useSelector(
    (state) => state.userSession.userAuthenticated,
  );

  const toolsAllowedForRole = tools.filter((tool) => {
    return canUserSeeTool(tool, role, userAuthenticated);
  });

  const themeFab = createTheme({
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

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} id="back-to-top-anchor" />
      <MainContentMenuTopMenuItems
        className={classes.noMargin}
        topMenuItems={TOP_MENU_ITEMS}
        tools={toolsAllowedForRole}
      />
      <ScrollTop
        {...{ isCurrentLanguageLeftToRight: isCurrentLanguageLeftToRight }}
      >
        <ThemeProvider theme={themeFab}>
          <Fab
            color="primary"
            size="large"
            aria-label="scroll back to top"
            className={classes.fabTop}
          >
            <KeyboardArrowUp />
          </Fab>
        </ThemeProvider>
      </ScrollTop>
      {error !== null && (
        <MySnackbar
          variant="error"
          message={error}
          onClick={() => dispatch(cleanError())}
          onClose={() => {}}
          sx={{ mr: 8 }}
        />
      )}
      {errorNetwork !== null && (
        <MySnackbar
          variant="error"
          message={errorNetwork}
          onClick={() => dispatch(cleanErrorNetwork())}
          onClose={() => {}}
          sx={{ mr: 8 }}
        />
      )}
      {cookiesUsage.active === null && (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={true}
          message={keyword("cookies_message")}
          action={[
            <Button
              key={"cookies_decline"}
              color={"secondary"}
              size={"small"}
              onClick={() => dispatch(setFalse())}
            >
              {" "}
              {keyword("cookies_decline")}{" "}
            </Button>,
            <Button
              key={"cookies_accept"}
              color={"primary"}
              size={"small"}
              onClick={() => dispatch(setTrue())}
            >
              {" "}
              {keyword("cookies_accept")}{" "}
            </Button>,
          ]}
        />
      )}
      <Feedback />
    </main>
  );
};

export default MainContent;
