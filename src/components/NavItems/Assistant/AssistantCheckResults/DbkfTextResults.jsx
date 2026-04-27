import React from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import TextFieldsIcon from "@mui/icons-material/TextFields";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";

const DbkfTextResults = ({ results, prevFactChecksExist }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  return (
    <>
      {/* This code mimics ResultDisplayItem.jsx from SemanticSearch to match output */}
      {results?.map((value, key) => {
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
                  <TextFieldsIcon
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
                        {keyword("dbkf_text_warning")}
                      </Typography>
                    </Stack>
                    <Stack direction="column">
                      <Typography color={"textSecondary"}>
                        <Link
                          href={value.externalLink}
                          key={key}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {value.text}
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
                  {value.factCheckServices?.map(
                    ([acronym, explanation], key) => (
                      <Tooltip key={key + "_tooltip"} title={explanation}>
                        <Chip
                          key={key + "_chip"}
                          label={acronym}
                          color="warning"
                          sx={{ width: "fit-content" }}
                          size="small"
                        />
                      </Tooltip>
                    ),
                  )}
                </Stack>
              </Grid>
            </Grid>
            {results.length === key + 1 ? (
              prevFactChecksExist ? (
                <Divider orientation="horizontal" flexItem />
              ) : null
            ) : (
              <Divider orientation="horizontal" flexItem />
            )}
          </Box>
        );
      })}
    </>
  );
};
export default DbkfTextResults;
