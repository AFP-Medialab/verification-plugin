import React from "react";
import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";

const ThirdStep = ({}) => {
  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">{"Replay the wacz file"}</Typography>
      </Stack>

      <Typography>
        {
          "Make sure the archive captured in the wacz file worked. Use webrecorder to replay the archive, and make sure the media is captured and readable."
        }
      </Typography>

      <Alert severity="info">
        {"This is the information on how to use webrecorder..."}
      </Alert>

      <Box>
        <Typography>{"Video tutorial"}</Typography>
        <Skeleton variant="rounded" width={300} height={150} />
      </Box>

      <FormControl sx={{ width: "fit-content" }}>
        <RadioGroup
          aria-labelledby="radio-buttons-group-label"
          defaultValue="correct"
          name="radio-buttons-group"
        >
          <FormControlLabel
            value=""
            control={<Radio />}
            label={"The wacz file was correctly replayed by webrecorder"}
          />
          <FormControlLabel
            value="incorrect"
            control={<Radio />}
            label={
              "There was an issue with replaying the archive (try another method)"
            }
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};

export default ThirdStep;
