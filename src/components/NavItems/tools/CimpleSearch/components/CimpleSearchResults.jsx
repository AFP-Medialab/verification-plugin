import React from "react";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { FeedbackOutlined } from "@mui/icons-material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import { getExplorerLink, toFilterValueKey } from "../utils/cimpleUtils";

/**
 * Returns a color for a given veracity label. Labels containing "credible" are green, "not credible" are red, and others are orange.
 * @param {string} label - The veracity label
 * @returns {string} - The color to use for the label ("success", "error", or "warning")
 */
const getVeracityColor = (label) => {
  const lower = label?.toLowerCase() ?? "";
  if (lower === "credible" || lower === "mostly credible") return "primary";
  if (lower === "not credible") return "error";
  return "warning";
};

const getVeracityIcon = (label) => {
  const lower = label?.toLowerCase() ?? "";
  if (lower === "credible" || lower === "mostly credible")
    return <CheckCircleOutlinedIcon />;
  if (lower === "not credible") return <CancelOutlinedIcon />;
  return <HelpOutlineIcon />;
};

const CimpleSearchResults = ({ results }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/CimpleSearch");

  if (!results || results.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <SearchOffIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
        <Typography color="text.secondary">{keyword("no_results")}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {results.length} result{results.length !== 1 ? "s" : ""}
      </Typography>
      <Stack spacing={1.5}>
        {results.map((item) => {
          const primaryVeracity = item.veracity?.[0];
          const veracityColor = primaryVeracity
            ? getVeracityColor(primaryVeracity.label)
            : null;
          const hasSecondaryMeta =
            item.date ||
            item.politicalLeaning?.length > 0 ||
            item.sentiment?.length > 0 ||
            item.emotion?.length > 0 ||
            item.propaganda?.length > 0 ||
            item.conspiracyTheory?.length > 0;

          return (
            <Paper
              key={item["@id"]}
              variant="outlined"
              sx={{
                p: 2,
                borderLeft: "4px solid",
                borderLeftColor: veracityColor
                  ? `${veracityColor}.main`
                  : "divider",
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Link
                    href={getExplorerLink(item["@id"])}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                    sx={{ fontWeight: 500, flex: 1 }}
                  >
                    {item.text}
                  </Link>
                  {item.veracity?.length > 0 &&
                    item.veracity.map((v) => (
                      <Chip
                        key={v["@id"]}
                        label={keyword(
                          `cimple_veracity_${toFilterValueKey(v["@id"])}`,
                          {
                            defaultValue: v.label,
                          },
                        )}
                        size="small"
                        color={getVeracityColor(v.label)}
                        variant="filled"
                        icon={getVeracityIcon(v.label)}
                      />
                    ))}
                </Stack>

                {hasSecondaryMeta && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {item.date && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mr: 0.5 }}
                      >
                        {item.date}
                      </Typography>
                    )}
                    {item.politicalLeaning?.map((v) => (
                      <Chip
                        key={v["@id"]}
                        label={keyword(
                          `cimple_politicalLeaning_${toFilterValueKey(v["@id"])}`,
                          {
                            defaultValue: v.label,
                          },
                        )}
                        size="small"
                        variant="outlined"
                        icon={<AccountBalanceOutlinedIcon />}
                      />
                    ))}
                    {item.sentiment?.map((v) => (
                      <Chip
                        key={v["@id"]}
                        label={keyword(
                          `cimple_sentiment_${toFilterValueKey(v["@id"])}`,
                          {
                            defaultValue: v.label,
                          },
                        )}
                        size="small"
                        variant="outlined"
                        icon={<FeedbackOutlined />}
                      />
                    ))}
                    {item.emotion?.map((v) => (
                      <Chip
                        key={v["@id"]}
                        label={keyword(
                          `cimple_emotion_${toFilterValueKey(v["@id"])}`,
                          {
                            defaultValue: v.label,
                          },
                        )}
                        size="small"
                        variant="outlined"
                        icon={<PsychologyOutlinedIcon />}
                      />
                    ))}
                    {item.propaganda?.map((v) => (
                      <Chip
                        key={v["@id"]}
                        label={keyword(
                          `cimple_propaganda_${toFilterValueKey(v["@id"])}`,
                          {
                            defaultValue: v.label,
                          },
                        )}
                        size="small"
                        variant="outlined"
                        icon={<CampaignOutlinedIcon />}
                      />
                    ))}
                    {item.conspiracyTheory?.map((v) => (
                      <Chip
                        key={v["@id"]}
                        label={keyword(
                          `cimple_conspiracyTheory_${toFilterValueKey(v["@id"])}`,
                          {
                            defaultValue: v.label,
                          },
                        )}
                        size="small"
                        variant="outlined"
                        icon={<HubOutlinedIcon />}
                      />
                    ))}
                  </Stack>
                )}

                {item.reviews?.length > 0 && (
                  <Box sx={{ pt: 0.5 }}>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <FactCheckOutlinedIcon
                        sx={{ fontSize: 14, color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {keyword("fact_checks_label")} ({item.reviews.length})
                      </Typography>
                    </Stack>
                    <Stack
                      spacing={0.5}
                      sx={{
                        pl: 1.5,
                        borderLeft: "2px solid",
                        borderColor: "divider",
                      }}
                    >
                      {item.reviews.map((review) => (
                        <Stack
                          key={review["@id"]}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {review.date && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {review.date}
                            </Typography>
                          )}
                          {review.author?.length > 0 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: 600 }}
                            >
                              {review.author.map((a) => a.label).join(", ")}
                            </Typography>
                          )}
                          <Link
                            href={review.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="caption"
                          >
                            {keyword("review_link")}
                          </Link>
                          {review.language && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              [{keyword(`cimple_language_${review.language}`)}]
                            </Typography>
                          )}
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CimpleSearchResults;
