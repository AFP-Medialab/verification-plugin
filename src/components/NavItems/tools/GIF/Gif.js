import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Paper from "@material-ui/core/Paper";
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


import Input from '@material-ui/core/Input';


import Dropzone from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

import { ReactComponent as IconGif } from '../../../NavBar/images/SVG/Image/Gif.svg';


import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import DragAndDrop from './DragAndDrop'




const Gif = () => {

    const classes = useMyStyles();


    const showHomo = useSelector(state => state.gif.showHomo);
    const homoImg1 = useSelector(state => state.gif.homoImg1);
    const homoImg2 = useSelector(state => state.gif.homoImg2);
    console.log(showHomo);

    const [readyToSend, setReadyToSend] = useState(false);
    const [filesToSend, setFilesToSend] = useState();

    const [image1, setImage1] = useState();

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
    


    
    /*

    const inputFileHandler = (event) => {
        console.log(event);
        setSelectedFile(event.target.files[0]);
        console.log(selectedFile);
    };

    const inputFileHandler2 = (event) => {
        setSelectedFile2(event.target.files[0]);
    };
    */

    useGetHomographics(filesToSend, showHomo);

    //useGetGif(filesToSend, showHomo);
    
    
    



    //Gif css
    //============================================================================================

    const [interval, setIntervalVar] = React.useState(null);

    if (showHomo && interval===null) {
        setIntervalVar(setInterval(() => animateFilter(), 1100));
    }

    function animateFilter() {
        //console.log("Loop function");
        //console.log(interval);
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
            label: 'Slow',
        },
        {
            value: -500,
            label: 'Fast',
        },
    ];

    const [speed, setSpeed] = React.useState(1100);

    function changeSpeed(value) {
        console.log("Change speed: " + value);
        setSpeed(value*-1);
    }

    function commitChangeSpeed(value) {
        console.log("Commit change speed: " + value);
        clearInterval(interval);
        setIntervalVar(setInterval(() => animateFilter(), (value)));

    }


    //Download GIF
    //============================================================================================
    const [filesForGif, setFilesForGif] = useState();
    const [delayGif, setDelayGif] = useState();

    useGetGif(filesForGif, delayGif);

    const handleDownloadGif = () => {
        var files = {
            "image1": homoImg1,
            "image2": homoImg2,
        }
        console.log(speed);
        setFilesForGif(files);
        setDelayGif(speed);
    };




    const { getRootProps, getInputProps } = useDropzone();

    const [imageDropped1, setImageDropped1] = useState();
    const [showDropZone1, setShowDropZone1] = useState(true);


    const [imageDropped2, setImageDropped2] = useState();
    const [showDropZone2, setShowDropZone2] = useState(true);

    const [selectedFile1, setSelectedFile1] = useState();
    const [selectedFile2, setSelectedFile2] = useState();


    const handleDrop = (files) => {
        console.log(files);
        var urlFile = URL.createObjectURL(files[0]);
        setImageDropped1(urlFile);
        setSelectedFile1(files[0]);
        setShowDropZone1(false)
    }
    
    const handleInput = (event) => {
        console.log(event);
        var urlFile = URL.createObjectURL(event.target.files[0]);
        setImageDropped1(urlFile);
        setSelectedFile1(event.target.files[0]);
        setShowDropZone1(false)
    }

    const handleDrop2 = (files) => {
        console.log(files);
        var urlFile = URL.createObjectURL(files[0]);
        setImageDropped2(urlFile);
        setSelectedFile2(files[0]);
        setShowDropZone2(false);
    }

    const handleInput2 = (event) => {
        console.log(event);
        var urlFile = URL.createObjectURL(event.target.files[0]);
        setImageDropped2(urlFile);
        setSelectedFile2(event.target.files[0]);
        setShowDropZone2(false)
    }

    if (imageDropped1 != null && imageDropped2 != null && !readyToSend) {
        setReadyToSend(true);
        console.log("Ready to send");
    }

    const handleSubmission = () => {
        var files = {
            "file1": selectedFile1,
            "file2": selectedFile2,
        }

        setFilesToSend(files);
    };

    /*

        <Dropzone onDrop={acceptedFiles => inputFileHandler(acceptedFiles)} >
                            {({ getRootProps, getInputProps }) => (
                                <section className={classes.dropContainer}>
                                    <div className={classes.dropZone} {...getRootProps() }>
                                        <input {...getInputProps()} />
                                        <p>Drop an image here, or click to choose a file</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>

                        <img src={image1} />



    */


    return (
        <div >
            <ThemeProvider theme={theme}>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
            >
                <IconGif fill={'primary'} style={{ fill: "#51A5B2" }}/>

                <Typography variant="h4" color={'primary'}>
                    Gif Generator
                </Typography>


            </Grid>

            <Box ml={1}>
            <Typography variant="body1">
                The GIF generator tool will create an animated GIF from two images that you choose
            </Typography>
                </Box>

            <Box m={3} />

            <Card>
                <CardHeader
                    title={
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center">

                            <span>Images for the GIF</span>

                        </Grid>
                    }
                    className={classes.headerUpladedImage}
                />

                {/*

                <Grid container spacing={3}>

                    <Grid item xs={6} >
                        <input
                            accept="image/*"
                            className={classes.input}
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="raised" component="span" className={classes.button}>
                                Upload
                            </Button>
                        </label>
                    </Grid>

                    <Grid item xs={6}>


                    </Grid>

style={{ height: 300, width: 250 }}

                </Grid>



                <input
                                                    accept="image/*"
                                                    className={classes.input}
                                                    style={{ display: 'none' }}
                                                    id="raised-button-file"
                                                    multiple
                                                    type="file"
                                                />
                                                <div>
                                                <label htmlFor="raised-button-file" className={classes.inputLabel}>
                                                        <span>Drop an image here or click to select an image</span>
                                                    </label>
                                                </div>



                                                <input type="file" name="file" onChange={(e) => inputFileHandler(e)} className={classes.inputInput}/>








                                                 <Box m={3} />

                    <Box p={2}>
                <div>

                    <input type="file" name="file" onChange={(e) => inputFileHandler(e)} />
                    <input type="file" name="file" onChange={(e) => inputFileHandler2(e)} />





                    <button onClick={handleSubmission} disabled={!readyToSend}>Create GIF</button>

                </div>
                    </Box>

                <Box m={1} />
                    
                    */}


                <Grid container spacing={3}>

                    <Grid item xs={6}>

                        <Box p={2}>

                            <Typography variant="h6" className={classes.headingGif}>
                                First image
                            </Typography>

                            <Box m={2}/>
                        
                            {!showDropZone1 &&
                                    <img src={imageDropped1} className={classes.imageDropped}/>
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
                                                    <label htmlFor="raised-button-file" className={classes.inputLabel}>
                                                        <span>Drop an image here or click to select an image</span>
                                                    </label>
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
                                Second image
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
                                                <label htmlFor="raised-button-file" className={classes.inputLabel}>
                                                    <span>Drop an image here or click to select an image</span>
                                                </label>
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
                        Create Gif
                    </Button>

                </Box>
                

               

            </Card>

            <Box m={3} />


            {showHomo && 
            <Card>

                <CardHeader
                    title={
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center">

                            <span>Generated GIF</span>

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
                            Speed of the animation
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
                            Download
                        </Button>
                    </Grid>


                </Box>
            </Card>
            }

            </ThemeProvider>
        </div>);
};
export default Gif;