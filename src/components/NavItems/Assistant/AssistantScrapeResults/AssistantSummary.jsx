import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import ImageIcon from "@/components/NavBar/images/SVG/Image/Images.svg";
import VideoIcon from "@/components/NavBar/images/SVG/Video/Video.svg";
import { scrollToElement } from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import {
  TransSummaryCommentsTooltip,
  TransSummaryDomainTooltip,
  TransSummaryFactChecksTooltip,
  TransSummaryImagesTooltip,
  TransSummaryLinksTooltip,
  TransSummaryMgtTooltip,
  TransSummaryNamedEntitiesTooltip,
  TransSummaryPersuasionTooltip,
  TransSummaryVideosTooltip,
} from "@/components/NavItems/Assistant/TransComponents";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { ROLES } from "@/constants/roles";
import {
  setAssuranceExpanded,
  setImageResultsExpanded,
  setTextTabIndex,
  setVideoResultsExpanded,
  setWarningExpanded,
} from "@/redux/actions/tools/assistantActions";

import { TransHtmlDoubleLineBreak } from "../TransComponents";

const SummaryIcon = ({
  icon: Icon,
  svgIcon,
  label,
  description,
  descriptionNode,
  color,
  value,
  targetId,
  keyword,
  onClick,
  loading,
  disabled: disabledProp,
}) => {
  const disabled = disabledProp || loading || value === 0 || value === false;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    scrollToElement(targetId, 100);
  };

  const displayColor = disabled ? "disabled" : color || "info";

  const tooltipDescription =
    descriptionNode ?? (description ? keyword(description) : null);

  return (
    <Tooltip
      title={
        tooltipDescription ? (
          <>
            {keyword(label)}
            <TransHtmlDoubleLineBreak keyword={keyword} />
            {tooltipDescription}
          </>
        ) : (
          keyword(label)
        )
      }
    >
      <span>
        <ButtonBase
          onClick={handleClick}
          disabled={disabled}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1,
            borderRadius: 1,
            bgcolor: "background.paper",
            boxShadow: 1,
            transition: "all 0.2s ease-in-out",
            opacity: disabled ? 0.5 : 1,
            "&:hover": {
              bgcolor: "action.hover",
              boxShadow: 3,
            },
            "&:active": {
              bgcolor: "action.selected",
            },
          }}
        >
          {svgIcon ? (
            <SvgIcon
              component={svgIcon}
              fontSize="large"
              color={displayColor}
              inheritViewBox
            />
          ) : (
            <Icon fontSize="large" color={displayColor} />
          )}
          <Box
            sx={{
              minWidth: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="info" />
            ) : (
              <Typography variant="h6" color={displayColor}>
                {value}
              </Typography>
            )}
          </Box>
        </ButtonBase>
      </span>
    </Tooltip>
  );
};

const AssistantSummary = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
  const dispatch = useDispatch();

  const role = useSelector((state) => state.userSession.user.roles);
  const isBetaTester = role.includes(ROLES.BETA_TESTER);

  // warnings state
  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);
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
  const multilingualStanceResult = useSelector(
    (state) => state.assistant.multilingualStanceResult,
  );
  const multilingualStanceLoading = useSelector(
    (state) => state.assistant.multilingualStanceLoading,
  );

  // named entity state
  const neResultCount = useSelector((state) => state.assistant.neResultCount);

  // links state
  const linkList = useSelector((state) => state.assistant.linkList);
  const extractedSourceCred = useSelector(
    (state) => state.assistant.extractedSourceCred,
  );

  // persuasion state
  const persuasionResult = useSelector(
    (state) => state.assistant.persuasionResult,
  );
  const persuasionLoading = useSelector(
    (state) => state.assistant.persuasionLoading,
  );

  // machine generated text state
  const machineGeneratedTextChunksResult = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksResult,
  );
  const machineGeneratedTextChunksLoading = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksLoading,
  );

  // loading states
  const inputSCLoading = useSelector((state) => state.assistant.inputSCLoading);
  const dbkfTextMatchLoading = useSelector(
    (state) => state.assistant.dbkfTextMatchLoading,
  );
  const neLoading = useSelector((state) => state.assistant.neLoading);
  const prevFactChecksLoading = useSelector(
    (state) => state.assistant.prevFactChecksLoading,
  );

  // calculate counts for each section
  const warningsCount =
    (dbkfTextMatch?.length || 0) +
    (isBetaTester ? prevFactChecksResult?.length || 0 : 0);
  const domainAnalysisCount =
    (positiveSourceCred?.length || 0) +
    (cautionSourceCred?.length || 0) +
    (mixedSourceCred?.length || 0);
  const imageCount = imageList?.length || 0;
  const videoCount = videoList?.length || 0;
  const commentsCount = collectedComments?.length || 0;
  const denyCommentsCount = multilingualStanceResult
    ? (collectedComments || []).filter(
        (c) => multilingualStanceResult[c.id]?.stance === "deny",
      ).length
    : 0;
  const queryCommentsCount = multilingualStanceResult
    ? (collectedComments || []).filter(
        (c) => multilingualStanceResult[c.id]?.stance === "query",
      ).length
    : 0;
  const supportCommentsCount = multilingualStanceResult
    ? (collectedComments || []).filter(
        (c) => multilingualStanceResult[c.id]?.stance === "support",
      ).length
    : 0;
  const commentCommentsCount = multilingualStanceResult
    ? (collectedComments || []).filter(
        (c) => multilingualStanceResult[c.id]?.stance === "comment",
      ).length
    : 0;
  const namedEntityCount = neResultCount?.length || 0;
  const linksCount = linkList?.length || 0;
  const credDomains = extractedSourceCred?.domain
    ? Object.values(extractedSourceCred.domain)
    : [];
  const warningLinksCount = new Set(
    credDomains.filter((d) => d.caution).flatMap((d) => d.url || []),
  ).size;
  const mentionsLinksCount = new Set(
    credDomains.filter((d) => d.mixed).flatMap((d) => d.url || []),
  ).size;
  const cautionOrMixedLinksCount = new Set(
    credDomains.filter((d) => d.caution || d.mixed).flatMap((d) => d.url || []),
  ).size;
  const factCheckerLinksCount = new Set(
    credDomains.filter((d) => d.positive).flatMap((d) => d.url || []),
  ).size;
  const unlabelledLinksCount =
    extractedSourceCred?.url?.unlabelled?.length || 0;

  // persuasion count: total spans belonging to warning categories
  // technique keys follow the "Category__Technique" format
  // warningCategories is provided by the backend config; fallback to defaults if absent
  const persuasionWarningCategories = persuasionResult?.configs
    ?.persuasionTechniquesWarningCategories ?? [
    "Red_Herring",
    "Manipulative_Wording",
  ];
  const persuasionCategoryCounts = persuasionWarningCategories.map((cat) => ({
    name: cat,
    count: persuasionResult?.entities
      ? Object.entries(persuasionResult.entities)
          .filter(([label]) => label.split("__")[0] === cat)
          .reduce((total, [, spans]) => total + spans.length, 0)
      : 0,
  }));
  const persuasionCount = persuasionCategoryCounts.reduce(
    (total, { count }) => total + count,
    0,
  );
  const persuasionOtherCount = persuasionResult?.entities
    ? new Set(
        Object.keys(persuasionResult.entities)
          .filter(
            (label) =>
              !persuasionWarningCategories.includes(label.split("__")[0]),
          )
          .map((label) => label.split("__")[0]),
      ).size
    : 0;

  // MGT arc thresholds derived from backend configs (fallback matches default in AssistantTextClassification.jsx)
  const mgtArcsLength = machineGeneratedTextChunksResult?.configs
    ?.arcsLength ?? [0.05, 0.45, 0.45, 0.05];
  const MGT_WARNING_THRESHOLD = mgtArcsLength[0] + mgtArcsLength[1];
  const MGT_ERROR_THRESHOLD =
    mgtArcsLength[0] + mgtArcsLength[1] + mgtArcsLength[2];

  // MGT overall score (0 = human, 1 = machine); null when no result yet
  const mgtScore =
    machineGeneratedTextChunksResult?.entities?.mgt_overall_score?.[0]?.score ??
    null;
  const mgtScoreValue =
    mgtScore != null ? `${Math.round(mgtScore * 100)}%` : "0%";

  return (
    <Card variant="outlined">
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("summary_title")}
        avatar={<AssessmentOutlinedIcon color="primary" />}
      />
      <CardContent>
        <Stack
          direction="row"
          gap={3}
          alignItems="flex-start"
          justifyContent="center"
          flexWrap="wrap"
        >
          {/* url domain analysis group */}
          <Stack direction="column" gap={0.5}>
            <Typography variant="body2" color="text.primary" textAlign="center">
              {keyword("Domain")}
            </Typography>
            <Stack
              direction="row"
              gap={1}
              justifyContent="center"
              flexWrap="wrap"
            >
              <SummaryIcon
                icon={FindInPageOutlinedIcon}
                label="url_domain_analysis"
                descriptionNode={
                  <TransSummaryDomainTooltip
                    keyword={keyword}
                    cautionCount={cautionSourceCred?.length || 0}
                    mixedCount={mixedSourceCred?.length || 0}
                    positiveCount={positiveSourceCred?.length || 0}
                    loaded={!inputSCLoading}
                  />
                }
                color={
                  cautionSourceCred?.length || mixedSourceCred?.length
                    ? "warning"
                    : undefined
                }
                value={domainAnalysisCount}
                targetId="url-domain-analysis"
                keyword={keyword}
                onClick={() => dispatch(setAssuranceExpanded(true))}
                loading={inputSCLoading}
              />
            </Stack>
          </Stack>

          {/* warnings group */}
          <Stack direction="column" gap={0.5}>
            <Typography variant="body2" color="text.primary" textAlign="center">
              {keyword("Fact-checks")}
            </Typography>
            <Stack
              direction="row"
              gap={1}
              justifyContent="center"
              flexWrap="wrap"
            >
              <SummaryIcon
                icon={WarningAmberOutlinedIcon}
                label="warnings_title"
                descriptionNode={
                  <TransSummaryFactChecksTooltip
                    keyword={keyword}
                    dbkfCount={dbkfTextMatch?.length || 0}
                    fcssCount={prevFactChecksResult?.length || 0}
                    isBetaTester={isBetaTester}
                    loaded={!dbkfTextMatchLoading && !prevFactChecksLoading}
                  />
                }
                color={"warning"}
                value={warningsCount}
                targetId="warnings"
                keyword={keyword}
                onClick={() => dispatch(setWarningExpanded(true))}
                loading={dbkfTextMatchLoading || prevFactChecksLoading}
              />
            </Stack>
          </Stack>

          {/* media group */}
          <Stack direction="column" gap={0.5}>
            <Typography variant="body2" color="text.primary" textAlign="center">
              {keyword("Media")}
            </Typography>
            <Stack
              direction="row"
              gap={1}
              justifyContent="center"
              flexWrap="wrap"
            >
              <SummaryIcon
                svgIcon={ImageIcon}
                label="images_label"
                descriptionNode={
                  <TransSummaryImagesTooltip
                    keyword={keyword}
                    imageCount={imageCount}
                    loaded={true}
                  />
                }
                value={imageCount}
                targetId="assistant-image-results"
                keyword={keyword}
                onClick={() => dispatch(setImageResultsExpanded(true))}
              />
              <SummaryIcon
                svgIcon={VideoIcon}
                label="videos_label"
                descriptionNode={
                  <TransSummaryVideosTooltip
                    keyword={keyword}
                    videoCount={videoCount}
                    loaded={true}
                  />
                }
                value={videoCount}
                targetId="assistant-video-results"
                keyword={keyword}
                onClick={() => dispatch(setVideoResultsExpanded(true))}
              />
            </Stack>
          </Stack>

          {/* text group */}
          <Stack direction="column" gap={0.5}>
            <Typography variant="body2" color="text.primary" textAlign="center">
              {keyword("Text")}
            </Typography>
            <Stack
              direction="row"
              gap={1}
              justifyContent="center"
              flexWrap="wrap"
            >
              <SummaryIcon
                icon={PsychologyOutlinedIcon}
                label="persuasion_techniques_title"
                descriptionNode={
                  <TransSummaryPersuasionTooltip
                    keyword={keyword}
                    categoryCounts={persuasionCategoryCounts}
                    otherCount={persuasionOtherCount}
                    loaded={!persuasionLoading}
                  />
                }
                color="warning"
                value={persuasionCount}
                targetId="credibility-signals"
                keyword={keyword}
                onClick={() => dispatch(setTextTabIndex(3))}
                loading={persuasionLoading}
              />
              <SummaryIcon
                icon={SmartToyOutlinedIcon}
                label="machine_generated_text_title"
                descriptionNode={
                  <TransSummaryMgtTooltip
                    keyword={keyword}
                    mgtScoreValue={mgtScoreValue}
                    mgtCategory={
                      machineGeneratedTextChunksResult?.entities
                        ?.mgt_overall_score?.[0]?.pred
                    }
                    loaded={!machineGeneratedTextChunksLoading}
                  />
                }
                color={
                  mgtScore != null && mgtScore >= MGT_ERROR_THRESHOLD
                    ? "error"
                    : mgtScore != null && mgtScore >= MGT_WARNING_THRESHOLD
                      ? "warning"
                      : undefined
                }
                value={mgtScoreValue}
                disabled={mgtScore === null}
                targetId="credibility-signals"
                keyword={keyword}
                onClick={() => dispatch(setTextTabIndex(5))}
                loading={machineGeneratedTextChunksLoading}
              />
              <SummaryIcon
                icon={LabelOutlinedIcon}
                label="named_entity_title"
                descriptionNode={
                  <TransSummaryNamedEntitiesTooltip
                    keyword={keyword}
                    namedEntityCount={namedEntityCount}
                    loaded={!neLoading}
                  />
                }
                value={namedEntityCount}
                targetId="named-entity-results"
                keyword={keyword}
                loading={neLoading}
              />
              <SummaryIcon
                icon={LinkOutlinedIcon}
                label="extracted_urls_url_domain_analysis"
                descriptionNode={
                  <TransSummaryLinksTooltip
                    keyword={keyword}
                    warningLinksCount={warningLinksCount}
                    mentionsLinksCount={mentionsLinksCount}
                    factCheckerLinksCount={factCheckerLinksCount}
                    unlabelledLinksCount={unlabelledLinksCount}
                    linksCount={linksCount}
                    loaded={!inputSCLoading}
                  />
                }
                loading={inputSCLoading}
                color={cautionOrMixedLinksCount > 0 ? "warning" : undefined}
                value={
                  cautionOrMixedLinksCount > 0
                    ? cautionOrMixedLinksCount
                    : linksCount
                }
                targetId="extracted-urls"
                keyword={keyword}
              />
              <SummaryIcon
                icon={CommentOutlinedIcon}
                label="collected_comments_title"
                descriptionNode={
                  <TransSummaryCommentsTooltip
                    keyword={keyword}
                    denyCount={denyCommentsCount}
                    queryCount={queryCommentsCount}
                    supportCount={supportCommentsCount}
                    commentCount={commentCommentsCount}
                    loaded={!multilingualStanceLoading}
                  />
                }
                loading={multilingualStanceLoading}
                color={
                  denyCommentsCount + queryCommentsCount > 0
                    ? "warning"
                    : undefined
                }
                value={
                  denyCommentsCount + queryCommentsCount > 0
                    ? denyCommentsCount + queryCommentsCount
                    : commentsCount
                }
                targetId="assistant-collected-comments"
                keyword={keyword}
              />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default AssistantSummary;
