import React from "react";
import { Button, Grid } from "@mui/material";
import { SEARCH_ENGINE_SETTINGS } from "components/Shared/ReverseSearch/reverseSearchUtils";
import useMyStyles from "../MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "../Languages/i18nLoadNamespace";

export const ReverseSearchButtons = (props) => {
  //const keyword = props.keyword;
  const keyword = i18nLoadNamespace("components/Shared/ReverseSearch");
  const classes = useMyStyles();
  const reverseSearch = props.reverseSearch;
  return (
    <>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
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
        <Grid item>
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
        <Grid item>
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
        <Grid item>
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
        <Grid item>
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
        <Grid item>
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
        <Grid item>
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
        {props.children}
      </Grid>
    </>
  );
};
