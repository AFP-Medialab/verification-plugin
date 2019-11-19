import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import {green} from "@material-ui/core/colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import CustomTile from "../../customTitle/customTitle"
import MySnackbar from "../../MySnackbar/MySnackbar";
import Box from "@material-ui/core/Box";
import YoutubeResults from "./Results/YoutubeResults.js"
import TwitterResults from "./Results/TwitterResults";
import {useAnalysisWrapper} from "./Hooks/useAnalysisWrapper";
import {setAnalysisResult} from "../../../redux/actions";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    error: {
        backgroundColor: theme.palette.error.main,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    card: {
        maxWidth: "60%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
}));

const Analysis = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const resultUrl = useSelector(state => state.tool.analysis.url);
    const resultData = useSelector(state => state.tool.analysis.result);
    const dispatch = useDispatch();

    const classes = useStyles();

    const [input, setInput] = useState(resultUrl);
    const [url, setUrl] = useState(null);
    const [reprocess, setReprocess] = useState(false);
    const [result, error, loading] = useAnalysisWrapper(url, reprocess);
    const [errors, setErrors] = useState(null);

    const reprocessToggle = () => {
        setReprocess(!reprocess);
    };

    useEffect(() => {
        setErrors(error);
    }, [error]);

    useEffect(() => {
        dispatch(setAnalysisResult(url, result))
    },[result] );

    const submitForm = () => {
        if (!loading)
            setUrl(input);
    };

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("api_title")}  </CustomTile>
                <br/>
                <TextField
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    id="standard-full-width"
                    label={keyword("api_input")}
                    placeholder="URL"
                    fullWidth
                    disabled={loading}
                />
                <Box m={2}/>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={reprocess}
                            onChange={reprocessToggle}
                            disabled={loading}
                            value="checkedBox"
                            color="primary"
                        />
                    }
                    label={keyword("api_repro")}
                />
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
            {
                resultData !== null && resultUrl != null && resultUrl.startsWith("https://www.youtube.com/") &&
                <YoutubeResults report={resultData}/>
            }
            {
                resultData !== null && resultUrl != null && resultUrl.startsWith("https://twitter.com/") &&
                <TwitterResults report={resultData}/>
            }
            <div>
                {
                    errors && <MySnackbar variant="error" message={errors} onClick={() => setErrors("")}/>
                }
            </div>
        </div>);
};
export default Analysis;