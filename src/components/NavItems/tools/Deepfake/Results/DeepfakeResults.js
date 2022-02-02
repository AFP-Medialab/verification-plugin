import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles"
//import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
//import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import MarkerIcon from '../../../../NavBar/images/SVG/Others/marker_location.svg';
import { Icon } from "leaflet";
import { CardMedia, Typography } from "@material-ui/core";
import { result } from "lodash";


const DeepfakeResutls = (props) => {

    const classes = useMyStyles();
    //const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
    const results = props.result;
    const url = props.url;
    const imgElement = React.useRef(null);

    const [recTop, setRecTop] = useState(null);
    const [recLeft, setRecLeft] = useState(null);
    const [recWidth, setRecWidth] = useState(null);
    const [recHeight, setRecHeight] = useState(null);

    const [rectangles, setRectangles] = useState(null);
    const [rectanglesReady, setRectanglesReady] = useState(false);


    console.log(results);


    const drawRectangles = () => {

        var imgHeight = imgElement.current.offsetHeight;
        var imgWidth = imgElement.current.offsetWidth;

        var rectanglesTemp = [];

        results.deepfake_image_report.info.forEach(element => {
            var rectangleAtributes = element.bbox;

            var elementTop = Math.round(rectangleAtributes.top * imgHeight);
            var elementLeft = Math.round(rectangleAtributes.left * imgWidth);
            var elementHeight = Math.round((rectangleAtributes.bottom - rectangleAtributes.top) * imgHeight);
            var elementWidth = Math.round((rectangleAtributes.right - rectangleAtributes.left) * imgWidth);

            var elementProbability = Math.round(element.prediction * 100);
            var elementBorderClass = null

            if (elementProbability>= 80){
                elementBorderClass = classes.deepfakeSquareBorderRed;
            }else{
                elementBorderClass = classes.deepfakeSquareBorderWhite;
            }
            
            var rectangle = {
                "top": elementTop,
                "left": elementLeft,
                "height": elementHeight,
                "width": elementWidth,
                "probability": elementProbability,
                "borderClass": elementBorderClass,

            }

            rectanglesTemp.push(rectangle);
        });

        setRectangles(rectanglesTemp);

    }

    if (rectangles !== null && !rectanglesReady){
        setRectanglesReady(true);
    }

    //console.log("Rectangles: ", rectangles);


    return (
        <div>
            
            <Card style={{overflow:"visible"}}>
                
                <CardHeader
                    style={{ borderRadius: "4px 4px 0px 0px"}}
                    title={"Image"}
                    className={classes.headerUpladedImage}
                />
                <div style={{position: "relative"}}>
                    
                    
                    {rectanglesReady &&rectangles.map((valueRectangle, keyRectangle) => {
                        return (
                            <div
                                key={keyRectangle}
                                className={classes.deepfakeSquare}
                                style={{
                                    top: valueRectangle.top,
                                    left: valueRectangle.left,
                                }}
                                >

                                <div
                                    className={valueRectangle.borderClass}
                                    style={{
                                        width: valueRectangle.width ,
                                        height: valueRectangle.height , 
                                    }} />

                                <Box 
                                    mt={2} 
                                    pl={4}
                                    pr={4}
                                    pt={2}
                                    pb={2} 
                                    style={{
                                        backgroundColor: "#ffffff", 
                                        borderRadius: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems:"center",
                                        minWidth:"120px"
                                        }}>
                                    <Typography variant="h3">{valueRectangle.probability}%</Typography>
                                    <Typography variant="h6" style={{ color: "#989898"}}>Deepfake</Typography>
                                </Box> 

                                </div>


                            
                        );
                    
                    })}
                   

                    <img 
                        src={url} 
                        style={{position: "absolute", left: "0px", top:"0px", width: "100%", height: "auto"}} 
                        ref={imgElement}
                        onLoad={() => drawRectangles()}/>


                </div>
            </Card>

        </div>);
};
export default DeepfakeResutls;


