import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

const SimilarityResults = ({ results, isLoading, keyword }) => {
  if (!results || isLoading || results.length === 0) return null;

  return (
    <Card variant="outlined">
      <Box>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="primary" />}
            aria-controls="similarity-content"
            id="similarity-header"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                p: 1,
              }}
            >
              <ReportProblemOutlinedIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="primary">
                {keyword("found_dbkf")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 1 }}>
              <Typography variant="body1">
                {keyword("dbkf_articles")}
              </Typography>
              <Box sx={{ m: 1 }} />
              {results.map((value) => (
                <Typography
                  variant="body1"
                  color="primary"
                  key={value.externalLink}
                >
                  <Link
                    target="_blank"
                    href={value.externalLink}
                    color="primary"
                  >
                    {value.externalLink}
                  </Link>
                </Typography>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Card>
  );
};

export default SimilarityResults;
