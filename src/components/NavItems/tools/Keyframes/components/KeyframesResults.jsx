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
import KeyframesLoadingState from "@/components/NavItems/tools/Keyframes/components/KeyframesLoadingState";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
} from "@Shared/ReverseSearch/reverseSearchUtils";
import { downloadFile } from "@Shared/Utils/fileUtils";

const KeyframesResults = ({
  data,
  features,
  tabSelected,
  handleClose,
  isPending,
  isFeatureDataPending,
}) => {
  if (tabSelected !== TAB_VALUES.URL) return null;

  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordHelp = i18nLoadNamespace("components/Shared/OnClickInfo");

  const [isZipDownloading, setIsZipDownloading] = useState(false);

  const [detailed, setDetailed] = useState(false);

  const ALLOWED_COLS = [1, 2, 3, 4, 6, 12];
  const [cols, setCols] = useState(2);

  const handleDownload = async () => {
    setIsZipDownloading(true);

    try {
      await downloadFile(data.zipFileUrl, "keyframes.zip");
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setIsZipDownloading(false);
    }
  };

  const toggleDetail = () => {
    setDetailed(!detailed);
  };

  const zoomIn = () => {
    setCols((prev) => {
      const currentIndex = ALLOWED_COLS.indexOf(prev);
      if (currentIndex < ALLOWED_COLS.length - 1) {
        return ALLOWED_COLS[currentIndex + 1];
      }
      return prev;
    });
  };

  const zoomOut = () => {
    setCols((prev) => {
      const currentIndex = ALLOWED_COLS.indexOf(prev);
      if (currentIndex > 0) {
        return ALLOWED_COLS[currentIndex - 1];
      }
      return prev;
    });
  };

  const imageClickReverseSearch = (imgUrl) => {
    if (imgUrl !== "")
      reverseImageSearch(
        imgUrl,
        SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME,
        false,
      );
  };

  //Help
  //============================================================================================
  const [anchorHelp, setAnchorHelp] = useState(null);

  function clickHelp(event) {
    setAnchorHelp(event.currentTarget);
  }

  const ResultsCard = ({ children, p = 4 }) => (
    <Card variant="outlined">
      <Box sx={{ p }}>
        <Stack direction="column" spacing={2}>
          {children}
        </Stack>
      </Box>
    </Card>
  );

  const HelpPopover = ({ anchorEl, onClose, keywordHelp }) => {
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        slotProps={{ paper: { width: "300px" } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="column" spacing={2}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "baseline" }}
            >
              <Typography variant="h6" gutterBottom>
                {keywordHelp("title_tip")}
              </Typography>
              <IconButton onClick={onClose} sx={{ p: 1 }}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Typography variant="body2">
              {keywordHelp("keyframes_tip")}
            </Typography>
          </Stack>
        </Box>
      </Popover>
    );
  };

  return (
    <>
      {!data && (isPending || isFeatureDataPending) ? (
        <>
          {isPending && <KeyframesLoadingState />}
          {isFeatureDataPending && <KeyframesLoadingState />}
        </>
      ) : (
        <>
          {data && (
            <Stack direction="column" spacing={4}>
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
                      <HelpPopover
                        anchorEl={anchorHelp}
                        onClose={() => setAnchorHelp(null)}
                        keywordHelp={keywordHelp}
                      />
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
                          <Button onClick={toggleDetail}>
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
                            onClick={handleDownload}
                            startIcon={<DownloadIcon />}
                          >
                            {keyword("keyframes_download_subshots")}
                          </Button>
                        </Grid>

                        <Grid sx={{ flexGrow: 1, textAlign: "end" }}>
                          <Button
                            onClick={zoomOut}
                            startIcon={<ZoomOutIcon />}
                            disabled={cols === ALLOWED_COLS[0]}
                          >
                            {keyword("zoom_out")}
                          </Button>
                        </Grid>
                        <Grid>
                          <Button
                            onClick={zoomIn}
                            startIcon={<ZoomInIcon />}
                            disabled={
                              cols === ALLOWED_COLS[ALLOWED_COLS.length - 1]
                            }
                          >
                            {keyword("zoom_in")}
                          </Button>
                        </Grid>
                      </Grid>
                      <Divider />
                    </Stack>
                    <ImageGrid
                      images={
                        detailed
                          ? [...data.keyframes, ...data.keyframesXtra]
                          : data.keyframes
                      }
                      alt="extracted img with text"
                      getImageUrl={(img) => img.keyframeUrl}
                      nbOfCols={cols}
                      onClick={(imgUrl) => imageClickReverseSearch(imgUrl)}
                    />
                  </Stack>
                </Box>
              </Card>
              {features && (
                <>
                  <ResultsCard>
                    <Typography variant="h6">Text Detected</Typography>
                    <ImageGrid
                      images={features.texts}
                      alt="extracted img with text"
                      getImageUrl={(img) => img.representative.imageUrl}
                    />
                  </ResultsCard>
                  <ResultsCard>
                    <Typography variant="h6">Faces Detected</Typography>
                    <ImageGrid
                      images={features.faces}
                      alt="extracted img with face"
                      getImageUrl={(img) => img.representative.imageUrl}
                    />
                  </ResultsCard>
                </>
              )}
            </Stack>
          )}
        </>
      )}
    </>
  );
};

export default KeyframesResults;
