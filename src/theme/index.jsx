import { createTheme } from "@mui/material/styles";

export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 20;
export const DEFAULT_FONT_SIZE = 14;

export const getStoredFontSize = () => {
  const storedSize = localStorage.getItem("fontSize");
  return storedSize ? parseInt(storedSize) : DEFAULT_FONT_SIZE;
};

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: "#00926c",
          main: "#00926c",
          dark: "#00926c",
          contrastText: "#fff",
        },
        background: {
          main: "#FAFAFA",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          light: "#00926c",
          main: "#00926c",
          dark: "#00926c",
          contrastText: "#fff",
        },
        background: {
          main: "#1e1e1e",
        },
      },
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "var(--mui-palette-background-paper)",
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 0,
          textTransform: "none",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: "160px",
          textTransform: "none",
          fontSize: 12,
        },
      },
    },
  },
  typography: {
    fontSize: 12,
  },
});
