import {Paper, Box, TextField, Button, Typography} from "@material-ui/core";
import React, {useState} from "react";
import CustomTile from "../../../utility/customTitle/customTitle";
import {useDispatch, useSelector} from "react-redux";
import 'react-image-crop/dist/ReactCrop.css';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageResult from "./ImageResult";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {useInput} from "../../../Hooks/useInput";
import {setError, setMagnifierResult} from "../../../../redux/actions";
import useMyStyles from "../../../utility/MaterialUiStyles/useMyStyles";

const Magnifier = () => {
    const classes = useMyStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const resultUrl = useSelector(state => state.tool.magnifier.url);
    const resultResult = useSelector(state => state.tool.magnifier.url);
    const dispatch = useDispatch();

    const [input, setInput] = useState(resultUrl);

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
            dispatch(setMagnifierResult(input, canvas.toDataURL('image/png'), false, false));
            canvas.remove();
        };
        img.onerror = (error) => {
            dispatch(setError(getErrorText(error)));
        };
        img.src = input;
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
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <Button>
                    <label htmlFor="fileInputMagnifier">
                        <FolderOpenIcon/>
                        <Typography variant={"subtitle2"}>{keyword("button_localfile")}</Typography>
                    </label>
                    <input id="fileInputMagnifier" type="file" hidden={true} onChange={e => {
                        setInput(URL.createObjectURL(e.target.files[0]))
                    }}/>
                </Button>
                <Box m={2}/>
                <Button variant="contained" color="primary" onClick={submitUrl}>
                    {keyword("button_submit")}
                </Button>
            </Paper>
            {
                resultResult !== "" &&
                <ImageResult/>
            }
        </div>
    )
};
export default Magnifier;