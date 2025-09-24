import React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import DuoOutlined from "@mui/icons-material/Duo";
import ImageIconOutlined from "@mui/icons-material/Image";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";

const DbkfMediaResults = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const dbkfImageMatch = useSelector((state) => state.assistant.dbkfImageMatch);
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);

  let numResultsDetected = 0;
  dbkfImageMatch ? (numResultsDetected += dbkfImageMatch.length) : null;
  dbkfVideoMatch ? (numResultsDetected += dbkfVideoMatch.length) : null;

  const combinedDbkfMediaResults = [];
  dbkfImageMatch
    ? combinedDbkfMediaResults.push([
        dbkfImageMatch,
        ImageIconOutlined,
        keyword("dbkf_image_warning"),
      ])
    : null;
  dbkfVideoMatch
    ? combinedDbkfMediaResults.push([
        dbkfVideoMatch,
        DuoOutlined,
        keyword("dbkf_video_warning"),
      ])
    : null;

  console.log(dbkfImageMatch, dbkfVideoMatch, combinedDbkfMediaResults);

  {
    /* This code mimics ResultDisplayItem.jsx from SemanticSearch to match output */
  }
  return combinedDbkfMediaResults.map(
    ([results, DbkfMediaIcon, dbkfMediaWarning], index) => (
      <div key={index}>
        {results
          .filter(
            (obj1, i, arr) =>
              arr.findIndex((obj2) => obj2.id === obj1.id) === i,
          )
          .map((value, key) => {
            return (
              <Box
                key={key}
                sx={{
                  width: "100%",
                }}
              >
                <Grid
                  container
                  direction="row"
                  sx={{
                    p: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    size={{ xs: 10 }}
                    spacing={2}
                    sx={{
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Grid>
                      <DbkfMediaIcon
                        fontSize={"large"}
                        sx={{ width: 80, height: 80 }}
                      />
                    </Grid>
                    <Grid size="grow">
                      <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <Stack direction="column">
                          <Typography sx={{ textAlign: "start" }}>
                            {dbkfMediaWarning +
                              " " +
                              parseFloat(value.similarity).toFixed(2)}
                          </Typography>
                        </Stack>
                        <Stack direction="column">
                          <Typography color={"textSecondary"}>
                            <Link
                              href={value.claimUrl}
                              key={key}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {value.claimUrl}
                            </Link>
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid
                    size={{ xs: 2 }}
                    sx={{
                      pl: 4,
                    }}
                  >
                    <Stack
                      direction="column"
                      spacing={2}
                      sx={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <Tooltip
                        key={key + "_tooltip"}
                        title={keyword("dbkf_explanation")}
                      >
                        <Chip
                          key={key + "_chip"}
                          label={keyword("dbkf_acronym")}
                          color="warning"
                          sx={{ width: "fit-content" }}
                          size="small"
                        />
                      </Tooltip>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
      </div>
    ),
  );
};

export default DbkfMediaResults;
