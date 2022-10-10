import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles"
//import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
//import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import MarkerIcon  from '../../../../NavBar/images/SVG/Others/marker_location.svg';
import { Icon } from "leaflet";
import { CardMedia, Typography } from "@mui/material";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";


const GeolocationResults = (props) => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Geolocalizer.tsv", tsv);
    const results = props.result[0];
    const urlImage = props.urlImage;

    const position = [results.latitude, results.longitude];


    return (
        <div>


            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                style={{flexWrap: "nowrap"}}
                spacing={3}
            >
                <Grid
                    item xs
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={3}
                >
                    <Grid item xs style={{ width: "100%" }}>

                        <Card>

                            <CardHeader
                                title={"Image"}
                                className={classes.headerUpladedImage}
                            />
                            <div className={classes.root2} >

                                <CardMedia
                                    style={{height:"400px", width: "auto", backgroundSize: "contain"}}
                                    image={urlImage}
                                />


                            </div>
                        </Card>
                        
                    </Grid>

                    

                    <Grid item xs style={{ width: "100%" }}>

                        <Card>

                            <CardHeader
                                title={keyword("geo_location")}
                                className={classes.headerUpladedImage}
                            />
                            <div className={classes.root2}>

                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    style={{ flexWrap: "nowrap" }}
                                    spacing={1}
                                >

                                    <Grid
                                        container
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                    >

                                        <Typography variant="body1" style={{ color: "#697684" }}>
                                            {keyword("geo_lat")}
                                        </Typography>

                                        <Typography variant="h5" >
                                            {position[0]}
                                        </Typography>

                                    </Grid>

                                    <Grid
                                        container
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                    >

                                        <Typography variant="body1" style={{ color: "#697684" }}>
                                            {keyword("geo_lon")}
                                        </Typography>

                                        <Typography variant="h5">
                                            {position[1]}
                                        </Typography>

                                    </Grid>

                                </Grid>

                                <Box m={4} />

                                <Button variant="outlined" color="primary" fullWidth onClick={() => window.open(("http://www.google.com/maps/place/" + position[0] + "," + position[1]), "_blank ")}> 
                                    {keyword("geo_maps")}
                                </Button>


                            </div>
                        </Card>

                    </Grid>



                </Grid>

                <Grid item xs>
                    <Card>

                        <CardHeader
                            title={keyword("geo_map")}
                            className={classes.headerUpladedImage}
                        />
                        <div className={classes.root2}>

                            <div>
                                <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ width: "100%", height: "638px" }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={position} icon={new Icon({ iconUrl: MarkerIcon, iconSize: [60, 60], iconAnchor: [30, 0] })}>
                                        <Popup>
                                            {keyword("geo_prediction")}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>


                        </div>
                    </Card>

                </Grid>

            </Grid>

               



            

        </div>);
};
export default GeolocationResults;


