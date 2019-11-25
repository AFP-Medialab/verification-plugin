import {Paper, Box, TextField, Button, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import CustomTile from "../../../utility/customTitle/customTitle";
import {useDispatch, useSelector} from "react-redux";
import 'react-image-crop/dist/ReactCrop.css';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageResult from "./ImageResult";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import useMyStyles from "../../../utility/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import{setMagnifierResult} from "../../../../redux/actions/tools/magnifierActions";
import {setError} from "../../../../redux/actions/errorActions";

const Magnifier = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const resultUrl = useSelector(state => state.magnifier.url);
    const resultResult = useSelector(state => state.magnifier.result);
    const dispatch = useDispatch();

    const [input, setInput] = useState(resultUrl);

    const getErrorText = (error) => {
        if (keyword(error) !== undefined)
            return keyword(error);
        return "Please give a correct link (TSV change)"
    };


    const submitUrl = (src) => {
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
        img.src = src;
    };

    useEffect(() => {
        if (url !== undefined){
            const uri = (url !== undefined) ? decodeURIComponent(url) : undefined;
            setInput(uri);
            submitUrl(uri)

        }}, [url]);


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
                <Button variant="contained" color="primary" onClick={() => submitUrl(input)}>
                    {keyword("button_submit")}
                </Button>
            </Paper>
            {
                resultResult && resultResult !== "" &&
                <ImageResult/>
            }
        </div>
    )
};
export default Magnifier;