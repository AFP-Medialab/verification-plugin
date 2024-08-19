import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";

const ResultDisplayItem = ({
  id,
  claim,
  title,
  claimOriginalLanguage,
  titleOriginalLanguage,
  rating,
  date,
  website,
  language,
  similarityScore,
  articleUrl,
  domainUrl,
  imageUrl,
}) => {
  const path = useLocation();
  let keyword;
  if (path.pathname.includes("/app/assistant")) {
    keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  } else {
    keyword = i18nLoadNamespace("components/NavItems/tools/SemanticSearch");
  }

  const [showOriginalClaim, setShowOriginalClaim] = useState(false);
  const [showOriginalTitle, setShowOriginalTitle] = useState(false);

  return (
    <Box width="100%" key={id}>
      <Grid container direction="row" p={2} justifyContent="space-between">
        <Grid
          item
          container
          direction="row"
          xs={10}
          spacing={2}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item>
            <Avatar
              src={imageUrl}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item xs>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Stack direction="column">
                <Typography sx={{ textAlign: "start" }}>
                  {keyword("semantic_search_result_claim")}{" "}
                  {showOriginalClaim ? claimOriginalLanguage : claim}
                </Typography>
                {language !== "English" && (
                  <Typography variant="caption">
                    {showOriginalClaim
                      ? ""
                      : `${keyword(
                          "semantic_search_result_translated_from",
                        )} ${language} • `}
                    <Link
                      onClick={() => setShowOriginalClaim((prev) => !prev)}
                      sx={{ cursor: "pointer" }}
                    >
                      {showOriginalClaim
                        ? "Show English Translation"
                        : keyword("semantic_search_result_see_original")}
                    </Link>
                  </Typography>
                )}
              </Stack>
              <Stack direction="column">
                <Typography sx={{ textAlign: "start" }}>
                  {keyword("semantic_search_result_title")}{" "}
                  <Link href={articleUrl} target="_blank">
                    {showOriginalTitle ? titleOriginalLanguage : title}
                  </Link>
                </Typography>
                {language !== "English" && (
                  <Typography variant="caption">
                    {showOriginalTitle
                      ? ""
                      : `${keyword(
                          "semantic_search_result_translated_from",
                        )} ${language} • `}
                    <Link
                      onClick={() => setShowOriginalTitle((prev) => !prev)}
                      sx={{ cursor: "pointer" }}
                    >
                      {showOriginalTitle
                        ? keyword("semantic_search_result_english_translation")
                        : keyword("semantic_search_result_see_original")}
                    </Link>
                  </Typography>
                )}
              </Stack>
              <Typography variant="body2">
                {keyword("semantic_search_rating")} {rating}
              </Typography>
              <Typography variant="subtitle2">{date ?? ""}</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={2} pl={4}>
          <Stack direction="column" spacing={2}>
            <Link
              href={`https://${domainUrl}`}
              variant="body1"
              sx={{ wordBreak: "break-all" }}
              target="_blank"
            >
              {website}
            </Link>
            <Chip label={language} sx={{ width: "fit-content" }} />
          </Stack>
        </Grid>
      </Grid>
      <Stack
        direction="row"
        spacing={2}
        p={2}
        justifyContent="flex-start"
        alignItems="flex-start"
      ></Stack>
      <Divider orientation="horizontal" flexItem />
    </Box>
  );
};

export default ResultDisplayItem;
