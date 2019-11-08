import {Paper} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import CustomTile from "../../customTitle/customTitle";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import 'react-image-crop/dist/ReactCrop.css';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageResult from "./ImageResult";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MySnackbar from "../../MySnackbar/MySnackbar";
import Typography from "@material-ui/core/Typography";


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


const Magnifier = () => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const [input, setInput] = useState("");
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState(null);

    const getErrorText = (error) => {
        if (keyword(error) !== undefined)
            return keyword(error);
        return "Please give a correct link (TSV change)"
    };


    const submitUrl = () => {
        let img = new Image();
        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);

            // Get raw image data
            setImage("");
            setImage(canvas.toDataURL('image/png'));
            canvas.remove();
        };
        img.onerror = (error) => {
            setErrors("errors")
        };
        img.src = input;
    };

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("magnifier_title")}  </CustomTile>
                <Box m={1}/>
                <TextField
                    value={input}
                    id="standard-full-width"
                    label={keyword("magnifier_urlbox")}
                    style={{margin: 8}}
                    placeholder={""}
                    fullWidth
                    onChange={e => {setInput(e.target.value)}}
                />
                <Button>
                    <label htmlFor="fileInput">
                        <FolderOpenIcon />
                        <Typography variant={"subtitle2"}>{keyword("button_localfile")}</Typography>
                    </label>
                    <input id="fileInput" type="file" hidden={true} onChange={e => {
                        setInput(URL.createObjectURL(e.target.files[0]))
                    }}/>
                </Button>
                <Box m={2}/>
                <Button variant="contained" color="primary" onClick={submitUrl}>
                    {keyword("button_submit")}
                </Button>
            </Paper>
            {
                image !== "" &&
                <ImageResult image={image}/>
            }
            <div>
                {
                    errors && <MySnackbar variant="error" message={getErrorText(errors)} onClick={() => setErrors(null)}/>
                }
            </div>
        </div>
    )
};
export default Magnifier;