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
} from "@/components/NavItems/Assistant/utils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { setDomainAnalysisExpanded } from "@/redux/actions/tools/assistantActions";

import {
  TransHtmlDoubleLineBreak,
  TransUrlDomainAnalysisLink,
  TransUrlDomainAnalysisTooltip,
  TransUsfdAuthor,
} from "../components";

const AssistantUrlDomainAnalysisResult = () => {
  // central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const dispatch = useDispatch();
  const classes = useMyStyles();

  // state
  const domainAnalysisExpanded = useSelector(
    (state) => state.assistant.domainAnalysisExpanded,
  );
  const positiveUrlDomainAnalysis = useSelector(
    (state) => state.assistant.positiveUrlDomainAnalysis,
  );
  const cautionUrlDomainAnalysis = useSelector(
    (state) => state.assistant.cautionUrlDomainAnalysis,
  );
  const mixedUrlDomainAnalysis = useSelector(
    (state) => state.assistant.mixedUrlDomainAnalysis,
  );
  const trafficLightColors = useSelector(
    (state) => state.assistant.trafficLightColors,
  );
  const sourceTypes = useSelector((state) => state.assistant.sourceTypes);

  return (
    <Card
      variant={"outlined"}
      className={classes.urlDomainAnalysisBorder}
      height="400"
    >
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

        <Grid
          size={{ xs: 1 }}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          {/* help tooltip */}
          <Tooltip
            interactive={"true"}
            leaveDelay={50}
            style={{ display: "flex", marginLeft: "auto" }}
            title={
              <>
                <TransUrlDomainAnalysisTooltip keyword={keyword} />
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
            <Box
              sx={{
                width: "100%",
                mt: 3,
                ml: 2,
                textAlign: "center",
              }}
            >
              {/* Caution/Warning */}
              {positiveUrlDomainAnalysis?.length > 0 ? (
                <>
                  {renderSourceTypeChip(
                    keyword,
                    trafficLightColors.positive,
                    sourceTypes.positive,
                  )}
                  {renderDomainAnalysisResults(
                    keyword,
                    positiveUrlDomainAnalysis,
                    trafficLightColors.positive,
                    sourceTypes.positive,
                  )}
                </>
              ) : null}

              {/* Mixed/Mentions */}
              {cautionUrlDomainAnalysis?.length > 0 ? (
                <>
                  {renderSourceTypeChip(
                    keyword,
                    trafficLightColors.caution,
                    sourceTypes.caution,
                  )}
                  {renderDomainAnalysisResults(
                    keyword,
                    cautionUrlDomainAnalysis,
                    trafficLightColors.caution,
                    sourceTypes.caution,
                  )}
                </>
              ) : null}

              {/* Positive/Fact-checker */}
              {mixedUrlDomainAnalysis?.length > 0 ? (
                <>
                  {renderSourceTypeChip(
                    keyword,
                    trafficLightColors.mixed,
                    sourceTypes.mixed,
                  )}
                  {renderDomainAnalysisResults(
                    keyword,
                    mixedUrlDomainAnalysis,
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
export default AssistantUrlDomainAnalysisResult;
