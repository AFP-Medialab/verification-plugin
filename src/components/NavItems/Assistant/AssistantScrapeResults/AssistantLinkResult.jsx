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
import { DataGrid, getGridSingleSelectOperators } from "@mui/x-data-grid";

// render status for extracted urls
const Status = (params) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  return (
    <Stack direction="column" spacing={0.5}>
      {params.done && params.urlResults.caution !== null ? (
        <Chip
          label={keyword(params.sourceTypes.caution)}
          color={params.trafficLightColors.caution}
          size="small"
        />
      ) : null}
      {params.done && params.urlResults.mixed !== null ? (
        <Chip
          label={keyword(params.sourceTypes.mixed)}
          color={params.trafficLightColors.mixed}
          size="small"
        />
      ) : null}
      {params.done && params.urlResults.positive != null ? (
        <Chip
          label={keyword(params.sourceTypes.positive)}
          color={params.trafficLightColors.positive}
          size="small"
        />
      ) : null}
      {params.done && params.urlResults.resolvedDomain == "" ? (
        <Chip
          label={keyword(params.sourceTypes.unlabelled)}
          color={params.trafficLightColors.unlabelled}
          size="small"
        />
      ) : null}
      {params.loading && <Skeleton variant="rounded" width={60} height={20} />}
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
        data-testid="url-domain-analysis"
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
const sourceTypeListSortComparator = (v1, v2) => {
  return v1.sourceTypeList.length - v2.sourceTypeList.length;
};

const sourceTypeListFilterOperators = getGridSingleSelectOperators()
  .filter((operator) => operator.value === "isAnyOf")
  .map((operator) => {
    const newOperator = { ...operator };
    const newGetApplyFilterFn = (filterItem, column) => {
      return (params) => {
        let isOk = true;
        filterItem?.value?.forEach((fv) => {
          isOk = isOk && params.sourceTypeList.includes(fv);
        });
        return isOk;
      };
    };
    newOperator.getApplyFilterFn = newGetApplyFilterFn;
    return newOperator;
  });

// const createColumns = (headerId, headerStatus, headerUrl, headerDetails) => {
//   const columns = [
//     {
//       field: "id",
//       headerName: headerId,
//       align: "center",
//       headerAlign: "center",
//       type: "number",
//       minWidth: 30,
//       flex: 1,
//     },
//     {
//       field: "status",
//       headerName: headerStatus,
//       align: "center",
//       headerAlign: "center",
//       display: "flex",
//       minWidth: 120,
//       flex: 1,
//       renderCell: (params) => {
//         return (
//           <Status
//             loading={params.value.loading}
//             done={params.value.done}
//             fail={params.value.fail}
//             urlResults={params.value.urlResults}
//             trafficLightColors={params.value.trafficLightColors}
//             sourceTypes={params.value.sourceTypes}
//             sortBySourceType={params.value.sortBySourceType}
//           />
//         );
//       },
//       // sortComparator: (v1, v2) =>
//       //   v1.sortBySourceType.localeCompare(v2.sortBySourceType),
//       //valueGetter: (params) => params?.row?.sortBySourceType,
//       //valueOptions: (params) => params?.value?.sourceTypeList,
//       valueoptions: [...new Set(rows.map((o) => o.sourceTypeList).flat())],
//       sortComparator: sourceTypeListSortComparator,
//       filterOperators: sourceTypeListFilterOperators,
//     },
//     {
//       field: "url",
//       headerName: headerUrl,
//       minWidth: 400,
//       flex: 1,
//       renderCell: (params) => {
//         return <Url url={params.value.url} urlColor={params.value.urlColor} />;
//       },
//       sortComparator: (v1, v2) => v1.url.localeCompare(v2.url),
//     },
//     {
//       field: "details",
//       headerName: headerDetails,
//       align: "center",
//       headerAlign: "center",
//       display: "flex",
//       minWidth: 100,
//       flex: 1,
//       // change to type: actions,
//       //   an array of <GridActionsCellItem> elements, one for each action button
//       // getActions: (params) => [/.../],
//       renderCell: (params) => {
//         return (
//           <Details
//             loading={params.value.loading}
//             done={params.value.done}
//             fail={params.value.fail}
//             urlResults={params.value.urlResults}
//             url={params.value.url}
//             domainOrAccount={params.value.domainOrAccount}
//             urlColor={params.value.urlColor}
//             sourceTypes={params.value.sourceTypes}
//           />
//         );
//       },
//       sortComparator: (v1, v2) => v1.sortByDetails === v2.sortByDetails,
//     },
//   ];

//   return columns;
// };

// // rows
// const createRows = (
//   urls,
//   extractedSourceCred,
//   loading,
//   done,
//   fail,
//   trafficLightColors,
//   keyword,
// ) => {
//   // define types of source credibility
//   const sourceTypes = {
//     positive: "fact_checker",
//     mixed: "mentions",
//     caution: "warning",
//     unlabelled: "unlabelled",
//   };
//   // const sourceTypeList = [
//   //   keyword("fact_checker"),
//   //   keyword("mentions"),
//   //   keyword("warning"),
//   //   keyword("unlabelled"),
//   // ]

//   // create a row for each url
//   let rows = [];
//   for (let i = 0; i < urls.length; i++) {
//     let url = urls[i];

//     // define extracted source credibility
//     let urlColor = "inherit"; //trafficLightColors.unlabelled;
//     let urlResults = sourceTypes.unlabelled;
//     let sortBySourceType = "";
//     let sortByDetails = false;
//     let domainOrAccount;

//     let sourceTypeList = [];

//     if (extractedSourceCred) {
//       urlResults = extractedSourceCred[url];
//       sortByDetails = true;
//       // these are in order in case of multiple types of source credibility results
//       if (urlResults.positive) {
//         urlColor = trafficLightColors.positive;
//         sortBySourceType = sourceTypes.positive + sortBySourceType;
//         sourceTypeList.push(keyword(sourceTypes.positive));
//       }
//       if (urlResults.mixed) {
//         urlColor = trafficLightColors.mixed;
//         sortBySourceType = sourceTypes.mixed + sortBySourceType;
//         sourceTypeList.push(keyword(sourceTypes.mixed));
//       }
//       if (urlResults.caution) {
//         urlColor = trafficLightColors.caution;
//         sortBySourceType = sourceTypes.caution + sortBySourceType;
//         sourceTypeList.push(keyword(sourceTypes.caution));
//       }
//       // detect domain or account address
//       domainOrAccount = urlResults.resolvedDomain
//         ? urlResults.resolvedDomain.startsWith("https://")
//           ? urlResults.resolvedDomain
//           : "https://" + urlResults.resolvedDomain
//         : "";
//     } else {
//       sortBySourceType = sourceTypes.unlabelled;
//       sourceTypeList.push(keyword(sourceTypes.unlabelled));
//     }

//     // add row
//     rows.push({
//       id: i + 1,
//       status: {
//         loading: loading,
//         done: done,
//         fail: fail,
//         urlResults: urlResults,
//         url: url,
//         trafficLightColors: trafficLightColors,
//         sourceTypes: sourceTypes,
//         sortBySourceType: sortBySourceType,
//         sourceTypeList: sourceTypeList,
//       },
//       url: {
//         url: url,
//         urlColor: urlColor,
//       },
//       details: {
//         loading: loading,
//         done: done,
//         fail: fail,
//         urlResults: urlResults,
//         urlColor: urlColor,
//         sourceTypes: sourceTypes,
//         domainOrAccount: domainOrAccount,
//         sortByDetails: sortByDetails,
//       },
//     });
//   }

//   return rows;
// };

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
  // const rows = createRows(
  //   urls,
  //   extractedSourceCred,
  //   inputSCLoading,
  //   inputSCDone,
  //   inputSCFail,
  //   trafficLightColors,
  //   keyword,
  // );
  // const columns = createColumns(
  //   keyword("id"),
  //   keyword("status"),
  //   keyword("assistant_urlbox"),
  //   keyword("options"),
  // );

  const sourceTypes = {
    positive: "fact_checker",
    mixed: "mentions",
    caution: "warning",
    unlabelled: "unlabelled",
  };

  // create a row for each url
  let rows = [];
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];

    // define extracted source credibility
    let urlColor = "inherit"; //trafficLightColors.unlabelled;
    let urlResults = sourceTypes.unlabelled;
    let sortByDetails = false;
    let domainOrAccount;
    let sourceTypeList = [sourceTypes.unlabelled];

    if (extractedSourceCred) {
      urlResults = extractedSourceCred[url];
      sortByDetails = true;
      // these are in order in case of multiple types of source credibility results
      if (urlResults.positive) {
        urlColor = trafficLightColors.positive;
        sourceTypeList.push(keyword(sourceTypes.positive));
      }
      if (urlResults.mixed) {
        urlColor = trafficLightColors.mixed;
        sourceTypeList.push(keyword(sourceTypes.mixed));
      }
      if (urlResults.caution) {
        urlColor = trafficLightColors.caution;
        sourceTypeList.push(keyword(sourceTypes.caution));
      }
      // if positive, mixed or caution then remove unlabelled
      sourceTypeList =
        sourceTypeList.length > 1
          ? sourceTypeList.splice(1, sourceTypeList.length)
          : sourceTypeList;
      // detect domain or account address
      domainOrAccount = urlResults.resolvedDomain
        ? urlResults.resolvedDomain.startsWith("https://")
          ? urlResults.resolvedDomain
          : "https://" + urlResults.resolvedDomain
        : "";
    }

    // add row
    rows.push({
      id: i + 1,
      status: {
        loading: inputSCLoading,
        done: inputSCDone,
        fail: inputSCFail,
        urlResults: urlResults,
        url: url,
        trafficLightColors: trafficLightColors,
        sourceTypes: sourceTypes,
        sourceTypeList: sourceTypeList,
      },
      url: {
        url: url,
        urlColor: urlColor,
      },
      details: {
        loading: inputSCLoading,
        done: inputSCDone,
        fail: inputSCFail,
        urlResults: urlResults,
        urlColor: urlColor,
        sourceTypes: sourceTypes,
        domainOrAccount: domainOrAccount,
        sortByDetails: sortByDetails,
      },
    });
  }

  // columns
  const columns = [
    {
      field: "id",
      headerName: keyword("id"),
      align: "center",
      headerAlign: "center",
      type: "number",
      minWidth: 30,
      flex: 1,
    },
    {
      field: "status",
      headerName: keyword("status"),
      align: "center",
      headerAlign: "center",
      display: "flex",
      minWidth: 120,
      flex: 1,
      type: "singleSelect",
      valueOptions: [
        ...new Set(rows.map((o) => o.status.sourceTypeList).flat()),
      ],
      renderCell: (params) => {
        return (
          <Status
            loading={params.value.loading}
            done={params.value.done}
            fail={params.value.fail}
            urlResults={params.value.urlResults}
            trafficLightColors={params.value.trafficLightColors}
            sourceTypes={params.value.sourceTypes}
          />
        );
      },

      sortComparator: sourceTypeListSortComparator,
      filterOperators: sourceTypeListFilterOperators,
    },
    {
      field: "url",
      headerName: keyword("url"),
      minWidth: 400,
      flex: 1,
      renderCell: (params) => {
        return <Url url={params.value.url} urlColor={params.value.urlColor} />;
      },
      sortComparator: (v1, v2) => v1.url.localeCompare(v2.url),
    },
    {
      field: "details",
      headerName: keyword("options"),
      align: "center",
      headerAlign: "center",
      display: "flex",
      minWidth: 100,
      flex: 1,
      // change to type: actions,
      //   an array of <GridActionsCellItem> elements, one for each action button
      // getActions: (params) => [/.../],
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
      sortComparator: (v1, v2) => v1.sortByDetails === v2.sortByDetails,
    },
  ];

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
        <div style={{ height: 400, width: "100%", minWidth: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={60}
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
