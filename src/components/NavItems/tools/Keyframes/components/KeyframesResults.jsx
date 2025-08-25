import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import { KeyframeInputType as TAB_VALUES } from "@/components/NavItems/tools/Keyframes/api/createKeyframeJob";
import ImageGrid from "@/components/NavItems/tools/Keyframes/components/ImageGrid";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const KeyframesResults = ({ data, features, tabSelected, handleClose }) => {
  if (!data || tabSelected !== TAB_VALUES.URL) return null;

  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordHelp = i18nLoadNamespace("components/Shared/OnClickInfo");

  const [isZipDownloading, setIsZipDownloading] = useState(false);

  const [detailed, setDetailed] = useState(false);

  const [cols, setCols] = useState(4);

  const downloadAction = () => {
    setIsZipDownloading(true);

    const downloadUrl = data.zipFileUrl;

    fetch(downloadUrl).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.click();
        setIsZipDownloading(false);
      });
    });
  };

  const toggleDetail = () => {
    setDetailed(!detailed);
  };

  const MIN_COLS = 1; // at least 1 image per row
  const MAX_COLS = 12;

  const zoom = (delta) => {
    setCols((prev) =>
      Math.max(MIN_COLS, Math.min(MAX_COLS, Math.round(prev + delta))),
    );
  };

  //Help
  //============================================================================================
  const [anchorHelp, setAnchorHelp] = useState(null);
  const openHelp = Boolean(anchorHelp);
  const help = openHelp ? "simple-popover" : undefined;

  function clickHelp(event) {
    setAnchorHelp(event.currentTarget);
  }

  function closeHelp() {
    setAnchorHelp(null);
  }

  return (
    <>
      <Card variant="outlined">
        <Box sx={{ pb: 4, pt: 2, px: 4 }}>
          <Stack direction="column" spacing={2}>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">
                {keyword("cardheader_results")}
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton onClick={clickHelp} sx={{ p: 1 }}>
                  <HelpOutlineIcon />
                </IconButton>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{ p: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
              <Popover
                id={help}
                open={openHelp}
                anchorEl={anchorHelp}
                onClose={closeHelp}
                slotProps={{
                  paper: {
                    width: "300px",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                  }}
                >
                  <Stack direction="column" spacing={2}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {keywordHelp("title_tip")}
                      </Typography>
                      <IconButton onClick={closeHelp} sx={{ p: 1 }}>
                        <CloseIcon />
                      </IconButton>
                    </Stack>
                    <Typography variant="body2">
                      {keywordHelp("keyframes_tip")}
                    </Typography>
                  </Stack>
                </Box>
              </Popover>
            </Stack>
            <Stack direction="column">
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignContent: "center",
                }}
              >
                <Grid>
                  <Button onClick={() => toggleDetail()}>
                    {!detailed
                      ? keyword("keyframe_title_get_detail")
                      : keyword("keyframe_title_get_simple")}
                  </Button>
                </Grid>

                <Grid>
                  <Button
                    color="primary"
                    loading={isZipDownloading}
                    loadingPosition="start"
                    onClick={downloadAction}
                    startIcon={<DownloadIcon />}
                  >
                    {keyword("keyframes_download_subshots")}
                  </Button>
                </Grid>

                <Grid sx={{ flexGrow: 1, textAlign: "end" }}>
                  <Button
                    onClick={() => zoom(1)}
                    startIcon={<ZoomOutIcon />}
                    disabled={cols >= MAX_COLS}
                  >
                    {keyword("zoom_out")}
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    onClick={() => zoom(-1)}
                    startIcon={<ZoomInIcon />}
                    disabled={cols <= MIN_COLS}
                  >
                    {keyword("zoom_in")}
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </Stack>
            <ImageGrid
              images={data.keyframes}
              alt="extracted img with text"
              getImageUrl={(img) => img.keyframeUrl}
              nbOfCols={cols}
            />
          </Stack>
        </Box>
      </Card>
      {features && (
        <>
          <Card variant="outlined">
            <Box sx={{ pb: 4, pt: 2, px: 4 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h6">Faces Detected</Typography>
                <ImageGrid
                  images={features.faces}
                  alt="extracted img with face"
                  getImageUrl={(img) => img.representative.imageUrl}
                />
              </Stack>
            </Box>
          </Card>
          <Card variant="outlined">
            <Box sx={{ p: 4 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h6">Text Detected</Typography>
                <ImageGrid
                  images={features.texts}
                  alt="extracted img with text"
                  getImageUrl={(img) => img.representative.imageUrl}
                />
              </Stack>
            </Box>
          </Card>
        </>
      )}
    </>
  );
};

export default KeyframesResults;
