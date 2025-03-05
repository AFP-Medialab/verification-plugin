import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Grid2 from "@mui/material/Grid2";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Remove from "@mui/icons-material/Remove";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { ROLES } from "../../../../constants/roles.jsx";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";
import {
  TransCredibilitySignalsLink,
  TransHtmlDoubleLinkBreak,
  TransHtmlSingleLinkBreak,
} from "../TransComponents";
import ResultDisplayItem from "./../../tools/SemanticSearch/components/ResultDisplayItem.jsx";
import TextFooterPrevFactChecks from "./TextFooter.jsx";

const getExpandIcon = (
  loading,
  fail,
  doneWithEmptyResult = null,
  role = null,
) => {
  if (
    loading ||
    fail ||
    doneWithEmptyResult ||
    (role && !role.includes(ROLES.BETA_TESTER))
  ) {
    // "doneWithEmptyResult" is for when prevFactChecksDone = true and result.length < 1
    return <Remove />;
  } else {
    return <ExpandMoreIcon />;
  }
};

const AssistantCredSignals = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
  const expandMinimiseText = keyword("expand_minimise_text");

  // displaying expanded text in AccordionDetails
  const [displayExpander, setDisplayExpander] = useState(true);
  const [expanded, setExpanded] = useState(true);

  // one accordion open at once
  const [expandedAccordion, setExpandedAccordion] = React.useState("false");
  const handleChange = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
  };

  //style disabled accordion
  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    ".Mui-disabled": {
      opacity: "1 !important",
      background: "white",
    },
  }));

  // previous fact checks
  const prevFactChecksTitle = keyword("previous_fact_checks_title");
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );
  const prevFactChecksLoading = useSelector(
    (state) => state.assistant.prevFactChecksLoading,
  );
  const prevFactChecksDone = useSelector(
    (state) => state.assistant.prevFactChecksDone,
  );
  const prevFactChecksFail = useSelector(
    (state) => state.assistant.prevFactChecksFail,
  );

  // checking if user logged in
  const role = useSelector((state) => state.userSession.user.roles);

  // date information
  dayjs.extend(LocaleData);
  dayjs.extend(localizedFormat);
  const globalLocaleData = dayjs.localeData();
  // for navigating to Semantic Search with text
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        className={classes.assistantCardHeader}
        // title
        title={
          <Typography variant={"h5"}>
            {keyword("credibility_signals")}
          </Typography>
        }
        action={
          // tooltip
          <Tooltip
            interactive={"true"}
            title={
              <>
                <Trans
                  t={keyword}
                  i18nKey="credibility_signals_tooltip"
                  components={{
                    b: <b />,
                  }}
                />
                <TransHtmlDoubleLinkBreak keyword={keyword} />
                <TransCredibilitySignalsLink keyword={keyword} />
                <TransHtmlDoubleLinkBreak keyword={keyword} />
                <Trans
                  t={keyword}
                  i18nKey="previous_fact_checks_title_bold"
                  components={{
                    b: <b />,
                  }}
                />
                <TransHtmlSingleLinkBreak keyword={keyword} />
                <Trans t={keyword} i18nKey="previous_fact_checks_tooltip" />
                <TransHtmlDoubleLinkBreak keyword={keyword} />
                <Trans
                  t={keyword}
                  i18nKey="machine_generated_text_title_bold"
                  components={{
                    b: <b />,
                  }}
                />
                <TransHtmlSingleLinkBreak keyword={keyword} />
                <Trans t={keyword} i18nKey="machine_generated_text_tooltip" />
              </>
            }
            classes={{ tooltip: classes.assistantTooltip }}
          >
            <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
          </Tooltip>
        }
      />

      <CardContent
        style={{
          wordBreak: "break-word",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Previous fact-checks */}
        <StyledAccordion
          expanded={expandedAccordion === prevFactChecksTitle}
          onChange={handleChange(prevFactChecksTitle)}
          disabled={
            prevFactChecksLoading ||
            prevFactChecksFail ||
            (!prevFactChecksLoading &&
              !prevFactChecksFail &&
              !prevFactChecksDone) ||
            !role.includes(ROLES.BETA_TESTER) ||
            (prevFactChecksDone && prevFactChecksResult.length < 1)
          }
          //disableGutters
        >
          <AccordionSummary
            expandIcon={getExpandIcon(
              prevFactChecksLoading,
              prevFactChecksFail,
              prevFactChecksDone && prevFactChecksResult.length < 1,
              role,
            )}
          >
            <Grid2 container spacing={1} wrap="wrap" width="100%">
              <Grid2 size={{ xs: 4 }} align="start">
                <Typography
                  display="inline"
                  sx={{ flexShrink: 0, align: "start" }}
                >
                  {prevFactChecksTitle}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 8 }} align="start">
                {role.includes(ROLES.BETA_TESTER) && prevFactChecksLoading && (
                  <Skeleton variant="rounded" width="50%" height={40} />
                )}
                {role.includes(ROLES.BETA_TESTER) && prevFactChecksFail && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("failed_to_load")}
                  </Typography>
                )}
                {role.includes(ROLES.BETA_TESTER) &&
                  prevFactChecksDone &&
                  prevFactChecksResult.length > 0 && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("previous_fact_checks_found")}
                    </Typography>
                  )}
                {role.includes(ROLES.BETA_TESTER) &&
                  !prevFactChecksDone &&
                  !prevFactChecksLoading &&
                  !prevFactChecksFail &&
                  !prevFactChecksResult && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("reanalyse_url")}
                      {/* should now be obselete as saga is re run */}
                    </Typography>
                  )}
                {!role.includes(ROLES.BETA_TESTER) && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("login_required")}
                  </Typography>
                )}
                {role.includes(ROLES.BETA_TESTER) &&
                  prevFactChecksDone &&
                  prevFactChecksResult.length < 1 && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("none_detected")}
                    </Typography>
                  )}
              </Grid2>
            </Grid2>
          </AccordionSummary>

          <AccordionDetails>
            {prevFactChecksDone &&
              prevFactChecksResult.length > 0 &&
              role.includes(ROLES.BETA_TESTER) && (
                <div>
                  <Collapse
                    in={expanded}
                    collapsedSize={150}
                    id={"element-to-check4"}
                  >
                    {prevFactChecksResult
                      ? prevFactChecksResult.map((resultItem) => {
                          // date in correct format
                          const date = resultItem.published_at.slice(0, 10);

                          return (
                            <ResultDisplayItem
                              key={resultItem.id}
                              id={resultItem.id}
                              claim={resultItem.claim_en}
                              title={resultItem.title_en}
                              claimOriginalLanguage={resultItem.claim}
                              titleOriginalLanguage={resultItem.title}
                              rating={resultItem.rating}
                              date={
                                dayjs(date).format(
                                  globalLocaleData.longDateFormat("LL"),
                                ) ?? null
                              }
                              website={resultItem.website}
                              language={getLanguageName(
                                resultItem.source_language,
                              )}
                              similarityScore={resultItem.score}
                              articleUrl={resultItem.url}
                              domainUrl={resultItem.source_name}
                              imageUrl={resultItem.image_url}
                            />
                          );
                        })
                      : null}
                  </Collapse>
                  <TextFooterPrevFactChecks
                    classes={classes}
                    expandMinimiseText={expandMinimiseText}
                    displayExpander={displayExpander}
                    setExpanded={setExpanded}
                    expanded={expanded}
                    navigate={navigate}
                    keyword={keyword}
                  />
                </div>
              )}
          </AccordionDetails>
        </StyledAccordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCredSignals;
