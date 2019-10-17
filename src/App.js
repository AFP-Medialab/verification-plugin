import React from 'react';
import NavBar from "./components/NavBar/NavBar";
import {MuiThemeProvider} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

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
    },
    typography: {
        useNextVariants: true,
    },
});

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div className="App">
                <header className="App-header">
                    <NavBar/>
                </header>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
