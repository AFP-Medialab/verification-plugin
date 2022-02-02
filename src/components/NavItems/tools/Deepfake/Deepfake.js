import React, { useState } from "react";
import { useSelector } from "react-redux";
//import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles"
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
//import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
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
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResutlsImage from "./Results/DeepfakeResultsImage";

const Deepfake = () => {

    //const { url } = useParams();
    const classes = useMyStyles();
    //const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAlltools);
    //const dispatch = useDispatch();

    
    const [input, setInput] = useState("");
    const [inputToSend, setInputToSend] = useState("");
    const [processUrl, setProcessUrl] = useState(false);
    
    const isLoading = useSelector(state => state.deepfake.loading);
    const result = useSelector(state => state.deepfake.result);
    const url = useSelector(state => state.deepfake.url);

    //Selecting mode
    //============================================================================================

    const [classButtonImage, setClassButtonImage] = useState(classes.bigButtonDiv);
    const [classButtonVideo, setClassButtonVideo] = useState(classes.bigButtonDiv);

    const [classIconImage, setClassIconImage] = useState(classes.bigButtonIcon);
    const [classIconVideo, setClassIconVideo] = useState(classes.bigButtonIcon);

    const [selectedMode, setSelectedMode] = useState("");

    if (classButtonImage !== classes.bigButtonDiv && classButtonVideo !== classes.bigButtonDiv) {

        setClassButtonImage(classes.bigButtonDiv);
        setClassButtonVideo(classes.bigButtonDiv);

        setClassIconImage(classes.bigButtonIcon);
        setClassIconVideo(classes.bigButtonIcon);

    }

    function clickImage() {
        changeStylesToImage();
        setSelectedMode("IMAGE");
    }

    function clickVideo() {
        changeStylesToVideo();
        setSelectedMode("VIDEO");
    }

    function changeStylesToVideo() {
        //Change styles of the video button to selected
        setClassButtonVideo(classes.bigButtonDivSelectted);
        setClassIconVideo(classes.bigButtonIconSelectted);

        //Change styles of the image button to not selected
        setClassButtonImage(classes.bigButtonDiv);
        setClassIconImage(classes.bigButtonIcon);
    }

    function changeStylesToImage() {
        //Change styles of the image button to selected
        setClassButtonImage(classes.bigButtonDivSelectted);
        setClassIconImage(classes.bigButtonIconSelectted);

        //Change styles of the video button to not selected
        setClassButtonVideo(classes.bigButtonDiv);
        setClassIconVideo(classes.bigButtonIcon);
    }



    //Submiting the URL
    //============================================================================================

    const submitUrl = () => {
        setProcessUrl(true);
        setInputToSend(input)
    };

    UseGetDeepfake(inputToSend, processUrl,selectedMode);
    

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

                            <Box p={3} className={classButtonImage} onClick={clickImage}>
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"

                                >
                                    <Grid item>
                                        <Box ml={1} mr={2}>
                                            <ImageOutlinedIcon className={classIconImage} />
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

                            <Box p={3} className={classButtonVideo} onClick={clickVideo}>
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"

                                >
                                    <Grid item>
                                        <Box ml={1} mr={2}>
                                            <TheatersRoundedIcon className={classIconVideo} />
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

                    {selectedMode !== "" &&

                        <div>

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
                                            disabled={selectedMode === "" || isLoading}
                                            onChange={e => setInput(e.target.value)}
                                        />

                                    </Grid>

                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={submitUrl} disabled={selectedMode === "" || input === "" || isLoading}>
                                            {"Submit"}
                                        </Button>

                                    </Grid>

                                </Grid>

                                {isLoading &&
                                    <Box mt={3}>
                                        <LinearProgress/>
                                    </Box> 
                                }


                            </Box>
                        </div>
                    }

                </Box>



            </Card>


            <Box m={3} />


            {result && selectedMode==="IMAGE" &&
                <DeepfakeResutlsImage result={result} url={url} />
            }

        </div>);
};
export default Deepfake;