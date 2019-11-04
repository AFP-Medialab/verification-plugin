import {Paper} from "@material-ui/core";
import React, {createRef, useRef, useState} from "react";
import Loop from "./Loop";
import CustomTile from "../../customTitle/customTitle";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {useInput} from "../../Hooks/useInput";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
    textFiledError: {
        MuiInput: {
            underline: {
                borderBottom: theme.palette.error.main,
            },
            '&:hover fieldset': {
                borderBottom: 'yellow',
            },
        },
    },
    grow: {
        flexGrow: 1,
    },
}));


const MyMagnifier = () => {


    const classes = useStyles();

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const canvasRef = useRef();
    const input = useInput("");
    const [crop, setCrop] = useState(input !== "" ? {
        imgSrc : input.value
    } : {});


    const submitUrl = () => {

    };

    const updateCanvas = (image, pixelCrop) => {
        const canvas = canvasRef.current;
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = image;
        img.onload = () => {
            ctx.drawImage(
                img,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
            ctx.save();
        };
    };

    const onCropComplete = (crop, pixelCrop) => {
        console.log("on crop complete pxelcrop" + JSON.stringify(pixelCrop));
        updateCanvas(input.value,crop);
    };

    const onCropImageLoaded = (image) => {
        console.log("image" + image);
    };


    return (
        <Paper className={classes.root}>
            <CustomTile> {keyword("magnifier_title")}  </CustomTile>
            <Box m={1}/>
            <TextField
                id="standard-full-width"
                label={keyword("magnifier_urlbox")}
                style={{margin: 8}}
                placeholder={""}
                fullWidth
                {...input}
            />
            <Box m={2}/>
            <Button variant="contained" color="primary" onClick={submitUrl}>
                {keyword("button_submit")}
            </Button>
            {
                (input.img !== null && input.img !== "") &&
                <div>
                    <ReactCrop
                        src={input.value}
                        crop={crop}
                        onImageLoaded={onCropImageLoaded}
                        onComplete={onCropComplete}
                        onChange={newCrop => setCrop(newCrop)}
                    />
                    <Box m={1}/>
                    <canvas width={"auto"} height={"auto"} ref={canvasRef}/>
                </div>
            }
            <Loop/>
        </Paper>
    )
};
export default MyMagnifier;