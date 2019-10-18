import React from "react";
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

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        textAlign: "center",
    },
    textFiledError: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.error.main,
            },
            '&:hover fieldset': {
                borderColor: 'yellow',
            },
        },
    },
    textFiledChanged:{

    }
}));

const Analysis = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    const [state, setState] = React.useState({
        checkedBox: true,
    });

    const handleChange = name => event => {
        setState({...state, [name]: event.target.checked});
    };

    const [textValid, setTextValid] = React.useState(true);
    const textChange = (val) => {
        setTextValid(val)
    };
    return (
        <Paper className={classes.root}>
            <CustomTile> {keyword("api_title")}  </CustomTile>
            <br/>
            <TextField
                error={!textValid}
                id="standard-full-width"
                label={keyword("api_input")}
                style={{ margin: 8 }}
                placeholder="URL"
                helperText=""
                fullWidth
                onChange={() => textChange(true)}
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={state.checkedBox}
                        onChange={handleChange('checkedBox')}
                        value="checkedBox"
                        color="primary"
                    />
                }
                label={keyword("api_repro")}
            />
            <Button variant="contained" color="primary">
                {keyword("button_submit")}
            </Button>
        </Paper>
    );
};
export default Analysis;