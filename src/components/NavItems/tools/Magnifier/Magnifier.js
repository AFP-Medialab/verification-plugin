import {Paper, Box, TextField, Button, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import {useDispatch, useSelector} from "react-redux";
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageResult from "./Results/ImageResult";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import {setMagnifierResult} from "../../../../redux/actions/tools/magnifierActions";
import {setError} from "../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Magnifier.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";

const Magnifier = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Magnifier.tsv", tsv);


    const resultUrl = useSelector(state => state.magnifier.url);
    const resultResult = useSelector(state => state.magnifier.result);
    const dispatch = useDispatch();

    const [input, setInput] = useState(resultUrl);

    const getErrorText = (error) => {
        if (keyword(error) !== "")
            return keyword(error);
        return keyword("please_give_a_correct_link");
    };


    const submitUrl = (src) => {
        submissionEvent(src);
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
        if (url !== undefined) {
            const uri = (url !== null) ? decodeURIComponent(url) : undefined;
            setInput(uri);
            submitUrl(uri)
        }
    }, [url]);


    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("magnifier_title")}/>
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
                        {keyword("button_submit") || ""}
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