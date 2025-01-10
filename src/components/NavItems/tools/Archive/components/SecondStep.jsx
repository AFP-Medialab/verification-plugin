import React from "react";
import {
  Alert,
  Box,
  Divider,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import DownloadWaczFile from "./downloadWaczFile";

const SecondStep = ({ url }) => {
  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">{"Build a wacz file"}</Typography>
      </Stack>

      <Stack direction="column" spacing={4}>
        <ListItem disablePadding sx={{ width: "fit-content" }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="caption" color={"success"}>
              {"Recommended"}
            </Typography>

            <ListItemText
              primary={"Use Webrecorder"}
              secondary={
                "Capture the wacz file manually using Webrecorder for best performance."
              }
            />
          </Stack>
        </ListItem>

        <Box>
          <Alert severity="info">
            {"This is the information on how to use webrecorder..."}
          </Alert>
        </Box>

        <Box>
          <Typography>{"Video tutorial"}</Typography>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/ZkfKeGN7EjM?si=2GV_J3O5wtJT30zd"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </Box>

        <Divider />

        <Stack
          direction="row"
          spacing={4}
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <ListItem disablePadding sx={{ width: "fit-content" }}>
            <Stack direction="column" spacing={1}>
              <Typography variant="caption" color={"warning"}>
                {"Beta — May not work with all URLs"}
              </Typography>

              <ListItemText
                primary={"Use Scoop"}
                secondary={"Use Scoop to download the wacz file in 1 click."}
              />
            </Stack>
          </ListItem>
          <Box>
            <DownloadWaczFile url={url} />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SecondStep;
