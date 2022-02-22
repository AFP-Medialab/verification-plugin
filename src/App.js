import React, { useEffect } from 'react';
import NavBar from "./components/NavBar/NavBar";
import {createTheme, ThemeProvider} from "@material-ui/core/styles";
import { Router, Route, Switch } from "react-router-dom";
import history from "./components/Shared/History/History";
import PopUp from "./components/PopUp/PopUp";
import ReactGA from 'react-ga';
import { useSelector } from "react-redux";

//import auth from './auth.ts'; // Sample authentication provider
import useAuthenticationAPI from './components/Shared/Authentication/useAuthenticationAPI';

const theme = createTheme({
  palette: {
    primary: {
      light: '#5cdbe6',
      main: '#05a9b4',
      dark: '#007984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffaf33',
    },
    error: {
      main: 'rgb(198,57,59)'
    }
  },
  typography: {
    useNextVariants: 'true',
  },
  overrides: {
    MuiButton: {
      containedPrimary: {
        color: 'white',
      },
    },
    MuiIcon: {
      root: {
        overflow: "visible"
      }
    },
  },
  zIndex: {
    drawer: 1099
  }
});

const NotFound = () => {
  return (
    <div>404 not found</div>
  );
};

function App() {

  const cookies = useSelector(state => state.cookies);
  const googleAnalytic = useSelector(state => state.googleAnalytic);

  useEffect(() => {
    const trackingId = process.env.REACT_APP_GOOGLE_ANALYTICS_KEY;
    ReactGA.initialize(trackingId, {
      //debug: true,
      titleCase: false,
    });
    ReactGA.ga('set', 'checkProtocolTask', () => {
    });
    ReactGA.pageview('/popup.html');
    history.listen(location => {
      ReactGA.set({ page: location.pathname }); // Update the user's current page
      ReactGA.pageview(location.pathname); // Record a pageview for the given page
    });
  }, []);

  useEffect(() => {
    if (googleAnalytic!== null && googleAnalytic) {
      window['ga-disable-' + process.env.REACT_APP_GOOGLE_ANALYTICS_KEY] = false;
    } else {
      window['ga-disable-' + process.env.REACT_APP_GOOGLE_ANALYTICS_KEY] = true;
    }

  }, [cookies, googleAnalytic]);

  const authenticationAPI = useAuthenticationAPI();

  // Handle authentication link with access code
  // console.log("Location: ", window.location);
  // const locationSearch = window.location.search;
  // console.log("Query params: ", locationSearch);
  const locationSearchStart = window.location.href.lastIndexOf("?");
  if (locationSearchStart > 0) {
    const locationSearch = window.location.href.substring(locationSearchStart + 1);
    // console.log("Query params: ", locationSearch);
    if (locationSearch) {
      const locationParams = new URLSearchParams(locationSearch);
      const accessCode = locationParams.get('ac');
      // console.log("Found ac param: ", accessCode);
      if (accessCode) {
        authenticationAPI.login({ accessCode });
      }
    }
  }

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path={"/"} component={PopUp} />
          <Route path={"/app"} component={NavBar} />
          <Route id="test" component={NotFound} />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
