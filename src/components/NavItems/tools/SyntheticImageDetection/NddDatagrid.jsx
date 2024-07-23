import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import { Chip, Grid, Stack, Typography } from "@mui/material";
import { i18nLoadNamespace } from "../../../Shared/Languages/i18nLoadNamespace";
import {
  getAlertColor,
  getAlertLabel,
  getPercentageColorCode,
} from "./syntheticImageDetectionResults";
import { OpenInNew } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  arSD,
  deDE,
  elGR,
  enUS,
  esES,
  frFR,
  itIT,
} from "@mui/x-data-grid/locales";

const languages = {
  en: enUS,
  fr: frFR,
  es: esES,
  el: elGR,
  it: itIT,
  ar: arSD,
  de: deDE,
};

const NddDataGrid = ({ rows }) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  //Retrieves the localization for the Datagrid
  const datagridLanguage = languages[currentLang] || languages["en"];

  const detectionRateStack = (row, index) => {
    if (!row.detectionResults[index]) return null;

    const detectionPercentageNdImage =
      row.detectionResults[index].predictionScore;

    return (
      <Stack direction="column" spacing={2} alignItems="start">
        <Stack direction="row" spacing={1}>
          <>
            <Typography>
              {keyword("synthetic_image_detection_probability_text")}{" "}
            </Typography>
            <Typography
              sx={{
                color: getPercentageColorCode(detectionPercentageNdImage),
              }}
            >
              {detectionPercentageNdImage}%
            </Typography>
          </>
        </Stack>
        <Chip
          label={getAlertLabel(detectionPercentageNdImage, keyword)}
          color={getAlertColor(detectionPercentageNdImage)}
        />
      </Stack>
    );
  };

  const imageUrlsCell = (urls) => {
    if (!urls || !Array.isArray(urls) || urls.length === 0) return <></>;

    return (
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        {urls.map((url, index) => (
          <Grid item key={index}>
            <Link href={url} target="_blank" rel="noopener noreferrer">
              <Typography>{`#${index + 1}`}</Typography>
            </Link>
          </Grid>
        ))}
      </Grid>
    );
  };

  /**
   * Computes the JSX element to display for the algorithm name cell
   * @param params
   * @param index {number} The array position
   * @returns {React.JSX.Element|null} The JSX element if applicable else null
   */
  const renderAlgorithmName = (params, index) => {
    if (!params.row.detectionResults[index]) {
      return null;
    }

    return (
      <Typography variant="body1">
        {keyword(params.row.detectionResults[index].name)}
      </Typography>
    );
  };

  /**
   * A helper function to compute the detection rows as not all the NDD results have the same number of algorithms for detections
   * @returns {*[]}
   */
  const detectionDetailsRows = () => {
    const maxSizeAlgorithm = Math.max(
      ...rows.map((row) => row.detectionResults.length),
    );

    let algorithmsRows = [];

    for (let i = 0; i < maxSizeAlgorithm; i++) {
      algorithmsRows.push({
        field: `detectionName${i + 1}`,
        headerName: `Algorithm #${i + 1}`,
        type: "string",
        minWidth: 120,
        valueGetter: (value, row) => row?.detectionResults[i]?.name,
        renderCell: (params) => renderAlgorithmName(params, i),
      });

      algorithmsRows.push({
        field: `detectionRate${i + 1}`,
        headerName: `Score #${i + 1}`,
        type: "number",
        minWidth: 180,
        valueGetter: (value, row) => row?.detectionResults[i]?.predictionScore,
        renderCell: (params) => detectionRateStack(params.row, i),
      });
    }

    return algorithmsRows;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 10,
    },
    {
      field: "image",
      headerName: "Image",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => <img src={params.value} height={150} />,
    },
    ...detectionDetailsRows(),
    {
      field: "archiveUrl",
      headerName: "Archive URL",
      sortable: false,
      renderCell: (params) => (
        <Link href={params.value} target="_blank">
          {params.value}
        </Link>
      ),
    },
    {
      field: "imageUrls",
      headerName: "Image URLs",
      sortable: false,
      renderCell: (params) => imageUrlsCell(params.value),
    },
    {
      headerName: "Open analysis",
      field: "actions",
      type: "actions",
      width: 120,
      getActions: (params) => {
        const url = new URL(
          window.location.href + "?url=" + params.row.archiveUrl,
        );
        return [
          // eslint-disable-next-line react/jsx-key
          <GridActionsCellItem
            icon={<OpenInNew />}
            onClick={() => window.open(url, "_blank", "noopener noreferrer")}
            label="Open Analysis"
          />,
        ];
      },
    },
  ];

  /* This is needed to fix the pagination arrows for RTL languages
   * See https://mui.com/x/react-data-grid/localization/#rtl-support
   */
  const theme = createTheme(
    {
      direction: isCurrentLanguageLeftToRight ? "ltr" : "rtl",
      palette: {
        primary: {
          light: "#00926c",
          main: "#00926c",
          dark: "#00926c",
          contrastText: "#fff",
        },
      },
    },
    datagridLanguage,
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        dir={isCurrentLanguageLeftToRight ? "ltr" : "rtl"}
        sx={{
          height: "65vh",
        }}
      >
        <DataGrid
          getRowHeight={() => "auto"}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          autosizeOnMount={true}
          autosizeOptions={{
            includeHeaders: true,
            includeOutliers: true,
            expand: true,
            outliersFactor: 20,
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </ThemeProvider>
  );
};

export default NddDataGrid;
