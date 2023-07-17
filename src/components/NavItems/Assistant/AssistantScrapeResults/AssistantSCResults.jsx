import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SentimentSatisfied from "@mui/icons-material/SentimentSatisfied";

import { setAssuranceExpanded } from "../../../../redux/actions/tools/assistantActions";
import SourceCredibilityResult from "../AssistantCheckResults/SourceCredibilityResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const AssistantSCResults = () => {
  // central
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv,
  );
  const dispatch = useDispatch();
  const classes = useMyStyles();

  // state
  const assuranceExpanded = useSelector(
    (state) => state.assistant.assuranceExpanded,
  );
  const positiveSourCred = useSelector(
    (state) => state.assistant.positiveSourceCred,
  );
  const cautionSourceCred = useSelector(
    (state) => state.assistant.cautionSourceCred,
  );
  const mixedSourceCred = useSelector(
    (state) => state.assistant.mixedSourceCred,
  );

  return (
    <Box mb={2} pl={1}>
      <Card variant={"outlined"} className={classes.sourceCredibilityBorder}>
        <Grid container>
          <Grid item xs={12} className={classes.displayFlex}>
            <CardMedia>
              <Box m={1}>
                <FindInPageIcon fontSize={"large"} color={"primary"} />
              </Box>
            </CardMedia>

            <Box m={1} />

            <Box mt={1.5}>
              <Typography component={"span"} variant={"h6"}>
                {keyword("url_domain_analysis")}
              </Typography>
            </Box>

            <IconButton
              className={classes.assistantIconRight}
              onClick={() => dispatch(setAssuranceExpanded(!assuranceExpanded))}
            >
              <ExpandMoreIcon color={"primary"} />
            </IconButton>
          </Grid>

          <Grid item xs={12}>
            <Collapse
              in={assuranceExpanded}
              className={classes.assistantBackground}
            >
              <Box mt={3} ml={2}>
                {positiveSourCred ? (
                  <div>
                    <Typography
                      variant={"subtitle1"}
                      className={classes.fontBold}
                    >
                      {keyword("fact_checker")}
                    </Typography>
                    <SourceCredibilityResult
                      scResultFiltered={positiveSourCred}
                      icon={CheckCircleOutlineIcon}
                      iconColor="primary"
                    />
                  </div>
                ) : null}

                {cautionSourceCred ? (
                  <div>
                    <Typography
                      variant={"subtitle1"}
                      className={classes.fontBold}
                    >
                      {keyword("warning_title")}
                    </Typography>
                    <SourceCredibilityResult
                      scResultFiltered={cautionSourceCred}
                      icon={ErrorOutlineOutlinedIcon}
                      iconColor="error"
                    />
                  </div>
                ) : null}

                {mixedSourceCred ? (
                  <div>
                    <Typography
                      variant={"subtitle1"}
                      className={classes.fontBold}
                    >
                      {keyword("mentions")}
                    </Typography>
                    <SourceCredibilityResult
                      scResultFiltered={mixedSourceCred}
                      icon={SentimentSatisfied}
                      iconColor="action"
                    />
                  </div>
                ) : null}

                <Box mr={2} mb={1}>
                  <Tooltip
                    interactive={"true"}
                    leaveDelay={50}
                    style={{ display: "flex", marginLeft: "auto" }}
                    title={
                      <div
                        className={"content"}
                        dangerouslySetInnerHTML={{
                          __html: keyword("sc_tooltip"),
                        }}
                      />
                    }
                    classes={{ tooltip: classes.assistantTooltip }}
                  >
                    <HelpOutlineOutlinedIcon color={"action"} />
                  </Tooltip>
                </Box>
              </Box>
            </Collapse>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
export default AssistantSCResults;
