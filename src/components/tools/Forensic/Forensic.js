import {Paper} from "@material-ui/core";
import CustomTile from "../../customTitle/customTitle";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FolderOpenIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Typography from "@material-ui/core/Typography";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import MySnackbar from "../../MySnackbar/MySnackbar";


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


const Forensic = () => {
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
              <CustomTile> {keyword("forensic_title")}  </CustomTile>
              <Box m={1}/>
              <TextField
                  value={input}
                  id="standard-full-width"
                  label={keyword("forensic_input")}
                  style={{margin: 8}}
                  placeholder={""}
                  fullWidth
                  onChange={e => {setInput(e.target.value)}}
              />
              <Button>
                  <label htmlFor="fileInputMagnifier">
                      <FolderOpenIcon />
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

          <div>
              {
                  errors && <MySnackbar variant="error" message={getErrorText(errors)} onClick={() => setErrors(null)}/>
              }
          </div>
      </div>
    );
};