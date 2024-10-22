import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Chip, Grid2, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SentimentSatisfied from "@mui/icons-material/SentimentSatisfied";

import { setAssuranceExpanded } from "../../../../redux/actions/tools/assistantActions";
import SourceCredibilityResult from "../AssistantCheckResults/SourceCredibilityResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const AssistantSCResults = () => {
  // central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
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
  const trafficLightColors = useSelector(
    (state) => state.assistant.trafficLightColors,
  );

  // define types of source credibility
  // also defined in AssistantLinkResult - move to redux?
  const sourceTypes = {
    caution: "warning",
    mixed: "mentions",
    positive: "fact_checker",
  };

  return (
    <Card variant={"outlined"} className={classes.sourceCredibilityBorder}>
      <Grid2 container>
        <Grid2 size={{ xs: 12 }} className={classes.displayFlex}>
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
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Collapse
            in={assuranceExpanded}
            className={classes.assistantBackground}
          >
            <Box mt={3} ml={2}>
              {positiveSourCred ? (
                <div>
                  <Chip
                    label={keyword("fact_checker")}
                    color={trafficLightColors.positive}
                  />
                  <SourceCredibilityResult
                    scResultFiltered={positiveSourCred}
                    icon={CheckCircleOutlineIcon}
                    iconColor={trafficLightColors.positive}
                    sourceType={sourceTypes.positive}
                  />
                </div>
              ) : null}

              {cautionSourceCred ? (
                <div>
                  <Chip
                    label={keyword("warning_title")}
                    color={trafficLightColors.caution}
                  />
                  <SourceCredibilityResult
                    scResultFiltered={cautionSourceCred}
                    icon={ErrorOutlineOutlinedIcon}
                    iconColor={trafficLightColors.caution}
                    sourceType={sourceTypes.caution}
                  />
                </div>
              ) : null}

              {mixedSourceCred ? (
                <div>
                  <Chip
                    label={keyword("mentions")}
                    color={trafficLightColors.mixed}
                  />
                  <SourceCredibilityResult
                    scResultFiltered={mixedSourceCred}
                    icon={SentimentSatisfied}
                    iconColor={trafficLightColors.mixed}
                    sourceType={sourceTypes.mixed}
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
        </Grid2>
      </Grid2>
    </Card>
  );
};
export default AssistantSCResults;
