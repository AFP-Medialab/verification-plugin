import { useMemo } from "react";
import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";

const useClasses = (stylesElement) => {
  const theme = useTheme();
  return useMemo(() => {
    const rawClasses =
      typeof stylesElement === "function"
        ? stylesElement(theme)
        : stylesElement;
    const prepared = {};

    Object.entries(rawClasses).forEach(([key, value = {}]) => {
      prepared[key] = css(value);
    });

    return prepared;
  }, [stylesElement, theme]);
};

export default useClasses;
