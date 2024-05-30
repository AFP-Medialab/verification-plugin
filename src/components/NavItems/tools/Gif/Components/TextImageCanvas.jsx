import React, { useEffect, useState, Fragment } from "react";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import { preloadImage } from "../../Forensic/utils";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";

const TextImageCanvas = ({
  imgSrc,
  text,
  filterDataURL,
  paused,
  annotation,
}) => {
  const classes = useMyStyles();

  const stageRef = React.useRef(null);
  const [img, setImg] = useState(null);
  const [textColor, setTextColor] = useState("red");
  const [textActivated, setTextActivated] = useState(annotation);
  const [textSize, setTextSize] = useState(35);

  const handleExport = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    filterDataURL(uri);
  };

  const changeColor = (event) => {
    setTextColor(event.target.value);
  };

  const handleTextVisibility = () => {
    setTextActivated(!textActivated);
  };

  useEffect(() => {
    async function loadAndPreloadImage() {
      const loadedImg = await preloadImage(imgSrc);
      setImg(loadedImg);
    }

    loadAndPreloadImage();
    if (img) handleExport();
  }, [imgSrc, img]);

  if (img) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const width = 300;
    const height = 300 / imgRatio;

    return (
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item>
          <Stage width={width} height={height}>
            <Layer ref={stageRef}>
              <Image image={img} width={width} height={height} />
              {annotation && (
                <Text
                  x={80}
                  y={80}
                  text={text}
                  fontSize={textSize}
                  draggable
                  fill={textColor}
                  onDragEnd={handleExport}
                />
              )}
            </Layer>
          </Stage>
        </Grid>
        <Grid item padding={2}>
          {paused && (
            <Fragment>
              <Grid container direction="column">
                {/* <Grid item>
                    <Box m={1} />
                    <Typography>Add or remove annotation to altered image:</Typography>
                </Grid> */}

                <Grid item>
                  <Box m={2} />
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      Colour
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={textColor}
                      label="Age"
                      onChange={changeColor}
                    >
                      <MenuItem value={"red"}>Red</MenuItem>
                      <MenuItem value={"blue"}>Blue</MenuItem>
                      <MenuItem value={"white"}>White</MenuItem>
                    </Select>
                  </FormControl>
                  <Box m={2} />
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    padding={1}
                  >
                    <Typography gutterBottom>Text size</Typography>
                    <Slider
                      defaultValue={70}
                      aria-labelledby="discrete-slider"
                      step={5}
                      min={25}
                      max={95}
                      onChange={(_e, val) => setTextSize(val)}
                      className={classes.sliderClass}
                    />
                  </Grid>
                </Grid>
                <Grid item>
                  <Box m={1} />
                  <Alert severity="info">
                    The text can be dragged to a more suitable position.
                  </Alert>
                </Grid>
                {/* <Grid item>
                  <Box m={1}/>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTextVisibility}>
                    {textActivated? "Remove annotation" : "Add annotation"}
                  </Button>
                </Grid> */}
              </Grid>
            </Fragment>
          )}
        </Grid>
      </Grid>
    );
  } else {
    return;
  }
};

export default TextImageCanvas;
