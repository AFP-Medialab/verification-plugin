import React from "react";
import {
  Box,
  Divider,
  FormHelperText,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";

const ThirdStep = ({
  isWaczFileReplayable,
  setIsWaczFileReplayable,
  helperText,
  setHelperText,
  error,
  setError,
}) => {
  const handleChange = (e) => {
    if (e.target.value) {
      setError(false);
      setHelperText("");
    }
    setIsWaczFileReplayable(e.target.value);
  };

  return (
    <Stack direction="column" spacing={6}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">{"Replay the WACZ file"}</Typography>
        <Typography>
          {
            "Make sure the archive captured in the WACZ file worked. Use webrecorder to replay the archive, and make sure the media is captured and readable."
          }
        </Typography>
      </Stack>

      <Box>
        <Stack direction="column" spacing={2}>
          <Link
            href={
              "https://chrome.google.com/webstore/detail/webrecorder/fpeoodllldobpkbkabpblcfaogecpndd"
            }
            target={"_blank"}
            variant={"body1"}
          >
            {"Download the Webrecorder's archiveweb.page Chrome extension"}
          </Link>
          <Link
            href={"https://replayweb.page/docs/"}
            target={"_blank"}
            variant={"body1"}
          >
            {"Webrecorder's ReplayWeb.page user guide"}
          </Link>
        </Stack>
      </Box>

      <Box>
        <Stack direction="column" spacing={2}>
          <Typography>{"Video tutorial"}</Typography>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/ZkfKeGN7EjM?si=qNzQe-rmspRJcqSA&amp;start=60"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <Divider />
        </Stack>
      </Box>

      <FormControl sx={{ width: "fit-content" }} error={error}>
        <RadioGroup
          aria-labelledby="radio-buttons-group-label"
          value={isWaczFileReplayable}
          onChange={handleChange}
          name="radio-buttons-group"
        >
          <FormControlLabel
            value={"true"}
            control={<Radio />}
            label={
              "The WACZ file was correctly replayed by Webrecorder's ReplayWeb.page"
            }
          />
          <FormControlLabel
            value={"false"}
            control={<Radio />}
            label={
              "There was an issue with replaying the archive (try another method)"
            }
          />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default ThirdStep;
