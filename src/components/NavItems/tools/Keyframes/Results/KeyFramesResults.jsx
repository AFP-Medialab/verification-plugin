import React, { memo, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
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

import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
} from "@Shared/ReverseSearch/reverseSearchUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { ROLES } from "../../../../../constants/roles";
import ImageGridList from "../../../../Shared/ImageGridList/ImageGridList";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";

/**
 *
 * @param result {KeyframesData}
 * @returns {Element}
 * @constructor
 */
const KeyFramesResults = ({ result }) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordHelp = i18nLoadNamespace("components/Shared/OnClickInfo");

  const role = useSelector((state) => state.userSession.user.roles);

  const jobId = useSelector((state) => state.keyframes.result.session);

  const [detailed, setDetailed] = useState(false);

  let simpleList = /** @type {string[]} */ [];

  for (const keyframe of result.keyframes) {
    simpleList.push(keyframe.keyframeUrl);
  }

  let detailedList = /** @type {string[]} */ [];

  for (const keyframe of result.keyframesXtra) {
    detailedList.push(keyframe.keyframeUrl);
  }

  const [cols, setCols] = useState(4);

  const toggleDetail = () => {
    setDetailed(!detailed);
  };
  const imageClick = (event) => {
    let url = event;
    if (url !== "")
      reverseImageSearch(
        url,
        SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME,
        false,
      );
  };
  const zoom = (zoom) => {
    if (zoom === -1) {
      if (cols !== 12) {
        if (cols === 4) {
          setCols(6);
        } else if (cols === 6) {
          setCols(12);
        } else {
          setCols(cols + 1);
        }
      }
    }
    if (zoom === 1) {
      if (cols !== 1) {
        if (cols === 12) {
          setCols(6);
        } else if (cols === 6) {
          setCols(4);
        } else {
          setCols(cols - 1);
        }
      }
    }
  };

  const [loadingSimple, setLoadingSimple] = useState(true);
  const [loadingDetailed, setLoadingDetailed] = useState(true);
  const [classSimple, setClassSimple] = useState(classes.hidden);
  const [classDetailed, setClassDetailed] = useState(classes.hidden);

  const showElementsSimple = () => {
    setLoadingSimple(false);
    setClassSimple(classes.showElement);
  };

  const showElementsDetailed = () => {
    setLoadingDetailed(false);
    setClassDetailed(classes.showElement);
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

  const [isZipDownloading, setIsZipDownloading] = useState(false);

  const downloadAction = () => {
    setIsZipDownloading(true);

    let downloadUrl;

    if (
      !role.includes(ROLES.BETA_TESTER) &&
      !role.includes(ROLES.EVALUATION) &&
      !role.includes(ROLES.EXTRA_FEATURE)
    ) {
      downloadUrl =
        process.env.REACT_APP_KEYFRAME_API +
        "/keyframes/" +
        jobId +
        "/Subshots";
    } else {
      downloadUrl = result.zipFileUrl;
    }

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

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={4}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">
              {keyword("cardheader_results")}
            </Typography>
            <IconButton onClick={clickHelp}>
              <HelpOutlineIcon />
            </IconButton>
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
                    </Typography>{" "}
                    <IconButton onClick={closeHelp}>
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
                  loadingPosition="start"
                  loading={isZipDownloading}
                  onClick={downloadAction}
                  startIcon={<DownloadIcon />}
                >
                  {keyword("keyframes_download_subshots")}
                </Button>
              </Grid>

              <Grid size="grow" style={{ textAlign: "end" }}>
                <Button onClick={() => zoom(-1)} startIcon={<ZoomOutIcon />}>
                  {keyword("zoom_out")}
                </Button>
              </Grid>
              <Grid>
                <Button onClick={() => zoom(1)} startIcon={<ZoomInIcon />}>
                  {keyword("zoom_in")}
                </Button>
              </Grid>
            </Grid>
            <Divider />
          </Stack>

          {detailed && loadingDetailed && (
            <Box
              sx={{
                m: 4,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {detailed && (
            <div className={classDetailed}>
              <ImageGridList
                list={detailedList}
                cols={cols}
                handleClick={imageClick}
                style={{ maxHeigth: "none", height: "auto" }}
                setLoading={showElementsDetailed}
              />
            </div>
          )}

          {!detailed && loadingSimple && (
            <Box
              sx={{
                m: 4,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {!detailed && (
            <div className={classSimple}>
              <ImageGridList
                list={simpleList}
                cols={cols}
                handleClick={imageClick}
                style={{ maxHeigth: "none", height: "auto" }}
                setLoading={showElementsSimple}
              />
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default memo(KeyFramesResults);
