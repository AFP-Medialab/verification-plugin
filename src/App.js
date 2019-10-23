import React from 'react';
import NavBar from "./components/NavBar/NavBar";
import {MuiThemeProvider} from "@material-ui/core";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Button from "@material-ui/core/Button";

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
        window.open("popup.html#homepage");
    }
    }>Hello</Button>)
};

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <div>
                <header>
                    {
                        (window.location.hash === "#homepage") ? <NavBar/> : <Testing/>
                    }
                </header>
            </div>
        </MuiThemeProvider>
    );
}

export default App;
