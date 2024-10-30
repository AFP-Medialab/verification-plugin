import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import {
  Box,
  Button,
  CardHeader,
  Chip,
  Grid2,
  Skeleton,
  Stack,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import Typography from "@mui/material/Typography";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SentimentSatisfied from "@mui/icons-material/SentimentSatisfied";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ExtractedSourceCredibilityResult from "../AssistantCheckResults/ExtractedSourceCredibilityResult";
import { TextCopy } from "../../../Shared/Utils/TextCopy";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { CheckCircleOutline, TaskAltOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

// render status for extracted urls
const Status = (params) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {params.done && params.urlResults !== null && (
        <>
          {params.urlResults ? (
            params.urlResults.caution !== null ? (
              <Chip
                label={keyword(params.sourceTypes.caution)}
                color={params.trafficLightColors.caution}
                size="small"
              />
            ) : null
          ) : null}
          {params.urlResults ? (
            params.urlResults.mixed !== null ? (
              <Chip
                label={keyword(params.sourceTypes.mixed)}
                color={params.trafficLightColors.mixed}
                size="small"
              />
            ) : null
          ) : null}
          {params.urlResults ? (
            params.urlResults.positive != null ? (
              <Chip
                label={keyword(params.sourceTypes.positive)}
                color={params.trafficLightColors.positive}
                size="small"
              />
            ) : null
          ) : null}
        </>
      )}
      {params.loading && <Skeleton variant="rounded" width={60} height={20} />}
    </Box>
  );
};

// render URL in correct colour
const Url = (params) => {
  return (
    <Tooltip title={params.url}>
      <Link
        style={{ cursor: "pointer" }}
        target="_blank"
        href={params.url}
        color={params.urlColor}
      >
        {params.url}
      </Link>
    </Tooltip>
  );
};

// render details
const Details = (params) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
    >
      {<TextCopy text={params.url} index={params.url} />}
      {params.done && params.domainOrAccount !== "" && (
        <ExtractedSourceCredibilityResult
          extractedSourceCredibilityResults={params.urlResults}
          url={params.urlResults.resolvedLink}
          domainOrAccount={params.domainOrAccount}
          urlColor={params.urlColor}
          sourceTypes={params.sourceTypes}
        />
      )}
      {params.loading && <Skeleton variant="rounded" height={20} width={20} />}
    </Box>
  );
};

// columns
const createColumns = (headerId, headerStatus, headerUrl, headerDetails) => {
  const columns = [
    {
      field: "id",
      headerName: headerId,
      align: "center",
      headerAlign: "center",
      type: "number",
      width: 50,
    },
    {
      field: "status",
      headerName: headerStatus,
      align: "center",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => {
        return (
          <Status
            loading={params.value.loading}
            done={params.value.done}
            fail={params.value.fail}
            urlResults={params.value.urlResults}
            trafficLightColors={params.value.trafficLightColors}
            sourceTypes={params.value.sourceTypes}
            sortBySourceType={params.value.sortBySourceType}
          />
        );
      },
      sortComparator: (v1, v2) =>
        v1.sortBySourceType.localeCompare(v2.sortBySourceType),
    },
    {
      field: "url",
      headerName: headerUrl,
      width: 700,
      renderCell: (params) => {
        return <Url url={params.value.url} urlColor={params.value.urlColor} />;
      },
      sortComparator: (v1, v2) => v1.url.localeCompare(v2.url),
    },
    {
      field: "details",
      headerName: headerDetails,
      align: "center",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => {
        return (
          <Details
            loading={params.value.loading}
            done={params.value.done}
            fail={params.value.fail}
            urlResults={params.value.urlResults}
            url={params.value.url}
            domainOrAccount={params.value.domainOrAccount}
            urlColor={params.value.urlColor}
            sourceTypes={params.value.sourceTypes}
          />
        );
      },
      sortComparator: (v1, v2) =>
        v1.sortByDetails.localeCompare(v2.sortByDetails),
    },
  ];

  return columns;
};

// rows
const createRows = (
  urls,
  extractedSourceCred,
  loading,
  done,
  fail,
  trafficLightColors,
) => {
  // define types of source credibility
  const sourceTypes = {
    caution: "warning",
    mixed: "mentions",
    positive: "fact_checker",
  };

  // create a row for each url
  let rows = [];
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];

    // define extracted source credibility
    let urlColor = "inherit";
    let urlResults = null;
    let sortBySourceType = "";
    let sortByDetails = false;
    let domainOrAccount;
    if (extractedSourceCred) {
      urlResults = extractedSourceCred[url];
      sortByDetails = true;
      // these are in order in case of multiple types of source credibility results
      if (urlResults.positive) {
        urlColor = trafficLightColors.positive;
        sortBySourceType = sourceTypes.positive + sortBySourceType;
      }
      if (urlResults.mixed) {
        urlColor = trafficLightColors.mixed;
        sortBySourceType = sourceTypes.mixed + sortBySourceType;
      }
      if (urlResults.caution) {
        urlColor = trafficLightColors.caution;
        sortBySourceType = sourceTypes.caution + sortBySourceType;
      }
      // detect domain or account address
      domainOrAccount = urlResults.resolvedDomain
        ? "https://" + urlResults.resolvedDomain
        : "";
    }

    // add row
    rows.push({
      id: i + 1,
      status: {
        loading: loading,
        done: done,
        fail: fail,
        urlResults: urlResults,
        url: url,
        trafficLightColors: trafficLightColors,
        sourceTypes: sourceTypes,
        sortBySourceType: sortBySourceType,
      },
      url: {
        url: url,
        urlColor: urlColor,
      },
      details: {
        loading: loading,
        done: done,
        fail: fail,
        urlResults: urlResults,
        urlColor: urlColor,
        sourceTypes: sourceTypes,
        domainOrAccount: domainOrAccount,
        sortByDetails: sortByDetails,
      },
    });
  }

  return rows;
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
  const trafficLightColors = useSelector(
    (state) => state.assistant.trafficLightColors,
  );

  const urls =
    inputSCDone && extractedLinks ? extractedLinks : linkList ? linkList : null;
  const rows = createRows(
    urls,
    extractedSourceCred,
    inputSCLoading,
    inputSCDone,
    inputSCFail,
    trafficLightColors,
  );
  const columns = createColumns(
    keyword("id"),
    keyword("status"),
    keyword("assistant_urlbox"),
    keyword("options"),
  );

  // if no urls extracted
  if (!urls) {
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
          wordBreak: "break-word",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* issue with resize related to parent not having a fixed/determined size? */}
        <div style={{ height: 400, width: 1000, minWidth: 0 }}>
          {/* <div style={{ height: 400, width: "100%", minWidth: 0 }}> */}
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: "status", sort: "desc" }],
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default AssistantLinkResult;
