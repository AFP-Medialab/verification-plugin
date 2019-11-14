import {Paper} from "@material-ui/core";
import CustomTile from "../../customTitle/customTitle";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import MySnackbar from "../../MySnackbar/MySnackbar";
import useGetImages from "./useGetImages";
import LinearProgress from "@material-ui/core/LinearProgress";
import ForensicResults from "./ForesnsicResult";


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

    const [result, isLoading, getImageError] = useGetImages(image);

    const getErrorText = (error) => {
        if (keyword(error) !== undefined)
            return keyword(error);
        return "Please give a correct link (TSV change)"
    };

    useEffect(() => {
        if (getImageError) {
            if (keyword(getImageError) !== undefined)
                setErrors(keyword(getImageError));
            else
                setErrors(keyword("forensic_error_empty_parameter"))
        }
    }, [errors]);

    useEffect(() => {
        console.log(result);
    }, [result]);

    const submitUrl = () => {
        if (input && input !== ""){
            setImage(input);
        }
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
                  disabled={isLoading}
                  onChange={e => {setInput(e.target.value)}}
              />
              <Button disabled={isLoading}>
                  <label htmlFor="fileInputForensic">
                      <FolderOpenIcon />
                      <Typography variant={"subtitle2"}>{keyword("button_localfile")}</Typography>
                  </label>
                  <input id="fileInputForensic" type="file" hidden={true} onChange={e => {
                      setInput(URL.createObjectURL(e.target.files[0]))
                  }}/>
              </Button>
              <Box m={2}/>
              <Button variant="contained" color="primary" onClick={submitUrl} disabled={isLoading}>
                  {keyword("button_submit")}
              </Button>
              <Box m={2}/>
              <LinearProgress hidden={!isLoading}/>
          </Paper>
          {
              result &&
              <ForensicResults result={result}/>
          }

          <div>
              {
                  errors && <MySnackbar variant="error" message={getErrorText(errors)} onClick={() => setErrors(null)}/>
              }
          </div>
      </div>
    );
};
export default Forensic;