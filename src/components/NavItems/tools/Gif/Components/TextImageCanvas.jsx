import React, { useEffect, useState } from "react";
import { Image, Layer, Stage, Text } from "react-konva";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";

import { preloadImage } from "../../Forensic/utils";

const TextImageCanvas = ({
  imgSrc,
  text,
  filterDataURL,
  paused,
  annotation,
}) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/CheckGIF");

  const stageRef = React.useRef(null);
  const [img, setImg] = useState(null);
  const [textColor, setTextColor] = useState("red");
  const [textSize, setTextSize] = useState(35);

  const handleExport = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    filterDataURL(uri);
  };

  const changeColor = (event) => {
    setTextColor(event.target.value);
  };

  // loads image
  useEffect(() => {
    preloadImage(imgSrc).then(setImg);
  }, [imgSrc]);

  useEffect(() => {
    if (img) handleExport();
  }, [img]);

  if (img) {
    //calculates width and height used for the canvas, to have the same proportions as the image
    //gifs have a default width of 600 pixels
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const width = 600;
    const height = 600 / imgRatio;

    return (
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid>
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
        <Grid>
          {paused && (
            <>
              <Grid container direction="column">
                <Grid>
                  <Box m={3} />
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">
                      {keyword("colour_label")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={textColor}
                      label="Age"
                      onChange={changeColor}
                    >
                      <MenuItem value={"red"}>{keyword("colour_red")}</MenuItem>
                      <MenuItem value={"blue"}>
                        {keyword("colour_blue")}
                      </MenuItem>
                      <MenuItem value={"white"}>
                        {keyword("colour_white")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography gutterBottom>
                      {keyword("text_size_label")}
                    </Typography>
                    <Slider
                      defaultValue={60}
                      aria-labelledby="discrete-slider"
                      step={5}
                      min={25}
                      max={95}
                      onChange={(_e, val) => {
                        if (typeof val !== "number") return;
                        setTextSize(val);
                      }}
                      className={classes.sliderClass}
                    />
                  </Grid>
                </Grid>
                <Grid>
                  <Box m={1} />
                  <Alert severity="info">{keyword("draggable_text_tip")}</Alert>
                  <Box m={3} />
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    );
  } else {
    return;
  }
};

export default TextImageCanvas;
