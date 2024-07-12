import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Link from "@mui/material/Link";
import { Chip, Grid, Stack, Typography } from "@mui/material";
import {
  getAlertColor,
  getAlertLabel,
  getPercentageColorCode,
} from "./syntheticImageDetectionResults";
import { i18nLoadNamespace } from "../../../Shared/Languages/i18nLoadNamespace";
import { syntheticImageDetectionAlgorithms } from "./SyntheticImageDetectionAlgorithms";

const NddDataGrid = ({ rows }) => {
  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );

  const apiRef = useGridApiRef();
  // const [isLoading, setIsLoading] = useState(false);

  // const resizeData = useCallback(() => {
  //   setIsLoading(true);
  //
  //   if (!rows) return;
  //
  //   apiRef.current
  //     .autosizeColumns({
  //       includeHeaders: true,
  //       includeOutliers: true,
  //     })
  //     .then(() => {
  //       if (rows) setIsLoading(false);
  //     });
  // }, [apiRef, rows]);
  //
  // useEffect(() => {
  //   resizeData();
  // }, [resizeData]);

  const detectionRateStack = (row) => {
    const detectionPercentageNdImage = row.detectionRate1;

    const algorithm = syntheticImageDetectionAlgorithms.find(
      (algo) => (algo.apiServiceName = row.algorithmName),
    );

    return (
      <Stack direction="column" spacing={2} alignItems="start">
        <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
          {keyword(algorithm.name)}
        </Typography>
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
      // flex: 1,

      renderCell: (params) => (
        <img
          src={params.value}
          height={150}
          // width={"auto"}
        />
      ),
    },
    {
      field: "detectionRate1",
      headerName: "Detection Rate #1",
      type: "number",
      // minWidth: 300,
      flex: 1,
      renderCell: (params) => detectionRateStack(params.row),
    },
    {
      field: "archiveUrl",
      headerName: "Archive URL",
      // width: 150,
      renderCell: (params) => (
        <Link href={params.value} target="_blank">
          {params.value}
        </Link>
      ),
    },
    {
      field: "imageUrls",
      headerName: "Image URLs",
      flex: 1,
      renderCell: (params) => imageUrlsCell(params.value),
    },
  ];

  return (
    <Box
      sx={{
        height: 1000,
        // minHeight: 500,
        // width: 500,
      }}
    >
      <DataGrid
        apiRef={apiRef}
        // loading={isLoading}
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
        autosizeOptions={{
          includeHeaders: true,
          includeOutliers: true,
          columns: ["image", "detectionRate1"],
          expand: true,
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default NddDataGrid;
