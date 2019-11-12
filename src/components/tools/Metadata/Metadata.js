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
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MySnackbar from "../../MySnackbar/MySnackbar";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Grid from "@material-ui/core/Grid";
import EXIF from "exif-js/exif";
import MetadataImageResult from "./MetadataImageResult";
import * as mp4box from "mp4box";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
}));

function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


const Metadata = () => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const [input, setInput] = useState("");
    const [radioImage, setRadioImage] = useState(true);
    const [errors, setErrors] = useState(null);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [result, setResult] = useState(null);

    const getErrorText = (error) => {
        if (keyword(error) !== undefined)
            return keyword(error);
        return "Please give a correct file (TSV change)"
    };


    useEffect(() => {
        if (input === "")
            return;
        let imageTreatment = () => {
            let img = new Image();
            img.src = input;
            img.onload = () => {
                EXIF.getData(img, () => {
                    let res = EXIF.getAllTags(img);
                    if (!isEmpty(res))
                        setResult(res);
                    else
                        setErrors("metadata_img_error_exif");
                });
            };
            img.onerror = (error) => {
                setErrors(error)
            };
        };

        let videoTreatment = () => {
            let video =  mp4box.createFile();
            console.log(video);

            video.onReady = (info) => {
                console.log("video ")

                console.log(info)
            };

            video.onError = (error) => {
                console.log("mp4 error : " + error);
                setErrors(getErrorText("metadata_table_error"))
            };


            let fileReader = new FileReader();
            fileReader.onload = () => {
                let arrayBuffer = fileReader.result;
                arrayBuffer.fileStart = 0;
                video.appendBuffer(arrayBuffer);
                video.flush();
            };

            var blob = null;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", mediaUrl);
            xhr.responseType = "blob";
            xhr.onload = function() {
                blob = xhr.response; //xhr.response is now a blob object
                fileReader.readAsArrayBuffer(blob);
            };
            xhr.send();
        };

        console.log(radioImage);
        if (radioImage)
            imageTreatment();
        else
            videoTreatment();

    }, [mediaUrl]);


    const submitUrl = () => {
        if (input){
            setMediaUrl(input);
        }
    };

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("metadata_content_title")}  </CustomTile>
                <Box m={1}/>
                <TextField
                    value={input}
                    id="standard-full-width"
                    label={keyword("metadata_content_input")}
                    style={{margin: 8}}
                    placeholder={""}
                    fullWidth
                    onChange={e => {
                        setInput(e.target.value)
                    }}
                />
                <Button>
                    <label htmlFor="fileInputMetadata">
                        <FolderOpenIcon/>
                        <Typography variant={"subtitle2"}>{keyword("button_localfile")}</Typography>
                    </label>
                    <input id="fileInputMetadata" type="file" hidden={true} onChange={e => {
                        setInput(URL.createObjectURL(e.target.files[0]))
                    }}/>
                </Button>
                <Box m={1}/>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                >
                    <RadioGroup aria-label="position" name="position" value={radioImage}
                                onChange={() => setRadioImage(!radioImage)} row>

                        <FormControlLabel
                            value={true}
                            control={<Radio color="primary"/>}
                            label={keyword("metadata_radio_image")}
                            labelPlacement="end"
                        />
                        <FormControlLabel
                            value={false}
                            control={<Radio color="primary"/>}
                            label={keyword("metadata_radio_video")}
                            labelPlacement="end"
                        />

                    </RadioGroup>
                </Grid>
                <Box m={2}/>
                <Button variant="contained" color="primary" onClick={submitUrl}>
                    {keyword("button_submit")}
                </Button>
            </Paper>
            {
                result &&
                <MetadataImageResult result={result}/>
            }
            <div>
                {
                    errors &&
                    <MySnackbar variant="error" message={getErrorText(errors)} onClick={() => setErrors(null)}/>
                }
            </div>
        </div>
    )
};
export default Metadata;