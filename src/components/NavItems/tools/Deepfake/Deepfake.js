import React, { useState } from "react";
import { useSelector } from "react-redux";
//import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles"
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
//import { useParams } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as AnalysisIcon } from '../../../NavBar/images/SVG/Video/Video_analysis.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import TheatersRoundedIcon from '@material-ui/icons/TheatersRounded';
import { Divider, Typography } from "@material-ui/core";
import UseDeepfakeImage from "./Hooks/useGetDeepfakeImage";
import DeepfakeResutls from "./Results/DeepfakeResults";

const Deepfake = () => {

    //const { url } = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAlltools);
    //const dispatch = useDispatch();

    
    const [input, setInput] = useState("");
    const [processUrl, setProcessUrl] = useState(false);
    
    const isLoading = useSelector(state => state.deepfake.loading);
    const result = useSelector(state => state.deepfake.result);
    const url = useSelector(state => state.deepfake.url);

    //Selecting mode
    //============================================================================================

    const [classButtonURL, setClassButtonURL] = useState(classes.bigButtonDiv);
    const [classButtonLocal, setClassButtonLocal] = useState(classes.bigButtonDiv);

    const [classIconURL, setClassIconURL] = useState(classes.bigButtonIcon);
    const [classIconLocal, setClassIconLocal] = useState(classes.bigButtonIcon);

    const [selectedMode, setSelectedMode] = useState("");

    if (classButtonURL !== classes.bigButtonDiv && classButtonLocal !== classes.bigButtonDiv) {

        setClassButtonURL(classes.bigButtonDiv);
        setClassButtonLocal(classes.bigButtonDiv);

        setClassIconURL(classes.bigButtonIcon);
        setClassIconLocal(classes.bigButtonIcon);

    }

    function clickURL() {
        changeStylesToUrl();
        setSelectedMode("URL");
    }

    function clickLocal() {
        changeStylesToLocal();
        setSelectedMode("LOCAL");
    }

    function changeStylesToLocal() {
        //Change styles of the local button to selected
        setClassButtonLocal(classes.bigButtonDivSelectted);
        setClassIconLocal(classes.bigButtonIconSelectted);

        //Change styles of the URL button to not selected
        setClassButtonURL(classes.bigButtonDiv);
        setClassIconURL(classes.bigButtonIcon);
    }

    function changeStylesToUrl() {
        //Change styles of the url button to selected
        setClassButtonURL(classes.bigButtonDivSelectted);
        setClassIconURL(classes.bigButtonIconSelectted);

        //Change styles of the Local button to not selected
        setClassButtonLocal(classes.bigButtonDiv);
        setClassIconLocal(classes.bigButtonIcon);
    }



    //Submiting the URL
    //============================================================================================

    const submitUrl = () => {
        setProcessUrl(true);
    };

    UseDeepfakeImage(input, processUrl);
    

    return (
        <div>

            <HeaderTool name={keywordAllTools("navbar_deepfake")} description={keywordAllTools("navbar_deepfake_description")} icon={<AnalysisIcon style={{ fill: "#51A5B2" }} />} />

            <Card>
                <CardHeader
                    title={
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">

                            <span>Media type</span>

                        </Grid>
                    }
                    className={classes.headerUpladedImage}
                />

                <Box p={3} >

                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={6}>

                            <Box p={3} className={classButtonURL} onClick={clickURL}>
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"

                                >
                                    <Grid item>
                                        <Box ml={1} mr={2}>
                                            <ImageOutlinedIcon className={classIconURL} />
                                        </Box>

                                    </Grid>

                                    <Grid item>
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                        >
                                            <Grid item>
                                                <Typography variant="body1" style={{ fontWeight: 600 }}>Image</Typography>
                                            </Grid>

                                            <Box mt={1} />

                                            <Grid item>
                                                <Typography variant="body1">Analyze if an image contains deepfakes</Typography>
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Box>

                        </Grid>


                        <Grid item xs={6}>

                            <Box p={3} className={classButtonLocal} onClick={clickLocal}>
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"

                                >
                                    <Grid item>
                                        <Box ml={1} mr={2}>
                                            <TheatersRoundedIcon className={classIconLocal} />
                                        </Box>

                                    </Grid>

                                    <Grid item>
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                        >
                                            <Grid item>
                                                <Typography variant="body1" style={{ fontWeight: 600 }}>Video</Typography>
                                            </Grid>

                                            <Box mt={1} />

                                            <Grid item>
                                                <Typography variant="body1">Analyze if a video contians a deepfake</Typography>
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Box>

                        </Grid>

                    </Grid>

                    <Box mt={4} mb={4}>
                        <Divider />
                    </Box>


                    <Box m={1} />
                    <Box>

                        <Grid container
                            direction="row"
                            spacing={3}
                            alignItems="center"
                        >

                            <Grid item xs>
                                <TextField
                                    id="standard-full-width"
                                    label={"Media URL"}
                                    placeholder={"Paste the URL here"}
                                    fullWidth
                                    value={input}
                                    variant="outlined"
                                    onChange={e => setInput(e.target.value)}
                                />

                            </Grid>

                            <Grid item>
                                <Button variant="contained" color="primary" onClick={submitUrl}>
                                    {"Submit"}
                                </Button>

                            </Grid>

                        </Grid>

                        {isLoading &&
                            <Box m={3}>
                                <LinearProgress/>
                            </Box> 
                        }


                    </Box>

                </Box>



            </Card>


            <Box m={3} />


            {result &&
                <DeepfakeResutls result={result} url={url} />
            }

        </div>);
};
export default Deepfake;