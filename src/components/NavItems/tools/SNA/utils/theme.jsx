const { createTheme } = require("@mui/material");

const theme = createTheme({
  components: {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingTop: "11px!important",
          paddingBottom: "11px!important",
        },
        title: {
          fontSize: "20px!important",
          fontweight: 500,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        wrapper: {
          fontSize: 12,
        },
        root: {
          minWidth: "25%!important",
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:before": {
            width: "0px",
          },
          border: "1px solid #00926c",
        },
        rounded: {
          borderRadius: "15px",
        },
      },
    },
  },

  palette: {
    primary: {
      light: "#00926c",
      main: "#00926c",
      dark: "#00926c",
      contrastText: "#fff",
    },
  },
});

export default theme;
