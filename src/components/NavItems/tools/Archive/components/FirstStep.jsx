import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { ArrowForward } from "@mui/icons-material";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { isValidUrl } from "@Shared/Utils/URLUtils";

const FirstStep = ({ handleClick, url, handleUrlChange }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  const [isUrlValid, setIsUrlValid] = React.useState(false);

  const [isError, setIsError] = React.useState(false);

  const handleUrlValidation = (url) => {
    handleUrlChange(url);
  };

  const handleNavigation = (nextStep) => {
    if (!url || !isUrlValid) {
      setIsError(true);
      return;
    }

    handleClick(nextStep);
  };

  useEffect(() => {
    if (!url) {
      setIsUrlValid(false);
      setIsError(false);
      return;
    }

    setIsUrlValid(isValidUrl(url));

    isValidUrl(url) ? setIsError(false) : setIsError(true);
  }, [url]);

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="column" spacing={2}>
        <Typography>{keyword("step1_title")}</Typography>

        <Box>
          <TextField
            required
            error={isError}
            color={isUrlValid && url ? "success" : "primary"}
            variant="filled"
            label={keyword("step1_textfield_label")}
            sx={{ width: "50%" }}
            value={url}
            onChange={(e) => handleUrlValidation(e.target.value)}
            helperText={isError ? keyword("step1_invalid_url_error") : ""}
          ></TextField>
        </Box>
      </Stack>
      <List sx={{ maxWidth: "fit-content" }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation(2)}>
            <Stack
              direction="column"
              spacing={1}
              sx={{
                width: "100%",
              }}
            >
              <Typography variant="caption" color={"success"}>
                {keyword("step1_recommended_caption")}
              </Typography>

              <ListItemText
                primary={keyword("step1_wacz_upload_title")}
                secondary={keyword("step1_wacz_upload_subtitle")}
              />
            </Stack>

            <ArrowForward />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation(6)}>
            <Stack
              direction="column"
              spacing={1}
              sx={{
                width: "100%",
              }}
            >
              <Typography variant="caption" color={"error"}>
                {keyword("step1_not_recommended_caption")}
              </Typography>
              <ListItemText
                primary={keyword("step1_wbm_upload_title")}
                secondary={keyword("step1_wbm_upload_subtitle")}
              />
            </Stack>
            <ArrowForward />
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  );
};

export default FirstStep;
