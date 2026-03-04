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

import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import ImageIcon from "@/components/NavBar/images/SVG/Image/Images.svg";
import VideoIcon from "@/components/NavBar/images/SVG/Video/Video.svg";
import { scrollToElement } from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import {
  setAssuranceExpanded,
  setImageResultsExpanded,
  setTextTabIndex,
  setVideoResultsExpanded,
  setWarningExpanded,
} from "@/redux/actions/tools/assistantActions";

const SummaryIcon = ({
  icon: Icon,
  svgIcon,
  label,
  color,
  value,
  targetId,
  keyword,
  onClick,
  loading,
  useDotIndicator,
  valueIcon: ValueIcon,
  valueIconColor,
}) => {
  const disabled = loading || value === 0 || value === false;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    scrollToElement(targetId, 100);
  };

  const displayColor = disabled ? "disabled" : color || "primary";

  return (
    <Tooltip title={keyword(label)}>
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
              <CircularProgress size={24} />
            ) : ValueIcon ? (
              <ValueIcon
                fontSize="small"
                color={valueIconColor || displayColor}
              />
            ) : useDotIndicator ? (
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: disabled ? "action.disabled" : "primary.main",
                }}
              />
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
  const dbkfMediaMatchLoading = useSelector(
    (state) => state.assistant.dbkfMediaMatchLoading,
  );
  const neLoading = useSelector((state) => state.assistant.neLoading);
  const prevFactChecksLoading = useSelector(
    (state) => state.assistant.prevFactChecksLoading,
  );

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
  const namedEntityCount = neResultCount?.length || 0;
  const linksCount = linkList?.length || 0;
  const credDomains = extractedSourceCred?.domain
    ? Object.values(extractedSourceCred.domain)
    : [];
  const cautionOrMixedLinksCount = new Set(
    credDomains.filter((d) => d.caution || d.mixed).flatMap((d) => d.url || []),
  ).size;

  // persuasion count: total spans belonging to Red_Herring or Manipulative_Wording categories
  // technique keys follow the "Category__Technique" format
  const persuasionCount = persuasionResult?.entities
    ? Object.entries(persuasionResult.entities)
        .filter(([label]) => {
          const category = label.split("__")[0];
          return (
            category === "Red_Herring" || category === "Manipulative_Wording"
          );
        })
        .reduce((total, [, spans]) => total + spans.length, 0)
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
  // Represent as a percentage string so "0%" stays truthy (not disabled)
  const mgtScoreValue =
    mgtScore != null ? `${Math.round(mgtScore * 100)}%` : false;

  return (
    <Card variant="outlined">
      <CardHeader className={classes.assistantCardHeader} title="Summary" />
      <CardContent>
        <Stack
          direction="row"
          gap={3}
          alignItems="flex-start"
          justifyContent="center"
        >
          {/* url domain analysis group */}
          <Stack direction="column" gap={0.5}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              {keyword("Domain")}
            </Typography>
            <Stack direction="row" gap={1} justifyContent="center">
              <SummaryIcon
                icon={FindInPageOutlinedIcon}
                label="url_domain_analysis"
                color={
                  cautionSourceCred || mixedSourceCred ? "warning" : undefined
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
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              {keyword("Fact-checks")}
            </Typography>
            <Stack direction="row" gap={1} justifyContent="center">
              <SummaryIcon
                icon={WarningAmberOutlinedIcon}
                label="warnings_title"
                color={"warning"}
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
            </Stack>
          </Stack>

          {/* media group */}
          <Stack direction="column" gap={0.5}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              {keyword("Media")}
            </Typography>
            <Stack direction="row" gap={1} justifyContent="center">
              <SummaryIcon
                svgIcon={ImageIcon}
                label="images_label"
                value={imageCount}
                targetId="assistant-image-results"
                keyword={keyword}
                onClick={() => dispatch(setImageResultsExpanded(true))}
              />
              <SummaryIcon
                svgIcon={VideoIcon}
                label="videos_label"
                value={videoCount}
                targetId="assistant-video-results"
                keyword={keyword}
                onClick={() => dispatch(setVideoResultsExpanded(true))}
              />
            </Stack>
          </Stack>

          {/* text group */}
          <Stack direction="column" gap={0.5}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              {keyword("Text")}
            </Typography>
            <Stack direction="row" gap={1} justifyContent="center">
              <SummaryIcon
                icon={RecordVoiceOverOutlinedIcon}
                label="persuasion_techniques_title"
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
                color={
                  mgtScore != null && mgtScore >= MGT_ERROR_THRESHOLD
                    ? "error"
                    : mgtScore != null && mgtScore >= MGT_WARNING_THRESHOLD
                      ? "warning"
                      : undefined
                }
                value={mgtScoreValue}
                targetId="credibility-signals"
                keyword={keyword}
                onClick={() => dispatch(setTextTabIndex(5))}
                loading={machineGeneratedTextChunksLoading}
              />
              <SummaryIcon
                icon={LabelOutlinedIcon}
                label="named_entity_title"
                value={namedEntityCount}
                targetId="named-entity-results"
                keyword={keyword}
                loading={neLoading}
              />
              <SummaryIcon
                icon={LinkOutlinedIcon}
                label="extracted_urls_url_domain_analysis"
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
