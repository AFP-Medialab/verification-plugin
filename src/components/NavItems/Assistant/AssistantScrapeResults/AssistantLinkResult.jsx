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
import { DataGrid, getGridSingleSelectOperators } from "@mui/x-data-grid";
import CopyButton from "components/Shared/CopyButton";

import { prependHttps } from "../AssistantCheckResults/assistantUtils";
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
      {params.done && params.domainResults?.caution ? (
        <Chip
          label={keyword(params.sourceTypes.caution)}
          color={params.trafficLightColors.caution}
          size="small"
        />
      ) : null}
      {params.done && params.domainResults?.mixed ? (
        <Chip
          label={keyword(params.sourceTypes.mixed)}
          color={params.trafficLightColors.mixed}
          size="small"
        />
      ) : null}
      {params.done && params.domainResults?.positive ? (
        <Chip
          label={keyword(params.sourceTypes.positive)}
          color={params.trafficLightColors.positive}
          size="small"
        />
      ) : null}
      {params.done && !params.domainResults ? (
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
  return params.url.length > 1 ? (
    <>
      {/* list of URLs from domain results on hover */}
      {params.url.map((url, index) => (
        <Typography
          key={index + "_typography"}
          variant="p"
          title={url}
          color={params.urlColor}
        >
          <Link
            key={index + "_link"}
            style={{ cursor: "pointer" }}
            target="_blank"
            href={url}
            color={params.urlColor}
          >
            {url}
          </Link>{" "}
        </Typography>
      ))}
    </>
  ) : (
    <Tooltip title={params.url}>
      {/* single unlabelled URL */}
      <Link
        style={{ cursor: "pointer" }}
        target="_blank"
        href={
          params.credibilityScope
            ? prependHttps(params.credibilityScope)
            : params.url
        }
        color={params.urlColor}
      >
        {params.credibilityScope || params.url}
      </Link>
    </Tooltip>
  );
};

// render details
const Details = (params) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <CopyButton
        strToCopy={params.url.join(" ")}
        labelBeforeCopy={keyword("copy_to_clipboard")}
        labelAfterCopy={keyword("copied_to_clipboard")}
      />
      {params.done && params.credibilityScope && (
        <ExtractedUrlDomainAnalysisResults
          domainResults={params.domainResults}
          credibilityScope={params.credibilityScope}
          credibilityScopeHttps={params.credibilityScopeHttps}
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

  const urls = inputSCDone
    ? extractedLinks || linkList || null
    : linkList || null;
  // TODO check this is still correct

  // create a row for each domain followed by row for each url without source credibility
  let rows = [];

  // source credibility done with results
  if (extractedSourceCred) {
    // domain rows
    const unlabelled = "unlabelled";
    for (const domainResults of Object.values(extractedSourceCred.domain)) {
      let urlColor = "inherit"; //trafficLightColors.unlabelled;

      // find correct source type label
      let sourceTypeList = [
        sourceTypes
          ? sourceTypes.unlabelled
            ? unlabelled
            : unlabelled
          : unlabelled,
      ];
      if (domainResults.positive) {
        urlColor = trafficLightColors.positive;
        sourceTypeList.push(keyword(sourceTypes.positive));
      }
      if (domainResults.mixed) {
        urlColor = trafficLightColors.mixed;
        sourceTypeList.push(keyword(sourceTypes.mixed));
      }
      if (domainResults.caution) {
        urlColor = trafficLightColors.caution;
        sourceTypeList.push(keyword(sourceTypes.caution));
      }

      // if positive, mixed or caution then remove unlabelled
      sourceTypeList =
        sourceTypeList.length > 1
          ? sourceTypeList.splice(1, sourceTypeList.length)
          : sourceTypeList;

      // add row for domain with list of URLs
      rows.push({
        id: rows.length + 1,
        status: {
          loading: inputSCLoading,
          done: inputSCDone,
          fail: inputSCFail,
          domainResults: domainResults,
          url: domainResults.url, // url list
          trafficLightColors: trafficLightColors,
          sourceTypes: sourceTypes,
          sourceTypeList: sourceTypeList,
        },
        domain: {
          credibilityScope: domainResults.credibilityScope,
          url: domainResults.url,
          urlColor: urlColor,
        },
        url: {
          credibilityScope: domainResults.credibilityScope,
          url: domainResults.url,
          urlColor: urlColor,
        },
        details: {
          loading: inputSCLoading,
          done: inputSCDone,
          fail: inputSCFail,
          domainResults: domainResults,
          url: domainResults.url,
          urlColor: urlColor,
          credibilityScope: domainResults.credibilityScope,
          sourceTypes: sourceTypes,
          trafficLightColors: trafficLightColors,
          sortByDetails: true,
        },
      });
    }

    // unlabelled rows
    for (let i = 0; i < extractedSourceCred.url.unlabelled.length; i++) {
      const url = extractedSourceCred.url.unlabelled[i].string;

      rows.push({
        id: rows.length + 1,
        status: {
          loading: inputSCLoading,
          done: inputSCDone,
          fail: inputSCFail,
          domainResults: null,
          url: url,
          trafficLightColors: trafficLightColors,
          sourceTypes: sourceTypes,
          sourceTypeList: [unlabelled],
        },
        domain: {
          credibilityScope: null,
          url: url,
          urlColor: "inherit",
        },
        url: {
          credibilityScope: null,
          url: [url],
          urlColor: "inherit",
        },
        details: {
          loading: inputSCLoading,
          done: inputSCDone,
          fail: inputSCFail,
          domainResults: null,
          url: [url],
          urlColor: "inherit",
          credibilityScope: null,
          sourceTypes: sourceTypes,
          trafficLightColors: trafficLightColors,
          sortByDetails: true,
        },
      });
    }
  }

  // source credibility failed or loading
  if (inputSCLoading || inputSCFail) {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      rows.push({
        id: rows.length + 1,
        status: {
          loading: inputSCLoading,
          done: inputSCDone,
          fail: inputSCFail,
          domainResults: null,
          url: url,
          trafficLightColors: trafficLightColors,
          sourceTypes: sourceTypes,
          sourceTypeList: [],
        },
        domain: {
          credibilityScope: null,
          url: url,
          urlColor: "inherit",
        },
        url: {
          url: [url],
          urlColor: "inherit",
        },
        details: {
          loading: inputSCLoading,
          done: inputSCDone,
          fail: inputSCFail,
          domainResults: null,
          url: [url],
          urlColor: "inherit",
          credibilityScope: null,
          sourceTypes: sourceTypes,
          trafficLightColors: trafficLightColors,
          sortByDetails: false,
        },
      });
    }
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
            domainResults={params.value.domainResults}
            trafficLightColors={params.value.trafficLightColors}
            sourceTypes={params.value.sourceTypes}
          />
        );
      },

      sortComparator: sourceTypeListSortComparator,
      filterOperators: sourceTypeListFilterOperators,
    },
    {
      field: "domain",
      headerName: keyword("extracted_urls_domain_account"),
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return params.value.credibilityScope
          ? params.value.credibilityScope.includes("/")
            ? keyword("social_media_account")
            : `${keyword("domain_scope")} ${params.value.url.length} ${params.value.url.length > 1 ? keyword("extracted_urls_urls") : keyword("assistant_urlbox")}`
          : null;
      },
      sortComparator: (v1, v2) =>
        (v1.credibilityScope ?? "").localeCompare(v2.credibilityScope ?? ""),
    },
    {
      field: "url",
      headerName: keyword("assistant_urlbox"),
      minWidth: 400,
      flex: 1,
      renderCell: (params) => {
        return (
          <Url
            credibilityScope={params.value.credibilityScope}
            url={params.value.url}
            urlColor={params.value.urlColor}
          />
        );
      },
      sortComparator: (v1, v2) => v1.url[0].localeCompare(v2.url[0]),
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
            domainResults={params.value.domainResults}
            url={params.value.url}
            urlColor={params.value.urlColor}
            credibilityScope={params.value.credibilityScope}
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
            rowSpanning={true}
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
