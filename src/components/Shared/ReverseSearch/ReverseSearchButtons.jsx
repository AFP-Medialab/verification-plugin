import React from "react";
import { Button, Grid2 } from "@mui/material";
import { SEARCH_ENGINE_SETTINGS } from "components/Shared/ReverseSearch/reverseSearchUtils";
import useMyStyles from "../MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "../Languages/i18nLoadNamespace";
import { IMAGE_FORMATS } from "./utils/searchUtils";

export const ReverseSearchButtons = ({
  reverseSearch,
  isimageUrl = true,
  children,
}) => {
  const keyword = i18nLoadNamespace("components/Shared/ReverseSearch");
  const classes = useMyStyles();
  const format = isimageUrl ? IMAGE_FORMATS.URI : IMAGE_FORMATS.LOCAL;
  const enginesMap = Object.values(SEARCH_ENGINE_SETTINGS).filter((value) => {
    return value.SUPPORTED_IMAGE_FORMAT &&
      value.SUPPORTED_IMAGE_FORMAT.includes(format)
      ? true
      : false;
  });
  return (
    <>
      <Grid2 container justifyContent="center" spacing={2}>
        {enginesMap.map((engine, index) => {
          return (
            <Grid2 key={index}>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () => await reverseSearch(engine.NAME)}
              >
                {keyword(engine.CONTEXT_MENU_ID)}
              </Button>
            </Grid2>
          );
        })}
        {children}
      </Grid2>
    </>
  );

  /*return (
        <>
         <Grid2 container justifyContent="center" spacing={2}>
           <Grid2>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () =>
                  await reverseSearch(
                    SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME,
                  )
                }
              >
                {keyword("reverse_search_google_lens")}
              </Button>
            </Grid2>
           <Grid2>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () =>
                  await reverseSearch(SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME)
                }
              >
                {keyword("reverse_search_yandex")}
              </Button>
            </Grid2>
           <Grid2>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () =>
                  await reverseSearch(SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME)
                }
              >
                {keyword("reverse_search_tineye")}
              </Button>
            </Grid2>
           <Grid2>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () =>
                  await reverseSearch(SEARCH_ENGINE_SETTINGS.GOOGLE_FACT_CHECK.NAME)
                }
              >
                {keyword("reverse_google_factcheck")}
              </Button>
            </Grid2>
           <Grid2>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () =>
                  await reverseSearch(SEARCH_ENGINE_SETTINGS.BING_SEARCH.NAME)
                }
              >
                {keyword("reverse_search_bing")}
              </Button>
            </Grid2>
           <Grid2>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () =>
                  await reverseSearch(SEARCH_ENGINE_SETTINGS.BAIDU_SEARCH.NAME)
                }
              >
                {keyword("reverse_search_baidu")}
              </Button>
            </Grid2>
           <Grid2>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () =>
                  await reverseSearch(SEARCH_ENGINE_SETTINGS.DBKF_SEARCH.NAME)
                }
              >
                {keyword("reverse_search_dbkf")}
              </Button>
            </Grid2>
            {children}
          </Grid2>
        </>
      );*/
};
