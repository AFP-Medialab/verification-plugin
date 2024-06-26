import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HashRouter, Route, Routes } from "react-router-dom";
import PopUp from "./components/PopUp/PopUp";
import useAuthenticationAPI from "./components/Shared/Authentication/useAuthenticationAPI";
import { useDispatch } from "react-redux";
import {
  cleanErrorNetwork,
  setErrorNetwork,
} from "redux/reducers/errorReducer";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import ApplicationLayout from "./components/ApplicationLayout";

const theme = createTheme({
  palette: {
    primary: {
      light: "#00926c",
      main: "#00926c",
      dark: "#00926c",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffaf33",
    },
    error: {
      main: "rgb(198,57,59)",
    },
  },
  typography: {
    useNextVariants: "true",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: "white",
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          overflow: "visible",
        },
      },
    },
    zIndex: {
      styleOverrides: {
        drawer: 1099,
      },
    },
  },
});

const App = () => {
  const keyword = i18nLoadNamespace("components/Shared/utils");
  const [isOnline, setOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();
  const checkInternetConnection = () => {
    if (navigator.onLine) {
      dispatch(cleanErrorNetwork());
      //console.log("online")
      if (!isOnline) {
        window.location.reload(false);
        setOnline(true);
      }
    } else {
      dispatch(setErrorNetwork(keyword("offline")));
      setOnline(false);
      //console.log("offline")
    }
  };

  const authenticationAPI = useAuthenticationAPI();
  const locationSearchStart = window.location.href.lastIndexOf("?");
  if (locationSearchStart > 0) {
    const locationSearch = window.location.href.substring(
      locationSearchStart + 1,
    );
    // console.log("Query params: ", locationSearch);
    if (locationSearch) {
      const locationParams = new URLSearchParams(locationSearch);
      const accessCode = locationParams.get("ac");
      // console.log("Found ac param: ", accessCode);
      if (accessCode) {
        authenticationAPI.login({ accessCode });
      }
    }
  }

  useEffect(() => {
    window.addEventListener("online", checkInternetConnection);
    window.addEventListener("offline", checkInternetConnection);
    checkInternetConnection();
    return () => {
      window.removeEventListener("online", checkInternetConnection);
      window.removeEventListener("offline", checkInternetConnection);
    };
  }, []);

  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route index path="/" element={<PopUp />} />
          <Route path={"/app/*"} element={<ApplicationLayout />} />
        </Routes>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
