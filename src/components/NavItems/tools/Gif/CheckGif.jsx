import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Box from "@mui/material/Box";
import useGetHomographics from "./Hooks/useGetHomographics";
import useGetGif from "./Hooks/useGetGif";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Slider from '@mui/material/Slider';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import IconGif from '../../../NavBar/images/SVG/Image/Gif.svg';
import DragAndDrop from './DragAndDrop'
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/CheckGIF.tsv";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import LinkIcon from '@mui/icons-material/Link';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { setStateSelectingLocal, setStateSelectingUrl, setStateReady, setStateInit } from "../../../../redux/reducers/tools/gifReducer";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";


const CheckGif = () => {
    //Init variables
    //============================================================================================
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/CheckGIF.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAlltools);
    const toolState = useSelector(state => state.gif.toolState);
    const dispatch = useDispatch();


    //Selecting mode
    //============================================================================================

    const [classButtonURL, setClassButtonURL] = useState(classes.bigButtonDiv);
    const [classButtonLocal, setClassButtonLocal] = useState(classes.bigButtonDiv);
    
    const [classIconURL, setClassIconURL] = useState(classes.bigButtonIcon);
    const [classIconLocal, setClassIconLocal] = useState(classes.bigButtonIcon);

    const [selectedMode, setSelectedMode] = useState("");
    
    if (toolState === 1 && classButtonURL !== classes.bigButtonDiv && classButtonLocal !== classes.bigButtonDiv) {

        setClassButtonURL(classes.bigButtonDiv);
        setClassButtonLocal(classes.bigButtonDiv);

        setClassIconURL(classes.bigButtonIcon);
        setClassIconLocal(classes.bigButtonIcon);

    }

    function clickURL () {
        changeStylesToUrl();
        dispatch(setStateSelectingUrl());
        setSelectedMode("URL");
        cleanInputs();
    }

    function clickLocal (){
        changeStylesToLocal();
        dispatch(setStateSelectingLocal());
        setSelectedMode("LOCAL");
        cleanInputs();
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





    //Load images for the GIF 
    //============================================================================================

    //1=Images | 2=URL
    const [modeHomo, setModeHomo] = useState(0);

    const [imageDropped1, setImageDropped1] = useState(null);
    const [showDropZone1, setShowDropZone1] = useState(true);

    const [imageDropped2, setImageDropped2] = useState(null);
    const [showDropZone2, setShowDropZone2] = useState(true);

    const [selectedFile1, setSelectedFile1] = useState();
    const [selectedFile2, setSelectedFile2] = useState();
    const [filesToSend, setFilesToSend] = useState();


    //--- Local files mode ---

    //FIRST IMAGE

    //Load by drop
    const handleDrop = (files) => {
        //console.log(files);//DEBUG
        var urlFile = URL.createObjectURL(files[0]);
        setImageDropped1(urlFile);
        setSelectedFile1(files[0]);
        setShowDropZone1(false)
    }

    //Load by Click
    const handleInput = (event) => {
        //console.log(event);//DEBUG
        var urlFile = URL.createObjectURL(event.target.files[0]);
        setImageDropped1(urlFile);
        setSelectedFile1(event.target.files[0]);
        setShowDropZone1(false)
    }



    //SECOND IMAGE

    //Load by drop
    const handleDrop2 = (files) => {
        //console.log(files);//DEBUG
        var urlFile = URL.createObjectURL(files[0]);
        setImageDropped2(urlFile);
        setSelectedFile2(files[0]);
        setShowDropZone2(false);
    }

    //Load by clikc
    const handleInput2 = (event) => {
        //console.log(event);//DEBUG
        var urlFile = URL.createObjectURL(event.target.files[0]);
        setImageDropped2(urlFile);
        setSelectedFile2(event.target.files[0]);
        setShowDropZone2(false)
    }

    //Remove image1
    const removeImage1 = () => {
        setImageDropped1(null);
        setSelectedFile1(null);
        setShowDropZone1(true)
    }

    //Remove image1
    const removeImage2 = () => {
        setImageDropped2(null);
        setSelectedFile2(null);
        setShowDropZone2(true)
    }



    //--- URL mode ---  

    //URL
    const [imageURL1, setImageURL1] = useState("");
    const [imageURL2, setImageURL2] = useState("");

    
    //Code to enable the button to upload the images
   /* if (toolState === 22 && imageURL1 !== "" && imageURL2 !== "") {
        //console.log("Ready to send"); //DEBUG
        dispatch(setStateReady());
    }*/

    //Code to enable the button to upload the images
   /* if (toolState === 21 && imageDropped1 !== null && imageDropped2 !== null) {
        //console.log("Ready to send"); //DEBUG
        dispatch(setStateReady());
    }*/

    useEffect(() => {
        if (toolState === 22 && imageURL1 !== "" && imageURL2 !== "") {
            //console.log("Ready to send"); //DEBUG
            dispatch(setStateReady());
        }
        if (toolState === 21 && imageDropped1 !== null && imageDropped2 !== null) {
            //console.log("Ready to send"); //DEBUG
            dispatch(setStateReady());
        }
    }, [toolState, imageDropped1, imageDropped2, imageURL1, imageURL2])
    
    //Function to prepare the files to trigger the submission
    const handleSubmissionURL = () => {
        submissionEvent(imageURL1);
        submissionEvent(imageURL2);
        var files = {
            "url_0": imageURL1,
            "url_1": imageURL2,
        }
        setModeHomo(2);
        setFilesToSend(files);
    };


    const handleSubmission = () => {
        submissionEvent(selectedFile1);
        submissionEvent(selectedFile2);
        var files = {
            "file1": selectedFile1,
            "file2": selectedFile2,
        }
        setModeHomo(1);
        setFilesToSend(files);
    };

    //Call to the API
    useGetHomographics(filesToSend, modeHomo, keyword);

    if(toolState === 6){
        cleanInputs();
        if (selectedMode === "URL"){
            dispatch(setStateSelectingUrl());
        } else if (selectedMode === "LOCAL"){
            dispatch(setStateSelectingLocal());
        }
    }



    //GIF preview
    //============================================================================================

    const homoImg1 = useSelector(state => state.gif.homoImg1);
    const homoImg2 = useSelector(state => state.gif.homoImg2);

    const [interval, setIntervalVar] = React.useState(null);

    //=== SPEED SLIDER ===
    const [speed, setSpeed] = React.useState(1100);


    //=== CSS ANIMATION ===

    //Trigger of the loop function
    useEffect(() => {
        if (toolState === 5 && (interval === null || interval === undefined)) {
                setIntervalVar(setInterval(() => animateImages(), speed));
        }
        return () => {
            if(interval !==null ){
                clearInterval(interval); 
                setIntervalVar(null);
            }
        }
    // eslint-disable-next-line
    }, [setIntervalVar, interval, toolState, speed]);
    

    //Loop function
    function animateImages() {
        //console.log("Loop function" + interval); //DEBUG
        //console.log(interval); //DEBUG
        var x = document.getElementById("gifFilterElement");

        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    const marks = [
        {
            value: -1700,
            label: keyword("slider_label_slow"),
        },
        {
            value: -500,
            label: keyword("slider_label_fast"),
        },
    ];

    //On hold function (while sliding this function is triggered)
    function changeSpeed(value) {
        //console.log("Change speed: " + value); //DEBUG
        setSpeed(value * -1);
    }

    //On release function (when the click is released this function is triggered)
    function commitChangeSpeed(value) {
        //console.log("Commit change speed: " + value); //DEBUG
        //clearInterval(interval);
        setIntervalVar(setInterval(() => animateImages(), (value)));
    }

    function stopLoop() {
        clearInterval(interval);
    }

    


    //Download GIF
    //============================================================================================
    const [filesForGif, setFilesForGif] = useState(null);
    const [delayGif, setDelayGif] = useState(null);
    const [enableDownload, setEnableDownload] = useState(false);
    const [downloadType, setDownloadType] = useState(null);

    //Function to prepare the files to trigger the download
    const handleDownload = (type) => {
        //console.log(toolState);
        var files = {
            "image1": homoImg1,
            "image2": homoImg2,
        }
        
        setFilesForGif(files);
        setDelayGif(speed);
        setEnableDownload(true);
        setDownloadType(type)
    };

    //console.log(filesForGif);
    //console.log(delayGif);
    //console.log(toolState);
    //Call to the API    

    useGetGif(filesForGif, delayGif, enableDownload, downloadType);
    if (toolState === 7 && enableDownload) {
        setEnableDownload(false);
    }
    


    //Reset states
    //============================================================================================


    const newGif = (event) => {
        stopLoop();
        cleanInputs();
        
        setClassButtonURL(classes.bigButtonDiv);
        setClassIconURL(classes.bigButtonIcon);

        setClassButtonLocal(classes.bigButtonDiv);
        setClassIconLocal(classes.bigButtonIcon);

        dispatch(setStateInit());
    }


    function cleanInputs() {
        setImageDropped1(null);
        setSelectedFile1(null);
        setShowDropZone1(true);

        setImageDropped2(null);
        setSelectedFile2(null);
        setShowDropZone2(true);

        setImageURL1("");
        setImageURL2("");

        setFilesToSend(null);
        setModeHomo(0);

        //setFilesForGif(null); 
        //setDelayGif(null);
    }

    useEffect(() => {
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
            //console.log("Stop loop "  + interval);
            clearInterval(interval);
            newGif();
        }
    // eslint-disable-next-line
    }, [])


    //HTML Code
    //============================================================================================

    return (
        <div >
            

                {//=== Title ===
                }

                <HeaderTool name={keywordAllTools("navbar_gif")} description={keywordAllTools("navbar_gif_description")} icon={<IconGif style={{ fill: "#51A5B2" }} width="40px" height="40px"/>} advanced="true" />
            

                {//=== Load of the images ===
                }

               
                <Card>
                    <CardHeader
                        title={
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center">

                            <span>{keyword("cardTitle_source")}</span>

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
                                                <LinkIcon className={classIconURL} />
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
                                                    <Typography variant="body1" style={{ fontWeight: 600 }}>{keyword("title_URL")}</Typography>
                                                </Grid>

                                                <Box mt={1} />

                                                <Grid item>
                                                    <Typography variant="body1">{keyword("description_URL")}</Typography>
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
                                                <FileIcon className={classIconLocal} />
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
                                                    <Typography variant="body1" style={{ fontWeight: 600 }}>{keyword("title_local")}</Typography>
                                                </Grid>

                                                <Box mt={1} />

                                                <Grid item>
                                                    <Typography variant="body1">{keyword("description_local")}</Typography>
                                                </Grid>

                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Box>

                            </Grid>

                        </Grid>

                    </Box>

                    

                </Card>

                <Box m={3} />

                {(toolState >= 2) &&

                <Card>
                    <CardHeader
                        title={
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center">

                                <span>{keyword("title_gifcreation")}</span>

                                <Button variant="contained" style={{ backgroundColor: "#FFFFFF",  color:'black'}} onClick={newGif}>
                                    {keyword("button_new")}
                                </Button>

                            </Grid>
                        }
                        className={classes.headerUpladedImage}
                    />

                    <Box p={3} >

                        <Grid container spacing={3}>
                            <Grid item xs={6} style={{ borderRight: '0.1em solid #ECECEC', padding: '0.5em' }}>
                                <Box p={2}>

                                {(selectedMode === "LOCAL") &&
                                    <div>
                                        <Typography variant="h6" className={classes.headingGif}>
                                            {keyword("title_image1")}
                                        </Typography>

                                        <Box m={2} />

                                        {!showDropZone1 &&
                                            < Grid
                                                container
                                                spacing={1}
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="flex-start"

                                            >
                                                <img src={imageDropped1} className={classes.imageDropped} alt="" />
                                                <IconButton onClick={removeImage1}>
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        }

                                        {showDropZone1 &&
                                            <DragAndDrop handleDrop={(files) => handleDrop(files)}>

                                                <Grid
                                                    container
                                                    spacing={0}
                                                    direction="column"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    className={classes.dropZone}
                                                    
                                                >

                                                    <Grid item className={classes.inputContainer}>
                                                        <input
                                                            accept="image/*"
                                                            className={classes.input}
                                                            style={{ display: 'none' }}
                                                            id="raised-button-file"
                                                            multiple
                                                            type="file"
                                                            onChange={(e) => handleInput(e)}
                                                        />
                                                        <div>
                                                            <Box textAlign="center">
                                                                <label htmlFor="raised-button-file" className={classes.inputLabel}>
                                                                    <span>{keyword("body_droparea")}</span>
                                                                </label>
                                                            </Box>
                                                        </div>

                                                    </Grid>

                                                </Grid>

                                            </DragAndDrop>
                                        }

                                        <Box m={4} />

                                        <Typography variant="h6" className={classes.headingGif}>
                                            {keyword("title_image2")}
                                        </Typography>

                                        <Box m={2} />

                                        {!showDropZone2 &&
                                            <Grid
                                                container
                                                spacing={1}
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="flex-start"

                                            >
                                                <img src={imageDropped2} className={classes.imageDropped} alt="" />
                                                <IconButton onClick={removeImage2}>
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        }

                                        {showDropZone2 &&
                                            <DragAndDrop handleDrop={(files) => handleDrop2(files)}>

                                                <Grid
                                                    container
                                                    spacing={0}
                                                    direction="column"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    className={classes.dropZone}
                                                >

                                                    <Grid item className={classes.inputContainer}>
                                                        <input
                                                            accept="image/*"
                                                            className={classes.input}
                                                            style={{ display: 'none' }}
                                                            id="raised-button-file"
                                                            multiple
                                                            type="file"
                                                            onChange={(e) => handleInput2(e)}
                                                        />
                                                        <div>
                                                            <Box p={2} textAlign="center">
                                                                <label htmlFor="raised-button-file" className={classes.inputLabel}>
                                                                    <span>{keyword("body_droparea")}</span>
                                                                </label>
                                                            </Box>
                                                        </div>
                                                    </Grid>

                                                </Grid>

                                            </DragAndDrop>
                                        }

                                        <Box m={4} />

                                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmission} disabled={toolState!==3}>
                                            {keyword("button_loadImages")}
                                        </Button>
                                    </div>
                                }

                                {(selectedMode === "URL") &&
                                    <div>
                                        <Typography variant="h6" className={classes.headingGif}>
                                            {keyword("title_image1")}
                                        </Typography>

                                        <Box m={2} />
                                        
                                        <TextField
                                            id="outlined-multiline-static"
                                            label={keyword("input_label1")}
                                            placeholder={keyword("input_placeholder")}
                                            multiline
                                            rows={8}
                                            fullWidth
                                            variant="outlined"
                                            onChange={e => {
                                                setImageURL1(e.target.value)
                                            }}
                                        />
                                        

                                        <Box m={4} />

                                        <Typography variant="h6" className={classes.headingGif}>
                                            {keyword("title_image2")}
                                        </Typography>

                                        <Box m={2} />

                                        <TextField
                                            id="outlined-multiline-static"
                                            label={keyword("input_label2")}
                                            placeholder={keyword("input_placeholder")}
                                            multiline
                                            rows={8}
                                            fullWidth
                                            variant="outlined"
                                            onChange={e => {
                                                setImageURL2(e.target.value)
                                            }}
                                        />

                                        <Box m={4} />

                                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmissionURL} disabled={toolState !== 3}>
                                            {keyword("button_loadImages")}
                                        </Button>
                                        
                                    </div>
                                }

                                </Box>

                            </Grid>


                            <Grid item xs={6} style={{ padding: '0.5em' }}>
                                
                                

                                    {(toolState === 21 || toolState === 22 || toolState === 3) &&
                                        
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                            className={classes.height100}
                                        >
                                                <IconGif style={{ fill: "#C9C9C9" }} />
                                                <Box p={4}>
                                                    <Typography variant="h6" style={{ color: "#C9C9C9" }} align="center">
                                                        {keyword("text_preview")}
                                                    </Typography>
                                                </Box>
                                        
                                        </Grid>
                                    }

                                    {toolState === 4 &&
                                        <Grid
                                            container
                                            direction="column"
                                            justifyContent="center"
                                            alignItems="center"
                                            className={classes.height100}
                                        >
                                            <CircularProgress />
                                        </Grid>
                                    }

                                    {(toolState === 5 || toolState === 7) &&

                                        <Box p={2} className={classes.height100}>

                                        
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="space-between"
                                                alignItems="flex-start"
                                                className={classes.height100}
                                            >
                                                
                                                <Typography variant="h6" className={classes.headingGif}>
                                                    {keyword("title_preview")}
                                                </Typography>

                                                <Box justifyContent="center" className={classes.wrapperImageFilter} style ={{width: "100%"}}>
                                                    <CardMedia
                                                        component="img"
                                                        className={classes.imagesGifImage}
                                                        image={homoImg1}
                                                    />
                                                    {true &&
                                                        <CardMedia
                                                            component="img"
                                                            className={classes.imagesGifFilter}
                                                            image={homoImg2}
                                                            id="gifFilterElement"
                                                        />
                                                    }
                                                </Box>



                                                <Grid
                                                    container
                                                    direction="column"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                >
                                                    <Box m={4} />

                                                    <Typography gutterBottom>
                                                        {keyword("slider_title")}
                                                    </Typography>


                                                    <Slider
                                                        defaultValue={-1100}
                                                        aria-labelledby="discrete-slider"
                                                        step={300}
                                                        marks={marks}
                                                        min={-1700}
                                                        max={-500}
                                                        scale={x => -x}
                                                        onChange={(e, val) => changeSpeed(val)}
                                                        onChangeCommitted={(e) => commitChangeSpeed(speed)}
                                                        className={classes.sliderClass}
                                                    />



                                                    <Box m={2} />

                                                    <Grid item container
                                                        spacing={3} justifyContent="space-evenly">
                                                        <Grid item>
                                                            <Button variant="contained" color="primary" disabled={toolState===7}  onClick={(e) => handleDownload("gif")}>
                                                                {keyword("button_download")}
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button variant="contained" color="primary" disabled={toolState===7}  onClick={(e) => handleDownload("mp4")}>
                                                                {keyword("button_video")}
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                    
                                                    <Box m={2} />
                                                </Grid>

                                            
                                            </Grid>
                                        </Box>

                                    }

                            </Grid>

                        </Grid>

                    </Box>

                </Card>
                }
               
                
        </div>);
};
export default CheckGif;