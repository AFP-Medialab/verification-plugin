import {Paper} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import CustomTile from "../../customTitle/customTitle";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import React, {useEffect, useState} from "react";
import {useAnalysisWrapper} from "../analysis/Hooks/useAnalysisWrapper";
import MySnackbar from "../../MySnackbar/MySnackbar";
import useVideoTreatment from "../Metadata/useVideoTreatment";
import useVideoRightsTreatment from "./useVideoRightsTreatment";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
}));

const VideoRights = () => {

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    const [inputRef, setInputRef] = useState(null);
    const [url, setUrl] = useState(null);
    const [report, loading, error] = useVideoRightsTreatment(url);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        setErrors(error);
    }, [error]);

    const submitForm = () => {
        if (!loading)
            setUrl(inputRef.value);
    };


    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("copyright_title")}  </CustomTile>
                <br/>
                <TextField
                    inputRef={ref => setInputRef(ref)}
                    id="standard-full-width"
                    label={keyword("copyright_input")}
                    placeholder="URL"
                    fullWidth
                    disabled={loading}
                />
                <Box m={2}/>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={submitForm}
                >
                    {keyword("button_submit")}
                </Button>
                <Box m={1}/>
                <LinearProgress hidden={!loading}/>
            </Paper>

            <div>
                {
                    errors && <MySnackbar variant="error" message={errors} onClick={() => setErrors("")}/>
                }
            </div>
        </div>
    )
};
export default VideoRights;