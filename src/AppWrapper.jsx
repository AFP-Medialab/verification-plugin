import { CacheProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import createCache from "@emotion/cache";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/de";
import "dayjs/locale/el";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import "dayjs/locale/it";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";

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

  const queryClient = new QueryClient();

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={currentLang}
    >
      <CacheProvider value={direction === "rtl" ? cacheRtl : emptyCache}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          </QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </LocalizationProvider>
  );
};

export default AppWrapper;
