import React from "react";
import MainContentMenuTabItems from "../NavBar/MainContentMenuTabItems/MainContentMenuTabItems";
import ScrollTop from "../Shared/ScrollTop/ScrollTop";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Fab, Snackbar } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import MySnackbar from "../MySnackbar/MySnackbar";
import {
  cleanError,
  cleanErrorNetwork,
} from "../../redux/reducers/errorReducer";
import { setFalse, setTrue } from "../../redux/reducers/cookiesReducers";
import Feedback from "../Feedback/Feedback";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import { TOOL_STATUS_ICON, tools } from "../../constants/tools";
import { useDispatch, useSelector } from "react-redux";
import { i18nLoadNamespace } from "../Shared/Languages/i18nLoadNamespace";

const MainContentMenu = () => {
  const classes = useMyStyles();

  const keyword = i18nLoadNamespace("components/NavBar");

  const dispatch = useDispatch();

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const error = useSelector((state) => state.error.tools);
  const errorNetwork = useSelector((state) => state.error.network);

  const cookiesUsage = useSelector((state) => state.cookies);

  const role = useSelector((state) => state.userSession.user.roles);

  const drawItemPerRole = tools.filter((tool) => {
    if (
      !tools.rolesNeeded ||
      tool.rolesNeeded.length === 0 ||
      tool.rolesNeeded.includes(TOOL_STATUS_ICON.LOCK)
    )
      return true;
    else if (
      tools.rolesNeeded.some((restriction) => role.includes(restriction))
    )
      return true;
    else return false;
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
      <MainContentMenuTabItems
        className={classes.noMargin}
        tabItems={tools}
        toolsList={drawItemPerRole}
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

export default MainContentMenu;
