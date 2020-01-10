import {Paper} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import 'tui-image-editor/dist/tui-image-editor.css'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Grid from "@material-ui/core/Grid";
import MetadataImageResult from "./Results/MetadataImageResult";
import MetadataVideoResult from "./Results/MetadataVideoResult";
import useImageTreatment from "./Hooks/useImageTreatment";
import useVideoTreatment from "./Hooks/useVideoTreatment";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Metadata.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";

const Metadata = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Metadata.tsv", tsv);
    const resultUrl = useSelector(state => state.metadata.url);
    const resultData = useSelector(state => state.metadata.result);
    const resultIsImage = useSelector(state => state.metadata.isImage);

    const [radioImage, setRadioImage] = useState(true);
    const [input, setInput] = useState((resultUrl) ? resultUrl : "");
    const [imageUrl, setImageurl] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);

    useVideoTreatment(videoUrl);
    useImageTreatment(imageUrl);

    const submitUrl = () => {
        if (input) {
            submissionEvent(input);
            if (radioImage) {
                setImageurl(input);
            } else {
                setVideoUrl(input);
            }
        }
    };

    useEffect(() => {
        setVideoUrl(null)
    },[videoUrl]);

    useEffect(() => {
        setImageurl(null)
    }, [imageUrl]);

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("metadata_content_title")}/>
                <Box m={1}/>
                <TextField
                    value={input}
                    id="standard-full-width"
                    label={keyword("metadata_content_input")}
                    style={{margin: 8}}
                    placeholder={""}
                    fullWidth
                    onChange={e => setInput(e.target.value)}
                />
                <Button>
                    <label htmlFor="fileInputMetadata">
                        <FolderOpenIcon/>
                        <Typography variant={"subtitle2"}>{keyword("button_localfile")}</Typography>
                    </label>
                    <input id="fileInputMetadata" type="file" hidden={true} onChange={e => {
                        setInput(URL.createObjectURL(e.target.files[0]));
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
                (resultData) ?
                    (
                        (resultIsImage) ?
                        <MetadataImageResult result={resultData} image={resultUrl}/>
                        :
                        <MetadataVideoResult result={resultData}/>
                        )
                    :
                    null
            }
        </div>
    )
};
export default Metadata;