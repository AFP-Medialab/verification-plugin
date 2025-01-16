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
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

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

  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  return (
    <Stack direction="column" spacing={6}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">{keyword("step3_title")}</Typography>
        <Typography>{keyword("step3_subtitle")}</Typography>
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
            {keyword("step3_wbm_dl_extension")}
          </Link>
          <Link
            href={"https://replayweb.page/docs/"}
            target={"_blank"}
            variant={"body1"}
          >
            {keyword("step3_wbm_user_guide")}
          </Link>
        </Stack>
      </Box>

      <Box>
        <Stack direction="column" spacing={2}>
          <Typography>{keyword("step3_video_tutorial_title")}</Typography>
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
            label={keyword("step3_radio_wacz")}
          />
          <FormControlLabel
            value={"false"}
            control={<Radio />}
            label={keyword("step3_radio_wbm")}
          />
        </RadioGroup>
        <FormHelperText>{keyword(helperText)}</FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default ThirdStep;
