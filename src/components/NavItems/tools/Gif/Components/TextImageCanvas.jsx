import React, { useEffect, useState, Fragment } from "react";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import { preloadImage } from "../../Forensic/utils";
import {
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
  Typography,
} from "@mui/material";

const TextImageCanvas = ({ imgSrc, text, filterDataURL }) => {
  const stageRef = React.useRef(null);
  const [img, setImg] = useState(null);
  const [textColor, setTextColor] = useState("red");
  const [textActivated, setTextActivated] = useState(false);

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
              <Text
                text={text}
                fontSize={40}
                draggable
                fill={textColor}
                onDragEnd={handleExport}
                visible={textActivated}
              />
            </Layer>
          </Stage>
        </Grid>
        <Grid item>
          <Box m={2} />
        </Grid>
        <Grid item>
          {text && (
            <Fragment>
              <Grid container direction="column">
                <Grid item>
                  <Button onClick={handleTextVisibility}>
                    Add annotation to fake image
                  </Button>
                </Grid>
                <Grid>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Color</InputLabel>
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
                </Grid>
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
