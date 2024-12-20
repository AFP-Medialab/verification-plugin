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
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { renderAccordion } from "../AssistantCheckResults/assistantUtils";

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
      <Grid2 container>
        <Grid2 size={{ xs: 11 }} className={classes.displayFlex}>
          {/* icon */}
          <CardMedia>
            <Box m={1}>
              <FindInPageIcon fontSize={"large"} color={"primary"} />
            </Box>
          </CardMedia>

          {/* spacing */}
          <Box m={1} />

          {/* title */}
          <Box mt={1.5}>
            <Typography component={"span"} variant={"h6"}>
              {keyword("url_domain_analysis")}
            </Typography>
          </Box>

          {/* expand button */}
          <IconButton
            className={classes.assistantIconRight}
            onClick={() => dispatch(setAssuranceExpanded(!assuranceExpanded))}
          >
            <ExpandMoreIcon color={"primary"} />
          </IconButton>
        </Grid2>

        <Grid2 size={{ xs: 1 }}>
          {/* help tooltip */}
          <Box mt={1.5} align="right">
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
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
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
        </Grid2>
      </Grid2>
    </Card>
  );
};
export default AssistantSCResults;
