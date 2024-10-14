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
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { CheckCircleOutline, TaskAltOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

// render status icon for extracted urls
const Status = (params) => {
  console.log("Status params=", params);
  return (
    <Stack>
      {params.done && params.sourceType && (
        //  <params.urlIcon color={params.urlColor} />
        <Chip label={params.sourceType} color={params.urlColor} size="small" />
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
  //console.log("DomainAccount params=", params);
  let domainOrAccount = "";
  if (params.urlResults && params.urlResults.resolvedDomain) {
    domainOrAccount = "https://" + params.urlResults.resolvedDomain;
  }
  return (
    <div>
      {params.done && domainOrAccount != "" && (
        <Tooltip title={domainOrAccount}>
          <Link target="_blank" href={domainOrAccount} color={params.urlColor}>
            {domainOrAccount}
          </Link>
        </Tooltip>
      )}
      {params.loading && (
        // <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
        <Skeleton variant="rounded" />
        // </div>
      )}
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
      {console.log("LsourceType=", params.sourceType)}
      {console.log("LurlColor=", params.urlColor)}
      {console.log("LurlIcon=", params.urlIcon)}
      {params.done && params.sourceType && (
        <ExtractedSourceCredibilityResult
          extractedSourceCredibilityResults={params.urlResults}
          sourceType={params.sourceType}
          url={params.urlResults.resolvedLink}
          urlColor={params.urlColor}
          urlIcon={params.urlIcon}
        />
      )}
      {params.loading && (
        //<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
        <Skeleton variant="rounded" height={20} width={20} />
        //</div>
      )}
    </div>
  );
};

// columns
const columns = [
  {
    field: "id",
    headerName: "ID",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "status",
    headerName: "Status",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <Status
          loading={params.row.status.loading}
          done={params.row.status.done}
          fail={params.row.status.fail}
          urlIcon={params.row.status.urlIcon}
          urlColor={params.row.status.urlColor}
          sourceType={params.row.status.sourceType}
        />
      );
    },
  },
  {
    field: "domainAccount",
    headerName: "Domain/Account",
    //width: "*",
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
    //width: "2*",
    renderCell: (params) => {
      return (
        <Url url={params.row.url.url} urlColor={params.row.url.urlColor} />
      );
    },
  },
  {
    field: "details",
    headerName: "Details",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      return (
        <Details
          loading={params.row.details.loading}
          done={params.row.details.done}
          fail={params.row.details.fail}
          urlResults={params.row.details.urlResults}
          sourceType={params.row.details.sourceType}
          urlColor={params.row.details.urlColor}
          urlIcon={params.row.details.urlIcon}
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
    let urlIcon = null;
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
        urlColor = "warning";
      } else if (urlResults.positive) {
        sourceType = keyword("fact_checker");
        urlIcon = CheckCircleOutline; //TaskAltOutlined;
        urlColor = "success";
      }
    }

    // add row
    rows.push({
      id: i,
      status: {
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
        urlColor: urlColor,
        urlIcon: urlIcon,
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
      // style={{
      //   wordBreak: "break-word",
      //   overflowY: "auto",
      //   overflowX: "hidden",
      // }}
      >
        // issue with resize related to parent not having a fixed/determined
        size?
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
