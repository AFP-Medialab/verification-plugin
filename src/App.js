import React from 'react';
import NavBar from "./components/NavBar/NavBar";
import {MuiThemeProvider} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Button from "@material-ui/core/Button";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import history from "./components/utility/History/History";
import PopUp from "./components/PopUp/PopUp";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#fff',
            main: 'rgb(0,170,180)',
            dark: '#00707e'
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
});

const NotFound = () => {
    return (
        <div>404 not found</div>
    )
};

function App() {
    return (
        <Router history={history}>

            <MuiThemeProvider theme={theme}>
                <Switch>
                    <Route exact path={"/"} component={PopUp}/>
                    <Route path={"/app"} component={NavBar}/>
                    <Route component={NotFound}/>
                </Switch>
            </MuiThemeProvider>
        </Router>
    );
}

export default App;
