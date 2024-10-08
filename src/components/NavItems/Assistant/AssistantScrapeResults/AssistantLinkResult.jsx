import React from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import { Box, CardHeader, Grid2, Skeleton } from "@mui/material";
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
import { DataGrid } from "@mui/x-data-grid";
import { ArraySchema } from "yup";

// render status icon for extracted urls
const StatusIcon = (params) => {
  //console.log("StatusIcon params=", params);
  return (
    <div>
      {params.done && params.sourceType && (
        <params.urlIcon color={params.urlColor} />
      )}
      {params.loading && (
        <div align="center">
          <Skeleton variant="circular" width={20} height={20} />
        </div>
      )}
      {params.done && !params.sourceType && <LinkIcon />}
    </div>
  );
};

// render domain or account of extracted URL in correct colour
const DomainAccount = (params) => {
  //console.log("DomainAccount params=", params);
  return (
    <div>
      {params.done && params.urlResults.resolvedDomain != "" && (
        <Tooltip title={"https://" + params.urlResults.resolvedDomain}>
          <Link
            target="_blank"
            href={"https://" + params.urlResults.resolvedDomain}
            color={params.urlColor}
          >
            {"https://" + params.urlResults.resolvedDomain}
          </Link>
        </Tooltip>
      )}
      {params.done && params.urlResults.resolvedDomain === "" && ""}
      {params.loading && <Skeleton variant="rounded" />}
      {(params.fail || (params.done && !params.urlResults)) && ""}
    </div>
  );
};

// render URL in correct colour
const Url = (params) => {
  //console.log("Url params=", params);
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
  //console.log("Details params=", params);
  return (
    <div>
      {params.done && params.urlResults && (
        <ExtractedSourceCredibilityResult
          extractedSourceCredibilityResults={params.urlResults}
          sourceType={params.sourceType}
          url={params.urlResults.resolvedLink}
          urlColor={params.urlResults.urlColor}
        />
      )}
      {params.loading && (
        <div align="center">
          <Skeleton variant="rounded" height={20} width={20} />
        </div>
      )}
      {(params.fail || (params.done && !params.urlResults)) && "-"}
    </div>
  );
};

// columns
const columns = [
  {
    field: "id",
    headerName: "ID",
    resizable: false,
    align: "center",
    headerAlign: "center",
    //width: '10%',
  },
  {
    field: "urlIcon",
    headerName: "Status",
    resizable: false,
    align: "center",
    headerAlign: "center",
    //width: '10%',
    renderCell: (params) => {
      return (
        <StatusIcon
          loading={params.row.urlIcon.loading}
          done={params.row.urlIcon.done}
          fail={params.row.urlIcon.fail}
          urlIcon={params.row.urlIcon.urlIcon}
          urlColor={params.row.urlIcon.urlColor}
          sourceType={params.row.urlIcon.sourceType}
        />
      );
    },
  },
  {
    field: "domainAccount",
    headerName: "Domain/Account",
    resizable: false,
    flex: 1,
    //width: '40%',
    renderCell: (params) => {
      return (
        <DomainAccount
          loading={params.row.domainAccount.loading}
          done={params.row.domainAccount.done}
          fail={params.row.domainAccount.fail}
          urlResults={params.row.domainAccount.urlResults}
          urlColor={params.row.domainAccount.urlColor}
        />
      );
    },
  },
  {
    field: "url",
    headerName: "URL",
    resizable: false,
    flex: 1,
    //width: '30%',
    renderCell: (params) => {
      return (
        <Url url={params.row.url.url} urlColor={params.row.url.urlColor} />
      );
    },
  },
  {
    field: "details",
    headerName: "Details",
    resizable: false,
    align: "center",
    headerAlign: "center",
    //width: '10%',
    renderCell: (params) => {
      return (
        <Details
          loading={params.row.details.loading}
          done={params.row.details.done}
          fail={params.row.details.fail}
          urlResults={params.row.details.urlResults}
          sourceType={params.row.details.sourceType}
        />
      );
    },
  },
];

// rows
const createRows = (
  urls,
  extractedSourceCred,
  loading,
  done,
  fail,
  keyword,
) => {
  let rows = [];

  // create a row for each url
  for (let i = 1; i < urls.length; i++) {
    let url = urls[i];

    // define extracted source credibility
    let sourceType = null;
    let urlIcon = <LinkIcon />;
    let urlColor = "inherit";
    let urlResults = null;
    if (extractedSourceCred) {
      urlResults = extractedSourceCred[url];
      if (urlResults.caution) {
        sourceType = keyword("warning");
        urlIcon = ErrorOutlineOutlinedIcon;
        urlColor = "error";
      } else if (urlResults.mixed) {
        sourceType = keyword("mentions");
        urlIcon = SentimentSatisfied;
        urlColor = "action";
      } else if (urlResults.positive) {
        sourceType = keyword("fact_checker");
        urlIcon = TaskAltOutlined;
        urlColor = "primary";
      }
    }

    // add row
    rows.push({
      id: i,
      urlIcon: {
        loading: loading,
        done: done,
        fail: fail,
        urlIcon: urlIcon,
        urlColor: urlColor,
        sourceType: sourceType,
      },
      domainAccount: {
        loading: loading,
        done: done,
        fail: fail,
        urlResults: urlResults,
        urlColor: urlColor,
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
        sourceType: sourceType,
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

  const urls =
    inputSCDone && extractedLinks ? extractedLinks : linkList ? linkList : null;
  const rows = createRows(
    urls,
    extractedSourceCred,
    inputSCLoading,
    inputSCDone,
    inputSCFail,
    keyword,
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
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </CardContent>
    </Card>
  );
};
export default AssistantLinkResult;
