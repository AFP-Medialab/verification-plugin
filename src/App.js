import React from 'react';
import NavBar from "./components/NavBar/NavBar";
import {MuiThemeProvider} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Button from "@material-ui/core/Button";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import history from "./components/History/History";

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

const Testing = () => {
    return (<Button onClick={() => {
        window.open("/popup.html#/app/tools/all");
    }
    }>OPEN</Button>)
};

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Router history={history}>
                <div>
                    <header>
                        <Switch>
                            <Route exact path={"/"}>
                                <Testing/>
                            </Route>
                            <Route path={"/app"}>
                                <NavBar/>
                            </Route>
                            <Route>
                                {
                                    window.location.hash + "not found"
                                }
                            </Route>
                        </Switch>
                    </header>
                </div>
            </Router>
        </MuiThemeProvider>
    );
}

export default App;
