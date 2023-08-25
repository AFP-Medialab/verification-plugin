import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {
  Grid,
  Popover,
  Typography,
  Stack,
  LinearProgress,
  linearProgressClasses,
} from "@mui/material";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styled from "@emotion/styled";

const DeepfakeResutlsImage = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Deepfake.tsv",
    tsv,
  );
  const results = props.result;
  const url = props.url;
  const imgElement = React.useRef(null);

  const [rectangles, setRectangles] = useState(null);
  const [rectanglesReady, setRectanglesReady] = useState(false);

  const drawRectangles = () => {
    const imgHeight = imgElement.current.offsetHeight;
    const imgWidth = imgElement.current.offsetWidth;

    const rectanglesTemp = [];

    results.faceswap_report.info.forEach((element) => {
      const rectangleAtributes = element.bbox;

      const elementTop = Math.round(rectangleAtributes.top * imgHeight);
      const elementLeft = Math.round(rectangleAtributes.left * imgWidth);
      const elementHeight = Math.round(
        (rectangleAtributes.bottom - rectangleAtributes.top) * imgHeight,
      );
      const elementWidth = Math.round(
        (rectangleAtributes.right - rectangleAtributes.left) * imgWidth,
      );

      const elementProbability = Math.round(element.prediction * 100);
      let elementBorderClass = null;

      if (elementProbability >= 80) {
        elementBorderClass = classes.deepfakeSquareBorderRed;
      } else {
        elementBorderClass = classes.deepfakeSquareBorderWhite;
      }

      const rectangle = {
        top: elementTop,
        left: elementLeft,
        height: elementHeight,
        width: elementWidth,
        probability: elementProbability,
        borderClass: elementBorderClass,
      };

      rectanglesTemp.push(rectangle);
    });

    setRectangles(rectanglesTemp);
  };

  if (rectangles !== null && !rectanglesReady) {
    setRectanglesReady(true);
  }

  //console.log("Rectangles: ", rectangles);

  //Help
  //============================================================================================
  const [anchorHelp, setAnchorHelp] = React.useState(null);
  const openHelp = Boolean(anchorHelp);
  const help = openHelp ? "simple-popover" : undefined;

  const [faceSwapScore, setFaceswapScore] = useState(0);
  const [gANScore, setGANScore] = useState(0);
  const [diffusionScore, setDiffusionScore] = useState(0);

  useEffect(() => {
    if (results && results.unina_report && results.unina_report.prediction) {
      setDiffusionScore(results.unina_report.prediction * 100);
    }
    if (
      results &&
      results.faceswap_report &&
      results.faceswap_report.prediction
    ) {
      setFaceswapScore(results.faceswap_report.prediction * 100);
    }
    if (results && results.gan_report && results.gan_report.prediction) {
      setGANScore(results.gan_report.prediction * 100);
    }
  }, [results]);

  function clickHelp(event) {
    setAnchorHelp(event.currentTarget);
  }

  function closeHelp() {
    setAnchorHelp(null);
  }

  const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
    height: 8,
    borderRadius: 2,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 2,
      background: `linear-gradient(90deg, #D7F4DF ${101 - value}%,#2A6591 ${
        150 - value
      }%,#0B0506 ${200 - value}%)`,
    },
  }));

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <BorderLinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >
      <Card style={{ overflow: "visible", width: "50%", height: "80vh" }}>
        <CardHeader
          style={{ borderRadius: "4px 4px 0px 0px" }}
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>Image</span>
              <HelpOutlineIcon
                style={{ color: "#FFFFFF" }}
                onClick={clickHelp}
              />

              <Popover
                id={help}
                open={openHelp}
                anchorEl={anchorHelp}
                onClose={closeHelp}
                PaperProps={{
                  style: {
                    width: "300px",
                    fontSize: 14,
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
                <Box p={3}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                  >
                    <Typography constiant="h6" gutterBottom>
                      {keyword("deepfake_title_what")}
                    </Typography>

                    <CloseIcon onClick={closeHelp} />
                  </Grid>
                  <Box m={1} />
                  <Typography constiant="body2">
                    {keyword("deepfake_filters_explanation_image")}
                  </Typography>
                </Box>
              </Popover>
            </Grid>
          }
          className={classes.headerUpladedImage}
        />
        <div style={{ position: "relative" }}>
          {rectanglesReady &&
            rectangles.map((valueRectangle, keyRectangle) => {
              return (
                <div
                  key={keyRectangle}
                  className={classes.deepfakeSquare}
                  style={{
                    top: valueRectangle.top,
                    left: valueRectangle.left,
                  }}
                >
                  <div
                    className={valueRectangle.borderClass}
                    style={{
                      width: valueRectangle.width,
                      height: valueRectangle.height,
                    }}
                  />

                  <Box
                    mt={2}
                    pl={4}
                    pr={4}
                    pt={2}
                    pb={2}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: "120px",
                    }}
                  >
                    <Typography constiant="h3">
                      {valueRectangle.probability}%
                    </Typography>
                    <Typography constiant="h6" style={{ color: "#989898" }}>
                      {keyword("deepfake_name")}
                    </Typography>
                  </Box>
                </div>
              );
            })}

          <img
            src={url}
            alt={"Displays the results of the deepfake tool"}
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "auto",
            }}
            ref={imgElement}
            onLoad={() => drawRectangles()}
          />
        </div>
      </Card>
      <Card sx={{ height: "80vh", width: "50%" }}>
        <CardHeader
          style={{ borderRadius: "4px 4px 0px 0px" }}
          title="Detection Results"
        />
        <Stack direction="column" p={4} spacing={4}>
          <Stack direction="column">
            <Typography variant="h5">Faceswap</Typography>
            <LinearProgressWithLabel value={faceSwapScore} />
          </Stack>
          <Stack direction="column">
            <Typography variant="h5">GAN</Typography>
            <LinearProgressWithLabel value={gANScore} />
          </Stack>
          <Stack direction="column">
            <Typography variant="h5">Diffusion</Typography>
            <LinearProgressWithLabel value={diffusionScore} />
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};
export default DeepfakeResutlsImage;
