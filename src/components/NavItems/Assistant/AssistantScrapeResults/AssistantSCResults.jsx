import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SentimentSatisfied from "@mui/icons-material/SentimentSatisfied";

import { setAssuranceExpanded } from "@/redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import SourceCredibilityResult from "../AssistantCheckResults/SourceCredibilityResult";
import { renderAccordion } from "../AssistantCheckResults/assistantUtils";
import {
  TransHtmlDoubleLineBreak,
  TransSourceCredibilityTooltip,
  TransUrlDomainAnalysisLink,
} from "../TransComponents";

const AssistantSCResults = () => {
  // central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const dispatch = useDispatch();
  const classes = useMyStyles();

  // state
  const assuranceExpanded = useSelector(
    (state) => state.assistant.assuranceExpanded,
  );
  const positiveSourceCred = useSelector(
    (state) => state.assistant.positiveSourceCred,
  );
  const cautionSourceCred = useSelector(
    (state) => state.assistant.cautionSourceCred,
  );
  const mixedSourceCred = useSelector(
    (state) => state.assistant.mixedSourceCred,
  );
  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const trafficLightColors = useSelector(
    (state) => state.assistant.trafficLightColors,
  );
  const sourceTypes = useSelector((state) => state.assistant.sourceTypes);

  // passing through correct colours for details here
  const sourceCredibility = [
    [cautionSourceCred, trafficLightColors.caution, sourceTypes.caution],
    [mixedSourceCred, trafficLightColors.mixed, sourceTypes.mixed],
    [positiveSourceCred, trafficLightColors.positive, sourceTypes.positive],
  ];

  // find colour for URL
  const urlColor =
    cautionSourceCred.length > 0
      ? trafficLightColors.caution
      : mixedSourceCred.length > 0
        ? trafficLightColors.mixed
        : positiveSourceCred.length > 0
          ? trafficLightColors.positive
          : trafficLightColors.unlabelled;

  return (
    <Card
      variant={"outlined"}
      className={classes.sourceCredibilityBorder}
      height="400"
    >
      <Grid container>
        <Grid size={{ xs: 11 }} className={classes.displayFlex}>
          {/* icon */}
          <CardMedia>
            <Box
              sx={{
                m: 1,
              }}
            >
              <FindInPageIcon fontSize={"large"} color={"primary"} />
            </Box>
          </CardMedia>

          {/* spacing */}
          <Box
            sx={{
              m: 1,
            }}
          />

          {/* title */}
          <Box
            sx={{
              mt: 1.5,
            }}
          >
            <Typography component={"span"} variant={"h6"}>
              {keyword("url_domain_analysis")}
            </Typography>
          </Box>

          {/* expand button */}
          <Box
            sx={{
              pr: 1,
              pt: 1,
            }}
          >
            <IconButton
              className={classes.assistantIconRight}
              onClick={() => dispatch(setAssuranceExpanded(!assuranceExpanded))}
              sx={{ p: 1 }}
            >
              <ExpandMoreIcon color={"primary"} />
            </IconButton>
          </Box>
        </Grid>

        <Grid size={{ xs: 1 }}>
          {/* help tooltip */}
          <Box
            align="right"
            sx={{
              mt: 1.5,
            }}
          >
            <Tooltip
              interactive={"true"}
              leaveDelay={50}
              style={{ display: "flex", marginLeft: "auto" }}
              title={
                <>
                  <TransSourceCredibilityTooltip keyword={keyword} />
                  <TransHtmlDoubleLineBreak keyword={keyword} />
                  <TransUrlDomainAnalysisLink keyword={keyword} />
                </>
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon color={"action"} />
            </Tooltip>
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Collapse
            in={assuranceExpanded}
            className={classes.assistantBackground}
          >
            <Box mt={3} ml={2}>
              {sourceCredibility
                ? renderAccordion(keyword, sourceCredibility, (scroll = true))
                : null}
            </Box>
          </Collapse>
        </Grid>
      </Grid>
    </Card>
  );
};
export default AssistantSCResults;
