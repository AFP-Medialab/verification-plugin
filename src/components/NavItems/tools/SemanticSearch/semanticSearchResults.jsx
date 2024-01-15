import React from "react";
import Box from "@mui/material/Box";
import { Pagination, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

const SemanticSearchResults = () => {
  return (
    <Box>
      <Card>
        <Box>
          <Stack
            direction="column"
            spacing={2}
            p={2}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Stack
              direction="row"
              spacing={2}
              p={2}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Avatar
                src="https://sprawdzam.afp.com/sites/default/files/styles/twitter_card/public/medias/factchecking/g2/2022-09/aa2dc4ac30e8a183448986495b465e19.jpeg?itok=GLOsh8mv"
                variant="rounded"
                sx={{ width: 80, height: 80 }}
              />
              <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={2}
              >
                <Typography>
                  Claim: A video clip shows the arrest of an Iranian sniper who
                  killed protesters in the Green Zone in Baghdad during the
                  recent clashes.
                </Typography>
                <Typography>
                  Title: This clip has been circulating since 2011...
                </Typography>
                <Typography>Rating: False</Typography>
                <Typography variant="subtitle2">
                  Published on 2022-08-31
                </Typography>
              </Stack>
              <Stack direction="column" spacing={2}>
                <Link href="" variant="body1">
                  misbar.com
                </Link>
                <Typography>Arabic</Typography>
              </Stack>
            </Stack>
            <Divider orientation="horizontal" flexItem />
            <Box alignSelf="center" pt={4}>
              <Pagination count={10} />
            </Box>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default SemanticSearchResults;
