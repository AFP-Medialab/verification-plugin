import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import {
  renderDomainAnalysisResults,
  renderSourceTypeChip,
} from "@/components/NavItems/Assistant/AssistantCheckResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { setDomainAnalysisExpanded } from "@/redux/actions/tools/assistantActions";

import {
  TransHtmlDoubleLineBreak,
  TransSourceCredibilityTooltip,
  TransUrlDomainAnalysisLink,
  TransUsfdAuthor,
} from "../TransComponents";

const AssistantSCResults = () => {
  // central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const dispatch = useDispatch();
  const classes = useMyStyles();

  // state
  const domainAnalysisExpanded = useSelector(
    (state) => state.assistant.domainAnalysisExpanded,
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
  const trafficLightColors = useSelector(
    (state) => state.assistant.trafficLightColors,
  );
  const sourceTypes = useSelector((state) => state.assistant.sourceTypes);

  return (
    <Card variant={"outlined"} className={classes.sourceCredibilityBorder}>
      <Grid container>
        <Grid size={{ xs: 11 }} className={classes.displayFlex}>
          {/* icon */}
          <CardMedia>
            <FindInPageIcon
              fontSize={"large"}
              color={"primary"}
              sx={{ m: 1 }}
            />
          </CardMedia>

          {/* title */}
          <Typography
            component={"span"}
            variant={"h6"}
            sx={{
              mt: 1.5,
              pl: 1,
            }}
          >
            {keyword("url_domain_analysis")}
          </Typography>

          {/* expand button */}
          <IconButton
            className={classes.assistantIconRight}
            onClick={() =>
              dispatch(setDomainAnalysisExpanded(!domainAnalysisExpanded))
            }
            sx={{ p: 1 }}
          >
            <ExpandMoreIcon color={"primary"} />
          </IconButton>
        </Grid>

        <Grid size={{ xs: 1 }}>
          {/* help tooltip */}
          <Tooltip
            interactive={"true"}
            leaveDelay={50}
            sx={{ display: "flex", ml: "auto", textAlign: "right", mt: 1.5 }}
            title={
              <>
                <TransSourceCredibilityTooltip keyword={keyword} />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransUsfdAuthor keyword={keyword} />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransUrlDomainAnalysisLink keyword={keyword} />
              </>
            }
            classes={{ tooltip: classes.assistantTooltip }}
          >
            <HelpOutlineOutlinedIcon color={"action"} />
          </Tooltip>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Collapse
            in={domainAnalysisExpanded}
            className={classes.assistantBackground}
          >
            <Box mt={3} ml={2}>
              {/* Caution/Warning */}
              {positiveSourceCred?.length > 0 ? (
                <>
                  {renderSourceTypeChip(
                    keyword,
                    trafficLightColors.positive,
                    sourceTypes.positive,
                  )}
                  {renderDomainAnalysisResults(
                    keyword,
                    positiveSourceCred,
                    trafficLightColors.positive,
                    sourceTypes.positive,
                  )}
                </>
              ) : null}

              {/* Mixed/Mentions */}
              {cautionSourceCred?.length > 0 ? (
                <>
                  {renderSourceTypeChip(
                    keyword,
                    trafficLightColors.caution,
                    sourceTypes.caution,
                  )}
                  {renderDomainAnalysisResults(
                    keyword,
                    cautionSourceCred,
                    trafficLightColors.caution,
                    sourceTypes.caution,
                  )}
                </>
              ) : null}

              {/* Positive/Fact-checker */}
              {mixedSourceCred?.length > 0 ? (
                <>
                  {renderSourceTypeChip(
                    keyword,
                    trafficLightColors.mixed,
                    sourceTypes.mixed,
                  )}
                  {renderDomainAnalysisResults(
                    keyword,
                    mixedSourceCred,
                    trafficLightColors.mixed,
                    sourceTypes.mixed,
                  )}
                </>
              ) : null}
            </Box>
          </Collapse>
        </Grid>
      </Grid>
    </Card>
  );
};
export default AssistantSCResults;
