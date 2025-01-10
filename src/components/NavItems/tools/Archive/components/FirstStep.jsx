import React, { useEffect } from "react";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import { ArrowForward } from "@mui/icons-material";
import { isValidUrl } from "../../../../Shared/Utils/URLUtils";

const FirstStep = ({ handleClick, url, handleUrlChange }) => {
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
        <Typography>{"Enter the URL to archive"}</Typography>

        <Box>
          <TextField
            required
            error={isError}
            color={isUrlValid && url ? "success" : "primary"}
            variant="filled"
            label={"URL"}
            sx={{ width: "50%" }}
            value={url}
            onChange={(e) => handleUrlValidation(e.target.value)}
            helperText={isError ? "Incorrect URL." : ""}
          ></TextField>
        </Box>
      </Stack>

      <List sx={{ maxWidth: "fit-content" }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation(2)}>
            <Stack direction="column" spacing={1} width={"100%"}>
              <Typography variant="caption" color={"success"}>
                {"Recommended, higher quality archive"}
              </Typography>

              <ListItemText
                primary={"Wacz upload"}
                secondary={"Continue with building a wacz file"}
              />
            </Stack>

            <ArrowForward />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation(6)}>
            <Stack direction="column" spacing={1} width={"100%"}>
              <Typography variant="caption" color={"error"}>
                {"Not recommended, archive may fail to play"}
              </Typography>
              <ListItemText
                primary={"Save on the Wayback Machine"}
                secondary={"Save the URL directly to the Wayback Machine"}
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
