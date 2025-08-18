import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ResultDisplayItem from "@/components/NavItems/tools/SemanticSearch/components/ResultDisplayItem";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import { getLanguageName } from "@/components/Shared/Utils/languageUtils";
import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { TextFooterPrevFactChecks } from "../AssistantScrapeResults/TextFooter";

const PreviousFactCheckResults = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // display states
  const [expanded, setExpanded] = useState(true);

  // previous fact checks
  const prevFactChecksTitle = keyword("previous_fact_checks_title");
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );
  const prevFactChecksDone = useSelector(
    (state) => state.assistant.prevFactChecksDone,
  );

  // date information
  dayjs.extend(LocaleData);
  dayjs.extend(localizedFormat);
  const globalLocaleData = dayjs.localeData();
  // for navigating to Semantic Search with text
  const navigate = useNavigate();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container spacing={1} wrap="wrap" width="100%">
          <Grid size={4} align="start">
            <Typography display="inline" sx={{ align: "start" }}>
              {prevFactChecksTitle}
            </Typography>
          </Grid>

          <Grid size={8} align="start">
            {prevFactChecksDone && prevFactChecksResult.length > 0 && (
              <Typography sx={{ color: "text.secondary", align: "start" }}>
                {keyword("previous_fact_checks_found")}
              </Typography>
            )}
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        {prevFactChecksDone && prevFactChecksResult.length > 0 && (
          <div>
            <Collapse in={expanded}>
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
                      dayjs(date).format(
                        globalLocaleData.longDateFormat("LL"),
                      ) ?? null
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
            </Collapse>

            <TextFooterPrevFactChecks
              navigate={navigate}
              keyword={keyword}
              setExpanded={setExpanded}
              expanded={expanded}
            />
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default PreviousFactCheckResults;
