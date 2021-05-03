import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Box from "@material-ui/core/Box";
import useGetHomographics from "./Hooks/useGetHomographics";
import useGetGif from "./Hooks/useGetGif";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Slider from '@material-ui/core/Slider';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import { ReactComponent as IconGif } from '../../../NavBar/images/SVG/Image/Gif.svg';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import DragAndDrop from './DragAndDrop'
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/CheckGIF.tsv";
import LinearProgress from '@material-ui/core/LinearProgress';


const Gif = () => {

    //Load of the TSV
    const keyword = useLoadLanguage("components/NavItems/tools/CheckGIF.tsv", tsv);

    //Style elements
    //============================================================================================
    const classes = useMyStyles();

    const theme = createMuiTheme({
        overrides: {

            MuiCardHeader: {
                root: {
                    backgroundColor: "#05A9B4",
                },
                title: {
                    color: 'white',
                    fontSize: 20,
                    fontweight: 500,
                }
            },

            MuiTab: {
                wrapper: {
                    fontSize: 12,

                },
                root: {
                    minWidth: "25%!important",
                }
            },

        },

        palette: {
            primary: {
                light: '#5cdbe6',
                main: '#05a9b4',
                dark: '#007984',
                contrastText: '#fff',
            },
        },

    });




    //Load images for the GIF 
    //============================================================================================

    const [imageDropped1, setImageDropped1] = useState();
    const [showDropZone1, setShowDropZone1] = useState(true);

    const [imageDropped2, setImageDropped2] = useState();
    const [showDropZone2, setShowDropZone2] = useState(true);

    const [selectedFile1, setSelectedFile1] = useState();
    const [selectedFile2, setSelectedFile2] = useState();

    const [readyToSend, setReadyToSend] = useState(false);
    const [filesToSend, setFilesToSend] = useState();
    const showHomo = useSelector(state => state.gif.showHomo);

    const loading = useSelector(state => state.gif.loading);


    //===  CODE FOR THE FIRST IMAGE ===
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


    //=== CODE FOR THE SECOND IMAGE ===
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

    //Code to enable the button to upload the images
    if (imageDropped1 != null && imageDropped2 != null && !readyToSend) {
        //console.log("Ready to send"); //DEBUG
        setReadyToSend(true);
    }

    //Function to prepare the files to trigger the submission
    const handleSubmission = () => {
        var files = {
            "file1": selectedFile1,
            "file2": selectedFile2,
        }

        setFilesToSend(files);
    };

    //Call to the API
    useGetHomographics(filesToSend, showHomo);

    //Loading bar
    if (loading && !readyToSend){
        setReadyToSend(false);
    }



    //GIF preview
    //============================================================================================

    const homoImg1 = useSelector(state => state.gif.homoImg1);
    const homoImg2 = useSelector(state => state.gif.homoImg2);

    const [interval, setIntervalVar] = React.useState(null);


    //=== CSS ANIMATION ===

    //Trigger of the loop function
    if (showHomo && interval === null) {
        setIntervalVar(setInterval(() => animateImages(), 1100));
    }

    //Loop function
    function animateImages() {
        //console.log("Loop function"); //DEBUG
        //console.log(interval); //DEBUG
        var x = document.getElementById("gifFilterElement");

        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    //=== SPEED SLIDER ===
    const [speed, setSpeed] = React.useState(1100);

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
        clearInterval(interval);
        setIntervalVar(setInterval(() => animateImages(), (value)));
    }

    


    //Download GIF
    //============================================================================================
    const [filesForGif, setFilesForGif] = useState();
    const [delayGif, setDelayGif] = useState();

    //Function to prepare the files to trigger the download
    const handleDownloadGif = () => {
        var files = {
            "image1": homoImg1,
            "image2": homoImg2,
        }
        setFilesForGif(files);
        setDelayGif(speed);
    };

    //Call to the API
    useGetGif(filesForGif, delayGif, true);



    //HTML Code
    //============================================================================================

    return (
        <div >
            <ThemeProvider theme={theme}>

                {//=== Title ===
                }

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >

                    <IconGif style={{ fill: "#51A5B2" }} />
                    <Typography variant="h4" color={'primary'}>
                        {keyword("checkGIF_title")}
                    </Typography>

                </Grid>

                <Box ml={1}>
                    <Typography variant="body1">
                        The GIF generator tool will create an animated GIF from two images that you choose
                    </Typography>
                </Box>
                <Box m={3} />

                {//=== Load of the images ===
                }

                <Card>
                    <CardHeader
                        title={
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center">

                                <span>{keyword("cardTitle_images")}</span>

                            </Grid>
                        }
                        className={classes.headerUpladedImage}
                    />

                        
                    <Grid container spacing={3}>

                        <Grid item xs={6}>
                            <Box p={2}>

                                <Typography variant="h6" className={classes.headingGif}>
                                    {keyword("title_image1")}
                                </Typography>

                                <Box m={2} />

                                {!showDropZone1 &&
                                    <img src={imageDropped1} className={classes.imageDropped} />
                                }

                                {showDropZone1 &&
                                    <DragAndDrop handleDrop={(files) => handleDrop(files)}>

                                        <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            alignItems="center"
                                            justify="center"
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

                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box p={2}>

                                <Typography variant="h6" className={classes.headingGif}>
                                    {keyword("title_image2")}
                                </Typography>

                                <Box m={2} />

                                {!showDropZone2 &&
                                    <img src={imageDropped2} className={classes.imageDropped} />
                                }

                                {showDropZone2 &&
                                    <DragAndDrop handleDrop={(files) => handleDrop2(files)}>

                                        <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            alignItems="center"
                                            justify="center"
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

                            </Box>
                        </Grid>

                    </Grid>

                    <Box p={2}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmission} disabled={!readyToSend}>
                            {keyword("button_loadImages")}
                        </Button>
                    </Box>

                    {loading &&
                        <LinearProgress />
                    }

                </Card>

                <Box m={3} />

                {//=== Preview of the GIF ===
                }

                {showHomo &&
                    <Card>

                        <CardHeader
                            title={
                                <Grid
                                    container
                                    direction="row"
                                    justify="space-between"
                                    alignItems="center">

                                    <span>{keyword("cardTitle_generatedGIF")}</span>

                                </Grid>
                            }
                            className={classes.headerUpladedImage}
                        />


                        <Box p={3}>


                            <Box justifyContent="center" className={classes.wrapperImageFilter}>

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
                                justify="center"
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


                                <Button variant="contained" color="primary" fullWidth onClick={(e) => handleDownloadGif(e)}>
                                    {keyword("button_download")}
                                </Button>
                            </Grid>


                        </Box>
                    </Card>
                }

            </ThemeProvider>
        </div>);
};
export default Gif;