import React, { useState } from "react";
import { useSelector } from "react-redux";
//import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles"
//import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import tsvWarning from "../../../../LocalDictionary/components/Shared/OnWarningInfo.tsv";
//import { useParams } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as AnalysisIcon } from '../../../NavBar/images/SVG/Video/Video_analysis.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import UseGetDeepfake from "./Hooks/useGetDeepfake";
import DeepfakeResultsImage from "./Results/DeepfakeResultsImage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import Alert from "@material-ui/lab/Alert";

const Deepfake = () => {

    //const { url } = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Deepfake.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAlltools);
    const keywordWarning = useLoadLanguage("components/Shared/OnWarningInfo.tsv", tsvWarning);
    //const dispatch = useDispatch();

    
    const [input, setInput] = useState("");
    const [inputToSend, setInputToSend] = useState("");
    const [processUrl, setProcessUrl] = useState(false);
    
    const isLoading = useSelector(state => state.deepfakeImage.loading);
    const result = useSelector(state => state.deepfakeImage.result);
    const url = useSelector(state => state.deepfakeImage.url);

    //Selecting mode
    //============================================================================================

    const [selectedMode, setSelectedMode] = useState("");

    if (selectedMode !== "IMAGE") {
        setSelectedMode("IMAGE");
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

            <HeaderTool name={keywordAllTools("navbar_deepfake_image")} description={keywordAllTools("navbar_deepfake_image_description")} icon={<AnalysisIcon style={{ fill: "#51A5B2" }} />} />

            <Alert severity="warning">{keywordWarning("warning_beta")}</Alert>

            <Box m={3}/>
            
            <Card>
                <CardHeader
                    title={
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">

                            <span>{keyword("deepfake_image_link")}</span>

                        </Grid>
                    }
                    className={classes.headerUpladedImage}
                />

                <Box p={3} >



                    {selectedMode !== "" &&

                        <div>

                            <Box>

                                <Grid container
                                    direction="row"
                                    spacing={3}
                                    alignItems="center"
                                >

                                    <Grid item xs>
                                        <TextField
                                            id="standard-full-width"
                                            label={keyword("deepfake_image_link")}
                                            placeholder={keyword("deepfake_placeholder")}
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


            {result && 
                <DeepfakeResultsImage result={result} url={url} />
            }


        </div>);
};
export default Deepfake;