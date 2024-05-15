import React from "react";
import { Button, Grid } from "@mui/material";
import { SEARCH_ENGINE_SETTINGS } from "components/Shared/ReverseSearch/reverseSearchUtils";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";

export const ReverseSearchButtons = (props) => {
  const keyword = props.keyword;
  const classes = useMyStyles();
  const reverseSearch = props.reverseSearch;
  const report = props.report;
  const disableTwitter = props.disableTwitter;
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
            {keyword("button_reverse_google")}
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
            {keyword("button_reverse_yandex")}
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
            {keyword("button_reverse_tineye")}
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
            {keyword("button_reverse_google_factcheck")}
          </Button>
        </Grid>
        {!disableTwitter &&
          report["verification_cues"] &&
          report["verification_cues"]["twitter_search_url"] && (
            <Grid item>
              <Button
                className={classes.button}
                variant="contained"
                color={"primary"}
                onClick={() =>
                  window.open(report["verification_cues"]["twitter_search_url"])
                }
              >
                {keyword("button_reverse_twitter")}
              </Button>
            </Grid>
          )}
      </Grid>
    </>
  );
};
