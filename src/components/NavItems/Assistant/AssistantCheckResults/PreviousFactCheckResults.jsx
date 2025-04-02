import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Collapse from "@mui/material/Collapse";
import Grid2 from "@mui/material/Grid2";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import styled from "@emotion/styled";
import ResultDisplayItem from "components/NavItems/tools/SemanticSearch/components/ResultDisplayItem";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { getLanguageName } from "components/Shared/Utils/languageUtils";
import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { TextFooterPrevFactChecks } from "../AssistantScrapeResults/TextFooter";

const PreviousFactCheckResults = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  //style disabled accordion
  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    ".Mui-disabled": {
      opacity: "1 !important",
      background: "var(--mui-palette-background-paper)",
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

  // date information
  dayjs.extend(LocaleData);
  dayjs.extend(localizedFormat);
  const globalLocaleData = dayjs.localeData();
  // for navigating to Semantic Search with text
  const navigate = useNavigate();

  return (
    <StyledAccordion disabled={prevFactChecksLoading || prevFactChecksFail}>
      <AccordionSummary
        expandIcon={
          prevFactChecksDone && prevFactChecksResult.length > 0 ? (
            <ExpandMoreIcon />
          ) : null
        }
      >
        <Grid2 container spacing={1} wrap="wrap" width="100%">
          <Grid2 size={4} align="start">
            <Typography display="inline" sx={{ flexShrink: 0, align: "start" }}>
              {prevFactChecksTitle}
            </Typography>
          </Grid2>

          <Grid2 size={8} align="start">
            {prevFactChecksLoading && (
              <Skeleton variant="rounded" width="50%" height={40} />
            )}
            {prevFactChecksFail && (
              <Typography sx={{ color: "text.secondary", align: "start" }}>
                {keyword("failed_to_load")}
              </Typography>
            )}
            {prevFactChecksDone && prevFactChecksResult.length > 0 && (
              <Typography sx={{ color: "text.secondary", align: "start" }}>
                {keyword("previous_fact_checks_found")}
              </Typography>
            )}
            {prevFactChecksDone && prevFactChecksResult.length < 1 && (
              <Typography sx={{ color: "text.secondary", align: "start" }}>
                {keyword("none_detected")}
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </AccordionSummary>

      <AccordionDetails>
        {prevFactChecksDone && prevFactChecksResult.length > 0 && (
          <div>
            {prevFactChecksResult.map((resultItem) => {
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
                    dayjs(date).format(globalLocaleData.longDateFormat("LL")) ??
                    null
                  }
                  website={resultItem.website}
                  language={getLanguageName(resultItem.source_language)}
                  similarityScore={resultItem.score}
                  articleUrl={resultItem.url}
                  domainUrl={resultItem.source_name}
                  imageUrl={resultItem.image_url}
                />
              );
            })}

            <TextFooterPrevFactChecks navigate={navigate} keyword={keyword} />
          </div>
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default PreviousFactCheckResults;
