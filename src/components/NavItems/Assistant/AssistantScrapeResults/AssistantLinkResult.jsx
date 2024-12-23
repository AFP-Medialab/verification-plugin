import React from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import { CardHeader, Grid2, Skeleton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SentimentSatisfied from "@mui/icons-material/SentimentSatisfied";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ExtractedSourceCredibilityResult from "../AssistantCheckResults/ExtractedSourceCredibilityResult";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { TaskAltOutlined } from "@mui/icons-material";

const ExtractedUrl = (
  index,
  keyword,
  extractedSourceCred,
  link,
  done,
  loading,
) => {
  let sourceType;
  let Icon;
  let iconColor;

  {
    /* select correct icon and link colour */
  }
  if (extractedSourceCred) {
    if (extractedSourceCred[link].caution) {
      sourceType = keyword("warning");
      Icon = ErrorOutlineOutlinedIcon;
      iconColor = "error";
    } else if (extractedSourceCred[link].mixed) {
      sourceType = keyword("mentions");
      Icon = SentimentSatisfied;
      iconColor = "action";
    } else if (extractedSourceCred[link].positive) {
      sourceType = keyword("fact_checker");
      Icon = TaskAltOutlined;
      iconColor = "primary";
    }
  }

  return (
    <Grid2 container wrap="wrap" key={index}>
      {/* icon */}
      <Grid2 size={{ xs: 1 }} align="center">
        {loading && <Skeleton variant="circular" width={20} height={20} />}
        {sourceType && done && <Icon color={iconColor} fontSize="large" />}
        {!sourceType && done && <LinkIcon />}
      </Grid2>

      {/* extracted links */}
      <Grid2 size={{ xs: 10 }} align="left">
        <Typography>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            color={
              extractedSourceCred
                ? extractedSourceCred[link].urlColor
                : "inherit"
            }
            href={
              extractedSourceCred
                ? extractedSourceCred[link].resolvedLink
                : link
            }
          >
            {extractedSourceCred
              ? extractedSourceCred[link].resolvedLink
              : link}
          </Link>
        </Typography>
      </Grid2>

      {/* source cred details */}
      {sourceType && done ? (
        <Grid2 size={{ xs: 1 }} align="center">
          <ExtractedSourceCredibilityResult
            extractedSourceCredibilityResults={extractedSourceCred[link]}
            sourceType={sourceType}
            url={extractedSourceCred[link].resolvedLink}
            urlColor={extractedSourceCred[link].urlColor}
          />
        </Grid2>
      ) : loading ? (
        <Grid2 size={{ xs: 1 }} align="center">
          <Skeleton variant="rounded" width={20} height={20} />
        </Grid2>
      ) : null}
    </Grid2>
  );
};

const ExtractedUrlList = (
  keyword,
  linkList,
  extractedLinks,
  extractedSourceCred,
  done,
  loading,
  fail,
) => {
  const links = extractedLinks ? extractedLinks : linkList ? linkList : null;
  if (fail) {
    return (
      <Typography
        component={"div"}
        sx={{ textAlign: "start" }}
        variant={"subtitle1"}
      >
        {keyword("extracted_urls_url_domain_analysis_failed")}
      </Typography>
    );
  }
  return (
    <div>
      {links
        ? links.map((link, index) =>
            ExtractedUrl(
              index,
              keyword,
              extractedSourceCred,
              link,
              done,
              loading,
            ),
          )
        : keyword("extracted_urls_url_domain_analysis_failed")}
    </div>
  );
};

const AssistantLinkResult = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const extractedSourceCred = useSelector(
    (state) => state.assistant.extractedSourceCred,
  );
  const linkList = useSelector((state) => state.assistant.linkList);
  const extractedLinks = useSelector((state) => state.assistant.extractedLinks);
  const inputSCDone = useSelector((state) => state.assistant.inputSCDone);
  const inputSCLoading = useSelector((state) => state.assistant.inputSCLoading);
  const inputSCFail = useSelector((state) => state.assistant.inputSCFail);

  return (
    <Grid2 size={{ xs: 12 }}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography variant={"h5"}>
              {" "}
              {keyword("extracted_urls_url_domain_analysis")}{" "}
            </Typography>
          }
          action={
            <Tooltip
              interactive={"true"}
              title={
                <div
                  className={"content"}
                  dangerouslySetInnerHTML={{
                    __html: keyword("extracted_urls_tooltip"),
                  }}
                />
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          }
        />
        <CardContent
          style={{
            maxHeight: 300,
            wordBreak: "break-word",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {ExtractedUrlList(
            keyword,
            linkList,
            extractedLinks,
            extractedSourceCred,
            inputSCDone,
            inputSCLoading,
            inputSCFail,
          )}
        </CardContent>
      </Card>
    </Grid2>
  );
};
export default AssistantLinkResult;
