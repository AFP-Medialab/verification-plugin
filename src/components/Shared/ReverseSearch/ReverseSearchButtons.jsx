import React from "react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { SEARCH_ENGINE_SETTINGS } from "@/components/Shared/ReverseSearch/reverseSearchUtils";

import { i18nLoadNamespace } from "../Languages/i18nLoadNamespace";
import useMyStyles from "../MaterialUiStyles/useMyStyles";
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
    return !!(
      value.SUPPORTED_IMAGE_FORMAT &&
      value.SUPPORTED_IMAGE_FORMAT.includes(format)
    );
  });
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "center",
        }}
      >
        {enginesMap.map((engine, index) => {
          return (
            <Grid key={index}>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={async () => await reverseSearch(engine.NAME)}
              >
                {keyword(engine.CONTEXT_MENU_ID)}
              </Button>
            </Grid>
          );
        })}
        {children}
      </Grid>
    </>
  );

  /*return (
            <>
             <Grid container justifyContent="center" spacing={2}>
               <Grid>
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
                </Grid>
               <Grid>
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
                </Grid>
               <Grid>
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
                </Grid>
               <Grid>
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
                </Grid>
               <Grid>
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
                </Grid>
               <Grid>
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
                </Grid>
               <Grid>
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
                </Grid>
                {children}
              </Grid>
            </>
          );*/
};
