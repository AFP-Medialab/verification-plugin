import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import ExtractedUrlDomainAnalysisResults from "@/components/NavItems/Assistant/AssistantCheckResults/ExtractedUrlDomainAnalysisResults";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { TextCopy } from "@Shared/Utils/TextCopy";
import { DataGrid, getGridSingleSelectOperators } from "@mui/x-data-grid";

import {
  TransHtmlDoubleLineBreak,
  TransSourceCredibilityTooltip,
  TransUrlDomainAnalysisLink,
} from "../TransComponents";

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
      {params.done && params.urlResults.resolvedDomain === "" ? (
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
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {<TextCopy text={params.url} index={params.url} />}
      {params.done && params.domainOrAccount !== null && (
        <ExtractedUrlDomainAnalysisResults
          extractedSourceCredibilityResults={params.urlResults}
          url={params.urlResults.resolvedLink}
          urlColor={params.urlColor}
          sourceTypes={params.sourceTypes}
          trafficLightColors={params.trafficLightColors}
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
    newOperator.getApplyFilterFn = (filterItem) => {
      return (params) => {
        let isOk = true;
        filterItem?.value?.forEach((fv) => {
          isOk = isOk && params.sourceTypeList.includes(fv);
        });
        return isOk;
      };
    };
    return newOperator;
  });

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
  const sourceTypes = useSelector((state) => state.assistant.sourceTypes);

  const urls =
    inputSCDone && extractedLinks ? extractedLinks : linkList ? linkList : null;

  // create a row for each url
  let rows = [];
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];

    // define extracted source credibility
    let urlColor = "inherit"; //trafficLightColors.unlabelled;
    let urlResults = {
      caution: null,
      mixed: null,
      positive: null,
    };
    let sortByDetails = false;
    let domainOrAccount = null;
    const unlabelled = "unlabelled";
    let sourceTypeList = [
      sourceTypes
        ? sourceTypes.unlabelled
          ? unlabelled
          : unlabelled
        : unlabelled,
    ];

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
        : null;
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
        url: url,
        urlColor: urlColor,
        domainOrAccount: domainOrAccount,
        sourceTypes: sourceTypes,
        trafficLightColors: trafficLightColors,
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
      headerName: keyword("assistant_urlbox"),
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
            urlColor={params.value.urlColor}
            domainOrAccount={params.value.domainOrAccount}
            sourceTypes={params.value.sourceTypes}
            trafficLightColors={params.value.trafficLightColors}
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
    <Card variant="outlined">
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("extracted_urls_url_domain_analysis")}
        action={
          <Tooltip
            interactive={"true"}
            title={
              <>
                <Trans t={keyword} i18nKey="extracted_urls_tooltip" />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransSourceCredibilityTooltip keyword={keyword} />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransUrlDomainAnalysisLink keyword={keyword} />
              </>
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
          overflow: "hidden",
          height: 450,
        }}
      >
        <Box sx={{ height: "100%", width: "100%" }}>
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
        </Box>
      </CardContent>
    </Card>
  );
};
export default AssistantLinkResult;
