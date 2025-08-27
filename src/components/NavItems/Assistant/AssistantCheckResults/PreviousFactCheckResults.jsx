import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

const PreviousFactCheckResults = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // previous fact checks
  const prevFactChecksTitle = keyword("previous_fact_checks_title");
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );
  const prevFactChecksDone = useSelector(
    (state) => state.assistant.prevFactChecksDone,
  );

  // date information
  dayjs.extend(LocaleData);
  dayjs.extend(localizedFormat);
  const globalLocaleData = dayjs.localeData();
  // for navigating to Semantic Search with text
  const navigate = useNavigate();

  const handleClick = (path) => {
    // instead need to set parameter then load text in SemanticSearch/index.jsx
    navigate("/app/" + path + "/assistantText");
  };

  return (
    <>
      <Chip color="warning" label={prevFactChecksTitle} />

      {prevFactChecksDone && prevFactChecksResult.length > 0 && (
        <>
          {prevFactChecksResult.map((resultItem, key) => {
            // date in correct format
            const date = resultItem.published_at.slice(0, 10);

            return (
              <ListItem key={key}>
                <ListItemAvatar>
                  <Avatar src={resultItem.image_url} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div>
                      <Typography
                        variant={"body1"}
                        color={"textPrimary"}
                        component={"div"}
                        align={"left"}
                      >
                        {keyword("semantic_search_result_claim")}{" "}
                        {resultItem.claim_en}
                      </Typography>
                      <Box
                        sx={{
                          mb: 0.5,
                        }}
                      />
                    </div>
                  }
                  secondary={
                    <div>
                      <Stack direction="column">
                        <Typography
                          variant={"caption"}
                          component={"div"}
                          color={"textSecondary"}
                        >
                          {keyword("semantic_search_result_title")}{" "}
                          <Link
                            href={resultItem.externalLink}
                            key={key}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {resultItem.title_en}
                          </Link>
                        </Typography>
                        <Typography
                          variant={"caption"}
                          component={"div"}
                          color={"textSecondary"}
                        >
                          {keyword("semantic_search_rating")}{" "}
                          {resultItem.rating}
                        </Typography>
                        <Typography
                          variant={"caption"}
                          component={"div"}
                          color={"textSecondary"}
                        >
                          {dayjs(date).format(
                            globalLocaleData.longDateFormat("LL"),
                          ) ?? ""}
                        </Typography>
                      </Stack>
                    </div>
                  }
                />
              </ListItem>
            );
          })}
        </>
      )}

      {/* footer */}
      <Typography
        color={"textSecondary"}
        fontSize="small"
        sx={{
          align: "center",
        }}
      >
        {keyword("more_details")}{" "}
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick("tools/semanticSearch")}
        >
          {keyword("semantic_search_title")}
        </Link>
      </Typography>
    </>
  );
};

export default PreviousFactCheckResults;
