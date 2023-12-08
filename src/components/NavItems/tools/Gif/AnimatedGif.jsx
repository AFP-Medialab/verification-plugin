import React from "react";
import useGetGif from "./Hooks/useGetGif";
import {
  Box,
  Grid,
  Typography,
  CardMedia,
  Slider,
  Button,
} from "@mui/material";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useState, useEffect } from "react";
import ImageCanvas from "../Forensic/components/imageCanvas/imageCanvas";

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
    setIntervalVar(setInterval(() => animateImages(), value));
  }
  //Loop function
  function animateImages() {
    //console.log("Loop function" + interval); //DEBUG
    //console.log(interval); //DEBUG
    var x = document.getElementById("gifFilterElement");

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
    if (toolState === 5 && (interval === null || interval === undefined)) {
      setIntervalVar(setInterval(() => animateImages(), speed));
    }
    return () => {
      //console.log("Stop loop 2 "  + interval);
      if (interval !== null) {
        clearInterval(interval);
        setIntervalVar(null);
      }
    };
    // eslint-disable-next-line
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
    //console.log(toolState);

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
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={8}>
        <Box justifyContent="center" className={classes.wrapperImageFilter}>
          {/*<CardMedia*/}
          {/*  component="img"*/}
          {/*  className={classes.imagesGifImage}*/}
          {/*  image={homoImg1}*/}
          {/*/>*/}

          <ImageCanvas
            className={classes.imagesGifImage}
            style={{
              objectFit: "contain",
              objectPosition: "center",
              height: "100%",
              width: "100%",
            }}
            imgSrc={homoImg1}
            isGrayscaleInverted={false}
            applyColorScale={false}
            threshold={0}
            filterDataURL={setImageDataURL}
          />

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
      </Grid>
      <Grid
        item
        xs={4}
        container
        spacing={6}
        direction="column"
        justifyContent="flex-start"
      >
        <Grid item>
          <Typography gutterBottom>{keyword("slider_title")}</Typography>
          <Slider
            p={6}
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
          item
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
      <Box p={2} className={classes.height100}>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="flex-start"
          className={classes.height100}
        >
          <Typography variant="h6" className={classes.headingGif}>
            {keyword("title_preview")}
          </Typography>
          <Box justifyContent="center" className={classes.wrapperImageFilter}>
            <CardMedia
              component="img"
              className={classes.imagesGifImage}
              image={homoImg1}
            />
            <CardMedia
              component="img"
              className={classes.imagesGifFilter}
              image={homoImg2}
              id="gifFilterElement"
            />
          </Box>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box m={4} />

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

            <Box m={2} />

            <Grid item container spacing={3} justifyContent="space-evenly">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={toolState === 7}
                  onClick={() => handleDownload("gif")}
                >
                  {keyword("button_download")}
                </Button>
              </Grid>
              <Grid item>
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

            <Box m={2} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
export default AnimatedGif;
