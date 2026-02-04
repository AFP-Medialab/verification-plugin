import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import LabelIcon from "@mui/icons-material/Label";
import LinkIcon from "@mui/icons-material/Link";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { scrollToElement } from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import {
  setAssuranceExpanded,
  setWarningExpanded,
} from "@/redux/actions/tools/assistantActions";

const SummaryIcon = ({
  icon: Icon,
  label,
  value,
  targetId,
  keyword,
  onClick,
  loading,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    scrollToElement(targetId, 100);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <Tooltip title={keyword(label)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            p: 1,
          }}
        >
          <IconButton onClick={handleClick} color="primary" sx={{ gap: 1 }}>
            <Icon fontSize="large" />
            <Box
              sx={{
                minWidth: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="h6" color="primary">
                  {value}
                </Typography>
              )}
            </Box>
          </IconButton>
        </Box>
      </Tooltip>
    </Card>
  );
};

const AssistantSummary = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const dispatch = useDispatch();

  // warnings state
  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const dbkfImageMatch = useSelector((state) => state.assistant.dbkfImageMatch);
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );

  // source credibility state
  const positiveSourceCred = useSelector(
    (state) => state.assistant.positiveSourceCred,
  );
  const cautionSourceCred = useSelector(
    (state) => state.assistant.cautionSourceCred,
  );
  const mixedSourceCred = useSelector(
    (state) => state.assistant.mixedSourceCred,
  );

  // media state
  const imageList = useSelector((state) => state.assistant.imageList);
  const videoList = useSelector((state) => state.assistant.videoList);

  // comments state
  const collectedComments = useSelector(
    (state) => state.assistant.collectedComments,
  );

  // text state
  const text = useSelector((state) => state.assistant.urlText);

  // named entity state
  const neResult = useSelector((state) => state.assistant.neResultCategory);
  const neResultCount = useSelector((state) => state.assistant.neResultCount);

  // links state
  const linkList = useSelector((state) => state.assistant.linkList);

  // loading states
  const inputSCLoading = useSelector((state) => state.assistant.inputSCLoading);
  const dbkfTextMatchLoading = useSelector(
    (state) => state.assistant.dbkfTextMatchLoading,
  );
  const dbkfMediaMatchLoading = useSelector(
    (state) => state.assistant.dbkfMediaMatchLoading,
  );
  const neLoading = useSelector((state) => state.assistant.neLoading);
  const prevFactChecksLoading = useSelector(
    (state) => state.assistant.prevFactChecksLoading,
  );

  // determine which sections have results
  const hasWarnings =
    dbkfTextMatch || dbkfImageMatch || dbkfVideoMatch || prevFactChecksResult;
  const hasDomainAnalysis =
    positiveSourceCred || cautionSourceCred || mixedSourceCred;
  const hasMedia = imageList?.length > 0 || videoList?.length > 0;
  const hasComments = collectedComments?.length > 0;
  const hasText = !!text;
  const hasNamedEntity = text && neResult;
  const hasLinks = text && linkList?.length > 0;

  // calculate counts for each section
  const warningsCount =
    (dbkfTextMatch?.length || 0) +
    (dbkfImageMatch ? 1 : 0) +
    (dbkfVideoMatch ? 1 : 0) +
    (prevFactChecksResult?.length || 0);
  const domainAnalysisCount =
    (positiveSourceCred?.length || 0) +
    (cautionSourceCred?.length || 0) +
    (mixedSourceCred?.length || 0);
  const imageCount = imageList?.length || 0;
  const videoCount = videoList?.length || 0;
  const mediaCount = imageCount + videoCount;
  const commentsCount = collectedComments?.length || 0;
  const textCount = "✓";
  const namedEntityCount = neResultCount?.length || 0;
  const linksCount = linkList?.length || 0;

  // check if any results exist
  const hasAnyResults =
    hasWarnings ||
    hasDomainAnalysis ||
    hasMedia ||
    hasComments ||
    hasText ||
    hasNamedEntity ||
    hasLinks;

  if (!hasAnyResults) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {(hasWarnings ||
        dbkfTextMatchLoading ||
        dbkfMediaMatchLoading ||
        prevFactChecksLoading) && (
        <SummaryIcon
          icon={WarningAmberIcon}
          label="warnings_title"
          value={warningsCount}
          targetId="warnings"
          keyword={keyword}
          onClick={() => dispatch(setWarningExpanded(true))}
          loading={
            dbkfTextMatchLoading ||
            dbkfMediaMatchLoading ||
            prevFactChecksLoading
          }
        />
      )}
      {(hasDomainAnalysis || inputSCLoading) && (
        <SummaryIcon
          icon={FindInPageIcon}
          label="url_domain_analysis"
          value={domainAnalysisCount}
          targetId="url-domain-analysis"
          keyword={keyword}
          onClick={() => dispatch(setAssuranceExpanded(true))}
          loading={inputSCLoading}
        />
      )}
      {hasMedia && (
        <SummaryIcon
          icon={PermMediaIcon}
          label="media_title"
          value={mediaCount}
          targetId="url-media-results"
          keyword={keyword}
        />
      )}
      {hasComments && (
        <SummaryIcon
          icon={CommentIcon}
          label="collected_comments_title"
          value={commentsCount}
          targetId="assistant-collected-comments"
          keyword={keyword}
        />
      )}
      {hasText && (
        <SummaryIcon
          icon={ArticleIcon}
          label="text_title"
          value={textCount}
          targetId="credibility-signals"
          keyword={keyword}
        />
      )}
      {(hasNamedEntity || neLoading) && (
        <SummaryIcon
          icon={LabelIcon}
          label="named_entity_title"
          value={namedEntityCount}
          targetId="named-entity-results"
          keyword={keyword}
          loading={neLoading}
        />
      )}
      {hasLinks && (
        <SummaryIcon
          icon={LinkIcon}
          label="extracted_urls_url_domain_analysis"
          value={linksCount}
          targetId="extracted-urls"
          keyword={keyword}
        />
      )}
    </Stack>
  );
};
export default AssistantSummary;
