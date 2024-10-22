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
    <Stack>
      {/* {params.done && params.urlResults !== null && (
        // <params.urlIcon color={params.urlColor} />
        <Stack direction="row">
        {params.urlResults ? params.urlResults.caution !== null ? 
          <ErrorOutlineOutlinedIcon color={params.trafficLightColors.caution} />
          : null : null}
        {params.urlResults ? params.urlResults.mixed !== null ? 
          <SentimentSatisfied color={params.trafficLightColors.mixed} />
          : null : null}
        {params.urlResults ? params.urlResults.positive != null ? 
          <CheckCircleOutline color={params.trafficLightColors.success} />
          : null : null}
          </Stack>
      )} */}
      {params.done && params.urlResults !== null && (
        // <params.urlIcon color={params.urlColor} />
        <Stack>
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
                color={params.trafficLightColors.success}
                size="small"
              />
            ) : null
          ) : null}
        </Stack>
      )}
      {params.loading && (
        //<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
        <Skeleton variant="circular" width={20} height={20} />
        //</div>
      )}
    </Stack>
  );
};

// render domain or account of extracted URL in correct colour
const DomainAccount = (params) => {
  return (
    <Stack>
      {params.done && params.domainOrAccount != "" && (
        <Tooltip title={params.domainOrAccount}>
          <Link
            target="_blank"
            href={params.domainOrAccount}
            color={params.urlColor}
          >
            {params.domainOrAccount}
          </Link>
        </Tooltip>
      )}
      {params.loading && (
        // <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
        <Skeleton variant="rounded" />
        // </div>
      )}
    </Stack>
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
    <Stack direction="row">
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
      {params.loading && (
        //<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
        <Skeleton variant="rounded" height={20} width={20} />
        //</div>
      )}
    </Stack>
  );
};

// columns
const createColumns = (
  headerId,
  headerStatus,
  headerDomainAccount,
  headerUrl,
  headerDetails,
) => {
  const columns = [
    {
      field: "id",
      headerName: headerId,
      align: "center",
      headerAlign: "center",
      type: "number",
    },
    {
      field: "status",
      headerName: headerStatus,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Status
            loading={params.row.status.loading}
            done={params.row.status.done}
            fail={params.row.status.fail}
            urlResults={params.row.status.urlResults}
            trafficLightColors={params.row.status.trafficLightColors}
            sourceTypes={params.row.status.sourceTypes}
          />
        );
      },
    },
    {
      field: "domainAccount",
      headerName: headerDomainAccount,
      //width: "*",
      renderCell: (params) => {
        return (
          <DomainAccount
            loading={params.row.domainAccount.loading}
            done={params.row.domainAccount.done}
            fail={params.row.domainAccount.fail}
            urlResults={params.row.domainAccount.urlResults}
            urlColor={params.row.domainAccount.urlColor}
            domainOrAccount={params.row.domainAccount.domainOrAccount}
          />
        );
      },
    },
    {
      field: "url",
      headerName: headerUrl,
      //width: "2*",
      renderCell: (params) => {
        return (
          <Url url={params.row.url.url} urlColor={params.row.url.urlColor} />
        );
      },
    },
    {
      field: "details",
      headerName: headerDetails,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Details
            loading={params.row.details.loading}
            done={params.row.details.done}
            fail={params.row.details.fail}
            urlResults={params.row.details.urlResults}
            url={params.row.details.url}
            domainOrAccount={params.row.details.domainOrAccount}
            urlColor={params.row.details.urlColor}
            sourceTypes={params.row.details.sourceTypes}
          />
        );
      },
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
    let domainOrAccount = null;
    if (extractedSourceCred) {
      urlResults = extractedSourceCred[url];
      // these are in order in case of multiple types of source credibility results
      if (urlResults.positive) {
        urlColor = trafficLightColors.positive;
      }
      if (urlResults.mixed) {
        urlColor = trafficLightColors.mixed;
      }
      if (urlResults.caution) {
        urlColor = trafficLightColors.caution;
      }
      // detect domain or account address
      domainOrAccount = urlResults.resolvedDomain
        ? "https://" + urlResults.resolvedDomain
        : null;
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
      },
      domainAccount: {
        loading: loading,
        done: done,
        fail: fail,
        urlResults: urlResults,
        urlColor: urlColor,
        domainOrAccount: domainOrAccount,
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
    keyword("domain_or_account"),
    keyword("assistant_urlbox"),
    keyword("details"),
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

  // // https://www.dhiwise.com/post/react-get-screen-width-everything-you-need-to-know
  //   const [width, setWidth] = useState(window.innerWidth);

  //   useEffect(() => {
  //     const handleResize = () => setWidth(window.innerWidth);
  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }, []);

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
        <div style={{ height: 400, width: "100%", minWidth: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            //disableColumnResize
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default AssistantLinkResult;
