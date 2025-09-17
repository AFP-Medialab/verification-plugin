import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import ResultDisplayItem from "components/NavItems/tools/SemanticSearch/components/ResultDisplayItem";
import { getLanguageName } from "components/Shared/Utils/languageUtils";
import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

const PreviousFactCheckResults = ({ results }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // previous fact checks
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

  const handleClick = (path) => {
    // instead need to set parameter then load text in SemanticSearch/index.jsx
    navigate("/app/" + path + "/assistantText");
  };

  return (
    <>
      {prevFactChecksDone && prevFactChecksResult.length > 0 && (
        <>
          {results.map((resultItem) => {
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
                website={resultItem.website ?? resultItem.source_name}
                language={getLanguageName(resultItem.source_language)}
                similarityScore={resultItem.score}
                articleUrl={resultItem.url}
                domainUrl={resultItem.source_name}
                imageUrl={resultItem.image_url}
                factCheckServices={resultItem.factCheckServices}
              />
            );
          })}
        </>
      )}

      {/* footer */}
      <Typography
        color={"textSecondary"}
        fontSize="small"
        sx={{
          align: "center",
          mt: 2,
        }}
      >
        {keyword("For more details see the ")}{" "}
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick("tools/semanticSearch")}
        >
          {keyword("semantic_search_title")}
        </Link>{" "}
        {keyword("(FCSS) tool")}
      </Typography>
    </>
  );
};

export default PreviousFactCheckResults;
