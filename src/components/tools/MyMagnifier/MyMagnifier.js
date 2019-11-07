import {Paper} from "@material-ui/core";
import React, {createRef, useRef, useState, useEffect} from "react";
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
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageResult from "./ImageResult";



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

    const submitUrl = () => {
        let img = new Image();
        img.src = input.value;
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);

            // Get raw image data
            console.log("image : " + canvas.toDataURL('image/png'));
           setImage(canvas.toDataURL('image/png'))
        };
    };

    return (
        <div>
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
            </Paper>
            {
                image !== "" &&
                <ImageResult image={image}/>
            }
        </div>
    )
};
export default MyMagnifier;