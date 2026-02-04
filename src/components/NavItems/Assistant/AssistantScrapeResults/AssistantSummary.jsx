import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import LabelIcon from "@mui/icons-material/Label";
import LinkIcon from "@mui/icons-material/Link";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import ImageIcon from "@/components/NavBar/images/SVG/Image/Images.svg";
import VideoIcon from "@/components/NavBar/images/SVG/Video/Video.svg";
import { scrollToElement } from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import { KNOWN_LINKS } from "@/constants/tools";
import {
  setAssuranceExpanded,
  setWarningExpanded,
} from "@/redux/actions/tools/assistantActions";

const SummaryIcon = ({
  icon: Icon,
  label,
  color,
  value,
  targetId,
  keyword,
  onClick,
  loading,
}) => {
  const disabled = !loading && (value === 0 || value === "0");

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    }
    scrollToElement(targetId, 100);
  };

  const displayColor = disabled ? "disabled" : color || "primary";

  return (
    <Card
      variant="outlined"
      sx={{
        opacity: disabled ? 0.5 : 1,
        "&:hover": {
          borderColor: disabled ? "divider" : "primary.main",
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
          <IconButton
            onClick={handleClick}
            disabled={disabled}
            color="primary"
            sx={{ gap: 1 }}
          >
            <Icon fontSize="large" color={displayColor} />
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
                <Typography variant="h6" color={displayColor}>
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

const SvgSummaryIcon = ({
  svgIcon,
  label,
  color,
  value,
  targetId,
  keyword,
  onClick,
  loading,
}) => {
  const disabled = loading || value === 0 || value === "0";

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    }
    scrollToElement(targetId, 100);
  };

  const displayColor = disabled ? "disabled" : color || "primary";

  return (
    <Card
      variant="outlined"
      sx={{
        opacity: disabled ? 0.5 : 1,
        "&:hover": {
          borderColor: disabled ? "divider" : "primary.main",
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
          <IconButton
            onClick={handleClick}
            disabled={disabled}
            color="primary"
            sx={{ gap: 1 }}
          >
            <SvgIcon
              component={svgIcon}
              fontSize="large"
              color={displayColor}
              inheritViewBox
            />
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
                <Typography variant="h6" color={displayColor}>
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
  const neResultCount = useSelector((state) => state.assistant.neResultCount);

  // links state
  const linkList = useSelector((state) => state.assistant.linkList);

  // url type state
  const inputUrlType = useSelector((state) => state.assistant.inputUrlType);

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
  const textCount = text ? "✓" : 0;
  const namedEntityCount = neResultCount?.length || 0;
  const linksCount = linkList?.length || 0;

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <SummaryIcon
        icon={WarningAmberIcon}
        label="warnings_title"
        color={"warning"}
        value={warningsCount}
        targetId="warnings"
        keyword={keyword}
        onClick={() => dispatch(setWarningExpanded(true))}
        loading={
          dbkfTextMatchLoading || dbkfMediaMatchLoading || prevFactChecksLoading
        }
      />
      <SummaryIcon
        icon={FindInPageIcon}
        label="url_domain_analysis"
        value={domainAnalysisCount}
        targetId="url-domain-analysis"
        keyword={keyword}
        onClick={() => dispatch(setAssuranceExpanded(true))}
        loading={inputSCLoading}
      />
      <SvgSummaryIcon
        svgIcon={ImageIcon}
        label="images_label"
        value={imageCount}
        targetId="assistant-image-results"
        keyword={keyword}
      />
      <SvgSummaryIcon
        svgIcon={VideoIcon}
        label="videos_label"
        value={videoCount}
        targetId="assistant-video-results"
        keyword={keyword}
      />
      {(inputUrlType === KNOWN_LINKS.YOUTUBE ||
        inputUrlType === KNOWN_LINKS.YOUTUBESHORTS) && (
        <SummaryIcon
          icon={CommentIcon}
          label="collected_comments_title"
          value={commentsCount}
          targetId="assistant-collected-comments"
          keyword={keyword}
        />
      )}
      <SummaryIcon
        icon={ArticleIcon}
        label="text_title"
        value={textCount}
        targetId="credibility-signals"
        keyword={keyword}
      />
      <SummaryIcon
        icon={LabelIcon}
        label="named_entity_title"
        value={namedEntityCount}
        targetId="named-entity-results"
        keyword={keyword}
        loading={neLoading}
      />
      <SummaryIcon
        icon={LinkIcon}
        label="extracted_urls_url_domain_analysis"
        value={linksCount}
        targetId="extracted-urls"
        keyword={keyword}
      />
    </Stack>
  );
};
export default AssistantSummary;
