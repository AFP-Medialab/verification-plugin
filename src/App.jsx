import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HashRouter, Route, Routes } from "react-router-dom";

import PopUp from "./components/PopUp/PopUp";
import NavBar from "./components/NavBar/NavBar";
import useAuthenticationAPI from "./components/Shared/Authentication/useAuthenticationAPI";

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
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route index path="/" element={<PopUp />} />
          <Route path={"/app/*"} element={<NavBar />} />
        </Routes>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
