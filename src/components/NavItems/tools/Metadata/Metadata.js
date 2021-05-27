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
import {useParams} from "react-router-dom";

import {CONTENT_TYPE, KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as MetadataIcon } from '../../../NavBar/images/SVG/Image/Metadata.svg';
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";


const Metadata = () => {
    const {url, type} = useParams();

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Metadata.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

    const resultUrl = useSelector(state => state.metadata.url);
    const resultData = useSelector(state => state.metadata.result);
    const resultIsImage = useSelector(state => state.metadata.isImage);

    const [radioImage, setRadioImage] = useState( true);
    const [input, setInput] = useState((resultUrl) ? resultUrl : "");
    const [imageUrl, setImageurl] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [urlDetected, setUrlDetected] = useState(false)


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

    useEffect( ()=> {
        // roundabout hack :: fix requires amending actions/reducer so a new state object is returned
        if (urlDetected) {
            submitUrl()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlDetected])

    useEffect(() => {
        if (type) {
            let content_type = decodeURIComponent(type)
            if (content_type === CONTENT_TYPE.VIDEO) {
                setRadioImage(false)
            } else if (content_type === CONTENT_TYPE.IMAGE) {
                setRadioImage(true)
            }
        }

        if (url && url !== KNOWN_LINKS.OWN) {
            let uri = decodeURIComponent(url)
            setInput(uri)
            setUrlDetected(true)
        }
    }, [url, type]);


    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_metadata")} description={keywordAllTools("navbar_metadata_description")} icon={<MetadataIcon style={{ fill: "#51A5B2" }} />} />

            <Card>
                <CardHeader
                    title={keyword("cardheader_source")}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>

                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid item xs>
                            <TextField
                                value={input}
                                id="standard-full-width"
                                label={keyword("metadata_content_input")}
                                placeholder={keyword("metadata_content_input_placeholder")}
                                fullWidth
                                variant="outlined"
                                onChange={e => setInput(e.target.value)}
                            />
                        </Grid>

                        <Grid item>
                            <RadioGroup aria-label="position" name="position" value={radioImage}
                                onChange={() => setRadioImage(!radioImage)} row>

                                <FormControlLabel
                                    value={true}
                                    control={<Radio color="primary" />}
                                    label={keyword("metadata_radio_image")}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value={false}
                                    control={<Radio color="primary" />}
                                    label={keyword("metadata_radio_video")}
                                    labelPlacement="end"
                                />

                            </RadioGroup>
                        </Grid>



                        <Grid item>
                            <Button variant="contained" color="primary" onClick={submitUrl}>
                                {keyword("button_submit")}
                            </Button>
                        </Grid>

                    </Grid>
                    
                    <Box m={1} />

                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid item>

                            <Button startIcon={<FolderOpenIcon />}>
                                <label htmlFor="fileInputMetadata">
                                    {keyword("button_localfile")}
                                </label>
                                <input id="fileInputMetadata" type="file" hidden={true} onChange={e => {
                                    setInput(URL.createObjectURL(e.target.files[0]));
                                }} />
                            </Button>
                        </Grid>

                        <Grid item xs>
                            <Typography variant="body">* {keyword("description_limitations")}</Typography>
                        </Grid>

                    </Grid>
                </Box>
            </Card>


            <Box m={3} />


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