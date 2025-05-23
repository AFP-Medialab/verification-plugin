import React, { useState } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import DownloadWaczFile from "./downloadWaczFile";
import SinglefileConverter from "./singlefileConverter";

const SecondStep = ({ url }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");
  const [telegramURL, setTelegramURL] = useState("");

  return (
    <Stack direction="column" spacing={6}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">{keyword("step2_title")}</Typography>
      </Stack>

      <Stack direction="column" spacing={6}>
        <ListItem disablePadding sx={{ width: "fit-content" }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="caption" color={"success"}>
              {keyword("step2_recommended_caption")}
            </Typography>

            <ListItemText
              primary={keyword("step2_wbm_title")}
              secondary={keyword("step2_wbm_subtitle")}
            />
          </Stack>
        </ListItem>

        <Box>
          <Stack direction="column" spacing={2}>
            <Link
              href={
                "https://chrome.google.com/webstore/detail/webrecorder/fpeoodllldobpkbkabpblcfaogecpndd"
              }
              target={"_blank"}
              variant={"body1"}
            >
              {keyword("step2_wbm_dl_extension")}
            </Link>
            <Link
              href={"https://archiveweb.page/guide"}
              target={"_blank"}
              variant={"body1"}
            >
              {keyword("step2_wbm_user_guide")}
            </Link>
          </Stack>
        </Box>

        <Box>
          <Stack direction="column" spacing={2}>
            <Typography>{keyword("step2_video_tutorial_title")}</Typography>
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
            <Divider />
          </Stack>
        </Box>

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
                {keyword("singlefile_warning")}
              </Typography>

              <ListItemText
                primary={keyword("step2_singlefile_title")}
                secondary={keyword("step2_singlefile_subtitle")}
              />
            </Stack>
          </ListItem>
          <Box>
            <SinglefileConverter
              telegramURL={telegramURL}
              setTelegramURL={setTelegramURL}
            />
          </Box>
        </Stack>
        <Stack>
          <ListItem disablePadding sx={{ width: "fit-content" }}>
            <Stack direction="column" spacing={1}>
              <ListItemText
                primary={keyword("step2_singlefile_set_telegram")}
                secondary={keyword("step2_singlefile_set_telegram_subtitle")}
              />
            </Stack>
          </ListItem>
          <TextField
            variant="filled"
            label={keyword("singlefile_telegram_label")}
            sx={{ width: "50%" }}
            value={telegramURL}
            onChange={(e) => setTelegramURL(e.target.value)}
          ></TextField>
        </Stack>
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
                {keyword("step2_not_recommended_caption")}
              </Typography>

              <ListItemText
                primary={keyword("step2_scoop_title")}
                secondary={keyword("step2_scoop_subtitle")}
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
