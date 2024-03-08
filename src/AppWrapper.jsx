import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
// eslint-disable-next-line no-unused-vars
import "dayjs/locale/en";
import "dayjs/locale/fr";
import "dayjs/locale/es";
import "dayjs/locale/el";
import "dayjs/locale/it";
import "dayjs/locale/ar";
import "dayjs/locale/de";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const AppWrapper = ({ children }) => {
  //   const { children } = props;
  const currentLang = useSelector((state) => state.language);

  // Set UI dicrection based on language reading direction
  const direction = currentLang !== "ar" ? "ltr" : "rtl";

  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, stylisRTLPlugin],
  });

  const emptyCache = createCache({
    key: "empty",
  });

  const theme = createTheme({
    direction: direction,
  });

  if (dayjs.locale() !== currentLang) {
    dayjs.locale(currentLang);
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={currentLang}
    >
      <CacheProvider value={direction === "rtl" ? cacheRtl : emptyCache}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </CacheProvider>
    </LocalizationProvider>
  );
};

export default AppWrapper;
