import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
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
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
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
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    scrollToElement(targetId, 100);
  };

  return (
    <Tooltip title={keyword(label)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 80,
        }}
      >
        <IconButton onClick={handleClick} color="primary">
          <Icon fontSize="large" />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {value}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const AssistantSummary = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
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

  // links state
  const linkList = useSelector((state) => state.assistant.linkList);

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

  // placeholder values - will be replaced with actual counts later
  const warningsCount = "x";
  const domainAnalysisCount = "x";
  const mediaCount = "x";
  const commentsCount = "x";
  const textCount = "x";
  const namedEntityCount = "x";
  const linksCount = "x";

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
    <Card variant="outlined">
      <CardHeader
        className={classes.assistantCardHeader}
        title={<Typography>{keyword("results_summary")}</Typography>}
      />
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {hasWarnings && (
            <SummaryIcon
              icon={WarningAmberIcon}
              label="warnings_title"
              value={warningsCount}
              targetId="warnings"
              keyword={keyword}
              onClick={() => dispatch(setWarningExpanded(true))}
            />
          )}
          {hasDomainAnalysis && (
            <SummaryIcon
              icon={FindInPageIcon}
              label="url_domain_analysis"
              value={domainAnalysisCount}
              targetId="url-domain-analysis"
              keyword={keyword}
              onClick={() => dispatch(setAssuranceExpanded(true))}
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
          {hasNamedEntity && (
            <SummaryIcon
              icon={LabelIcon}
              label="named_entity_title"
              value={namedEntityCount}
              targetId="named-entity-results"
              keyword={keyword}
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
      </CardContent>
    </Card>
  );
};
export default AssistantSummary;
