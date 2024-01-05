import React from "react";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { CallMadeRounded } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

const SemanticSearchResults = () => {
  return (
    <Box>
      <Card>
        <Box>
          <Stack direction="column" p={4} spacing={2}>
            <Typography>
              A video clip shows the arrest of an Iranian sniper who killed
              protesters in the Green Zone in Baghdad during the recent clashes.
            </Typography>
            <Stack direction="column" spacing={2}>
              <Link href="" variant="body1">
                misbar.com
              </Link>
              <Typography>Arabic</Typography>
              <Typography variant="subtitle2">2022-08-31</Typography>
            </Stack>

            <Box />
            <Box />
            <Stack direction="row" spacing={4}>
              <Button
                target="_blank"
                href={
                  "https://misbar.com/factcheck/2022/08/31/الفيديو-ليس-للقبص-عل-قناص-إيراني-استهدف-أنصار-التيار-الصدري#fe968568d1fbea4a8fa7249c8984e4f2"
                }
                color="primary"
                variant="contained"
              >
                Open Article
                <CallMadeRounded />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default SemanticSearchResults;
