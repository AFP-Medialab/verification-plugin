import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomTile from "../../customTitle/customTitle"
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import videoUrl from "../../tutorial/images/VideoURLmenu.png";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import LocalFile from "./LocalFile/LocalFile";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
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

const Keyframes = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    const [textValid, setTextValid] = React.useState(true);
    const textChange = (val) => {
        setTextValid(val)
    };

    const [localFile, setLocalFile] = useState(false);
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };

    return (
        <Paper className={classes.root}>
            <CustomTile> {keyword("keyframes_title")}  </CustomTile>
            <br/>
            <Box display={localFile ? "none" : "block"}>
                <TextField
                    error={!textValid}
                    id="standard-full-width"
                    label={keyword("keyframes_input")}
                    style={{margin: 8}}
                    placeholder="URL"
                    helperText=""
                    fullWidth
                    onChange={() => textChange(true)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Box m={2}/>
                <Button variant="contained" color="primary" onClick={toggleLocal}>
                    {keyword("button_localfile")}
                </Button>
                <Box m={2}/>
                <Button variant="contained" color="primary">
                    {keyword("button_submit")}
                </Button>
            </Box>
            <Box display={!localFile ? "none" : "block"}>
                <Button variant="contained" color="primary" onClick={toggleLocal}>
                    {keyword("forensic_card_back")}
                </Button>
                <LocalFile/>
            </Box>
        </Paper>
    );
};
export default Keyframes;