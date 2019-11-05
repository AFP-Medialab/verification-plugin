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
import useFilter from "./useFilter";
import {Filters} from "./Filters";

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

    const input = useInput("https://picsum.photos/200");
    const [image, setImage] = useState("");
    const [crop, setCrop] = useState(input !== "" ? {
        imgSrc : input.value
    } : {});


    const submitUrl = () => {
        setImage(input);
    };

    const updateCanvas = (image, crop,  pixelCrop) => {
        const canvas = document.createElement("canvas")
        canvas.width = crop.width / (pixelCrop.width / 100);
        canvas.height = crop.height  / (pixelCrop.height / 100);
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = image;
        img.onload = () => {
            const scaleHeight = img.height / crop.height;
            const scaleWidth = img.width / crop.width;
            const bestScale = Math.min(scaleHeight, scaleWidth);
            ctx.drawImage(
                img,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                (img.width - crop.width * bestScale) / 2,
                (img.height - crop.height * bestScale) / 2,
                crop.width * bestScale,
                crop.height * bestScale,
            );
            ctx.save();
            let dataurl = canvas.toDataURL();
            let filters = new Filters();
            let newDataUrl = filters.filterImage(img, "sharp", 400);
            console.log("cahnged imgage == " + (dataurl !== newDataUrl).toString());
            setImage(newDataUrl);
        };
    };

    const onCropComplete = (crop, pixelCrop) => {
        console.log("on crop complete pxelcrop" + JSON.stringify(pixelCrop));
        console.log("on crop complete crop" + JSON.stringify(crop));
        if (crop.width !== 0 && crop.height !== 0)
            updateCanvas(input.value,crop, pixelCrop);
        else
            setImage(input.value);

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
                </div>

            }
            <Box m={1}/>
            <img src={image}/>
            <Box m={1}/>
            <Box m={1}/>
            <Box m={1}/>
            <Loop src={"https://picsum.photos/200"}/>
        </Paper>
    )
};
export default MyMagnifier;