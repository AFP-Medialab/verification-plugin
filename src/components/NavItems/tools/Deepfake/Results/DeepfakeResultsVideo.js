import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles"
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { Grid, Typography } from "@material-ui/core";
const DeepfakeResutlsVideo = (props) => {

    const classes = useMyStyles();
    //const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
    const results = props.result;
    //const url = props.url;

    const [shotSelectedKey, setShotSelectedKey] = useState(-1);
    const [shotSelectedValue, setShotSelectedValue] = useState(null);
    const videoClip = React.useRef(null);

    function clickShot(value, key) {

        setShotSelectedKey(-1);
        setShotSelectedKey(key);
        setShotSelectedValue(value);

        videoClip.current.load();
    }



    console.log("Results", results);


    

    //console.log("Rectangles: ", rectangles);


    return (
        <div>

            <Box m={3} />

            <Grid
                container
                direction="column"
            >

                <Grid
                    item
                    container
                    direction="row"
                    spacing={3}
                >

                    <Grid
                        item xs={6}
                        container
                        direction="column"
                    >
                        <Typography variant="body1" style={{ color: "#51A5B2", fontSize: "24px", fontWeight: "500" }}>Video analyzed</Typography>

                        <Box m={1}/>

                        <video width="100%" height="auto" controls style={{ borderRadius: "10px", boxShadow:"0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"}}>
                            <source src={results.deepfake_video_report.video_path + "#t=2,4"} type="video/mp4"/>
                                Your browser does not support the video tag.
                        </video>



                    </Grid>

                    <Grid
                        item xs={6}
                        container
                        direction="column"
                    >
                        <Typography variant="body1" style={{ color: "#51A5B2", fontSize: "24px", fontWeight:"500" }}>Shots of the video</Typography>
                        <Box m={1} />

                        <Grid container spacing={3}>
                        {results.deepfake_video_report.results.map((valueShot, keyShot) => {

                            var shotStart = valueShot.shot_start;
                            var shotEnd = valueShot.shot_end;

                            var startMin = ('0' + Math.floor(shotStart / 60)).slice(-2);
                            var startSec = ('0' + shotStart % 60).slice(-2)
                            var endMin = ('0' + Math.floor(shotEnd / 60)).slice(-2);
                            var endSec = ('0' + shotEnd % 60).slice(-2);

    

                            return(

                                <Grid item xs={12} sm={4} key={keyShot}>

                                    {keyShot === shotSelectedKey 
                                    
                                        ?
                                        
                                        <Box
                                            onClick={() => clickShot(valueShot, keyShot)}
                                            style={{
                                                backgroundColor: "#51A5B2",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
                                            }}>
                                            <img alt="shot" src={valueShot.shot_image} style={{ width: "100%", height: "auto" }} />
                                            <Box mt={1} />
                                            <Typography variant="body1" style={{ fontSize: "14px", color: "#ffffff" }}>{startMin}:{startSec}{" - "}{endMin}:{endSec}</Typography>
                                            <Box mt={1} />

                                        </Box>

                                        :

                                        <Box
                                            onClick={() => clickShot(valueShot, keyShot)}
                                            style={{
                                                backgroundColor: "#ffffff",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
                                            }}>
                                            <img alt="shot" src={valueShot.shot_image} style={{ width: "100%", height: "auto" }} />
                                            <Box mt={1} />
                                            <Typography variant="body1" style={{ fontSize: "14px" }}>{startMin}:{startSec}{" - "}{endMin}:{endSec}</Typography>
                                            <Box mt={1} />

                                        </Box>

                                    }
                                    
                                    

                                </Grid>
                            )
                        })}

                        </Grid>



                    </Grid>



                </Grid>


            </Grid>

            <Box m={3} />

            <Card style={{ overflow: "visible" }}>

                <CardHeader
                    style={{ borderRadius: "4px 4px 0px 0px" }}
                    title={"Results of the shot"}
                    className={classes.headerUpladedImage}
                />
                <div>

                    <Box p={3}>

                    {shotSelectedKey === -1 
                        ?

                            <Grid
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                style={{height: "350px"}}
                            >
                                <Box p={4}>
                                    <Typography variant="h6" style={{ color: "#C9C9C9" }} align="center">
                                        Select a shot to see the analysis results of that shot
                                    </Typography>
                                </Box>

                            </Grid>



                        :

                            <Grid
                                container
                                direction="row"
                                spacing ={4}>

                                    <Grid item container direction="column" xs={6}>

                                        <Typography variant="h6">
                                            Video clip
                                        </Typography>

                                        <Box m={1}/>

                                        <video ref={videoClip} width="100%" height="auto" controls style={{ borderRadius: "10px", boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)" }}>
                                            <source src={results.deepfake_video_report.video_path + "#t=" + shotSelectedValue.shot_start + "," + shotSelectedValue.shot_end} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>

                                    </Grid>

                                    <Grid item container direction="column" xs={6} style={{ borderLeft: '0.1em solid #ECECEC'}}>

                                        <Typography variant="h6">
                                            Faces recognized
                                        </Typography>
                                        <Box m={1} />

                                        <Grid
                                            container
                                            direction="row"
                                            spacing={3}>

                                            {shotSelectedValue.face_image_paths.map((valueFace, keyFace) => {


                                                return(
                                                    <Grid item xs={12} sm={4} key={keyFace} style={{display: "flex",flexDirection: "column",alignItems: "center"}}>

                                                        <img alt="face" src={valueFace} style={{ width: "100%", height: "auto" }} />
                                                        <Box mt={1} />
                                                        <Typography variant="h3">{Math.round(shotSelectedValue.face_predictions[keyFace]*100)}%</Typography>
                                                        <Typography variant="h6" style={{ color: "#989898" }}>Deepfake</Typography>

                                                    </Grid>
                                                    
                                                )

                                            })}



                                        </Grid>


                                    </Grid>


                            </Grid>


                    }
                    </Box>

                </div>
            </Card>

        </div>);
};
export default DeepfakeResutlsVideo;


