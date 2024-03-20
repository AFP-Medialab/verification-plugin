import React from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import { CardHeader, CircularProgress } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SentimentSatisfied from "@mui/icons-material/SentimentSatisfied";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ExtractedSourceCredibilityResult from "../AssistantCheckResults/ExtractedSourceCredibilityResult";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

const ExtractedUrl = (index, keyword, extractedSourceCred, link) => {
  let sourceType;
  let Icon;
  let iconColor;

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
      Icon = CheckCircleOutlineIcon;
      iconColor = "primary";
    }
  }
  return (
    <Grid container wrap="wrap" key={index}>
      <Grid item xs={1} align="center">
        <LinkIcon />
      </Grid>

      <Grid item xs={10} align="left">
        <Typography>
          <Link
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
      </Grid>

      {sourceType ? (
        <Grid item xs={1} style={{ display: "flex", alignItems: "center" }}>
          <ExtractedSourceCredibilityResult
            extractedSourceCredibilityResults={extractedSourceCred[link]}
            sourceType={sourceType}
            Icon={Icon}
            iconColor={iconColor}
            url={extractedSourceCred[link].resolvedLink}
            urlColor={extractedSourceCred[link].urlColor}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};

const ExtractedUrlList = (
  keyword,
  linkList,
  extractedLinks,
  extractedSourceCred,
) => {
  const links = extractedLinks ? extractedLinks : linkList ? linkList : null;
  return (
    <div>
      {links
        ? links.map((link, index) =>
            ExtractedUrl(index, keyword, extractedSourceCred, link),
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
    <Grid item xs={12}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography variant={"h5"}>
              {" "}
              {keyword("extracted_urls_url_domain_analysis")}{" "}
              {inputSCLoading && <CircularProgress color={"secondary"} />}
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
          {inputSCLoading &&
            ExtractedUrlList(
              keyword,
              linkList,
              extractedLinks,
              extractedSourceCred,
            )}
          {inputSCFail &&
            ExtractedUrlList(
              keyword,
              linkList,
              extractedLinks,
              extractedSourceCred,
            )}
          {inputSCDone &&
            ExtractedUrlList(
              keyword,
              linkList,
              extractedLinks,
              extractedSourceCred,
            )}
        </CardContent>
      </Card>
    </Grid>
  );
};
export default AssistantLinkResult;
