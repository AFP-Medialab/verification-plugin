import React, { useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import { Edit, PlayArrow } from "@mui/icons-material";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ImageCanvas from "../Forensic/components/imageCanvas/imageCanvas";
import TextImageCanvas from "./Components/TextImageCanvas";
import useGetGif from "./Hooks/useGetGif";

const AnimatedGif = ({
  toolState,
  homoImg1,
  homoImg2,
  isPopup,
  isGrayscaleInverted,
  applyColorScale,
  isCanvas,
}) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/CheckGIF");
  const [filesForGif, setFilesForGif] = useState(null);
  const [delayGif, setDelayGif] = useState(null);
  const [enableDownload, setEnableDownload] = useState(false);
  const [downloadType, setDownloadType] = useState(null);

  const [imageDataURL, setImageDataURL] = React.useState();
  const [filterDataURL, setFilterDataURL] = React.useState();

  //=== PAUSE AND ANNOTATION BUTTONS ===

  const [paused, setPaused] = useState(false);
  const [annotation, setAnnotation] = useState(false);

  //
  /**
   * Pauses the animation or starts it again
   * @param {boolean | ((prevState: boolean) => boolean)} newPauseValue
   */
  function pauseUnpause(newPauseValue) {
    if (!newPauseValue) {
      setIntervalVar(setInterval(() => animateImages(), speed));
    } else {
      setIntervalVar(null);
      const x = document.getElementById("gifFilterElement");
      x.style.display = "none";
    }

    setPaused(newPauseValue);
  }

  /**
   * Function that adds or removes "Fake" annotation and pauses the gif when added
   * @param {boolean | ((prevState: boolean) => boolean)} newAnnotation
   */
  function addRemoveAnnotation(newAnnotation) {
    pauseUnpause(!paused);
    setAnnotation(newAnnotation);
  }

  //=== SPEED SLIDER ===
  const [speed, setSpeed] = useState(1100);

  const [interval, setIntervalVar] = useState(null);

  function changeSpeed(value) {
    //console.log("Change speed: " + value); //DEBUG
    setSpeed(value * -1);
  }

  function commitChangeSpeed(value) {
    //console.log("Commit change speed: " + value); //DEBUG
    //clearInterval(interval);
    if (!paused) setIntervalVar(setInterval(() => animateImages(), value));
  }

  //Loop function
  function animateImages() {
    //console.log("Loop function" + interval); //DEBUG
    //console.log(interval); //DEBUG
    const x = document.getElementById("gifFilterElement");

    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  const marks = [
    {
      value: -1700,
      label: keyword("slider_label_slow"),
    },
    {
      value: -500,
      label: keyword("slider_label_fast"),
    },
  ];
  //=== TRIGGER AND CLOSE ANIMATION ===
  useEffect(() => {
    //console.log("toolState ", toolState)
    if (
      toolState === 5 &&
      (interval === null || interval === undefined) &&
      !paused
    ) {
      setIntervalVar(setInterval(() => animateImages(), speed));
    }
    return () => {
      //console.log("Stop loop 2 "  + interval);
      if (interval !== null) {
        clearInterval(interval);
        setIntervalVar(null);
      }
    };
  }, [setIntervalVar, interval, toolState, speed]);

  useEffect(() => {
    return () => {
      //console.log("Stop loop 2 "  + interval);
      if (interval !== null) {
        clearInterval(interval);
        setIntervalVar(null);
      }
    };
  }, []);
  //Function to prepare the files to trigger the download
  const handleDownload = (type) => {
    let files = {
      image1: isCanvas ? imageDataURL : homoImg1,
      image2: isCanvas ? filterDataURL : homoImg2,
    };

    setFilesForGif(files);
    setDelayGif(speed);
    setEnableDownload(true);
    setDownloadType(type);
  };

  //console.log(filesForGif);
  //console.log(delayGif);
  //console.log(toolState);
  //Call to the API

  useGetGif(filesForGif, delayGif, enableDownload, downloadType, isCanvas);
  if (toolState === 7 && enableDownload) {
    setEnableDownload(false);
  }

  return isPopup ? (
    <Grid
      container
      spacing={4}
      direction="row"
      sx={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Grid size={{ xs: 8 }}>
        <Box className={classes.wrapperImageFilter}>
          {/*<CardMedia*/}
          {/*  component="img"*/}
          {/*  className={classes.imagesGifImage}*/}
          {/*  image={homoImg1}*/}
          {/*/>*/}

          <ImageCanvas
            className={classes.imageUploaded}
            imgSrc={homoImg1}
            isGrayscaleInverted={false}
            applyColorScale={false}
            threshold={0}
            filterDataURL={setImageDataURL}
          />
          <Box className={classes.filterDisplayedClass}>
            <ImageCanvas
              className={classes.filterDisplayedClass}
              id="gifFilterElement"
              imgSrc={homoImg2}
              isGrayscaleInverted={isGrayscaleInverted}
              applyColorScale={applyColorScale}
              threshold={127}
              filterDataURL={setFilterDataURL}
            />
          </Box>
        </Box>
      </Grid>
      <Grid
        size={{ xs: 4 }}
        container
        spacing={6}
        direction="column"
        sx={{
          justifyContent: "flex-start",
        }}
      >
        <Grid>
          <Typography gutterBottom>{keyword("slider_title")}</Typography>
          <Slider
            defaultValue={-1100}
            aria-labelledby="discrete-slider"
            step={300}
            marks={marks}
            min={-1700}
            max={-500}
            scale={(x) => -x}
            onChange={(e, val) => changeSpeed(val)}
            onChangeCommitted={() => commitChangeSpeed(speed)}
          />
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth={true}
              variant="contained"
              color="primary"
              disabled={toolState === 7}
              onClick={() => handleDownload("gif")}
            >
              {keyword("button_download")}
            </Button>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              fullWidth={true}
              variant="contained"
              color="primary"
              disabled={toolState === 7}
              onClick={() => handleDownload("mp4")}
            >
              {keyword("button_video")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <div>
      <Box
        className={classes.height100}
        sx={{
          p: 2,
        }}
      >
        <Grid
          container
          direction="column"
          className={classes.height100}
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6" className={classes.headingGif}>
            {keyword("title_preview")}
          </Typography>

          <Box
            className={classes.wrapperImageFilter}
            sx={{
              justifyContent: "center",
            }}
          >
            <Box className={classes.imagesGifImage}>
              <TextImageCanvas
                imgSrc={homoImg1}
                text={keyword("fake_annotation")}
                filterDataURL={setImageDataURL}
                paused={paused}
                annotation={annotation}
              />
            </Box>
            <Box id="gifFilterElement" className={classes.imagesGifFilter}>
              <TextImageCanvas
                imgSrc={homoImg2}
                filterDataURL={setFilterDataURL}
                text={null}
                paused={false}
                annotation={false}
              />
            </Box>
            <Box
              sx={{
                m: 3,
              }}
            />
            {(annotation || paused) && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={toolState === 7}
                  onClick={() => pauseUnpause(!paused)}
                  startIcon={paused ? <PlayArrow /> : <Edit />}
                >
                  {paused ? keyword("button_play") : keyword("button_modify")}
                </Button>
                <Box
                  sx={{
                    m: 1,
                  }}
                />
              </>
            )}
            <Button
              variant="outlined"
              color={annotation ? "error" : "primary"}
              disabled={toolState === 7}
              onClick={() => addRemoveAnnotation(!annotation)}
            >
              {annotation ? keyword("button_remove") : keyword("button_add")}
            </Button>
            <Box
              sx={{
                m: 1,
              }}
            />
            <Alert severity="info">{keyword("fake_annotation_tip")}</Alert>
          </Box>
          <Grid
            container
            direction="column"
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                m: 3,
              }}
            />

            <Typography gutterBottom>{keyword("slider_title")}</Typography>

            <Slider
              defaultValue={-1100}
              aria-labelledby="discrete-slider"
              step={300}
              marks={marks}
              min={-1700}
              max={-500}
              scale={(x) => -x}
              onChange={(_e, val) => changeSpeed(val)}
              onChangeCommitted={() => commitChangeSpeed(speed)}
              className={classes.sliderClass}
            />

            <Box
              sx={{
                m: 2,
              }}
            />

            <Grid
              container
              spacing={3}
              sx={{
                justifyContent: "space-evenly",
              }}
            >
              <Grid>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={toolState === 7}
                  onClick={() => handleDownload("gif")}
                >
                  {keyword("button_download")}
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={toolState === 7}
                  onClick={() => handleDownload("mp4")}
                >
                  {keyword("button_video")}
                </Button>
              </Grid>
            </Grid>

            <Box
              sx={{
                m: 2,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
export default AnimatedGif;
