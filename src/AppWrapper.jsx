import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import stylisRTLPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";

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

  return (
    <CacheProvider value={direction === "rtl" ? cacheRtl : emptyCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
};

export default AppWrapper;
