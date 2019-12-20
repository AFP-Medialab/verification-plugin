import React, {useEffect, useState} from "react";
import axios from "axios";
import ReactMapGL, {Marker} from "react-map-gl"
import LocationOnIcon from '@material-ui/icons/LocationOn';

const MyMap = (props) => {

    const default_lat = 0;
    const default_long = 0;

    const [view, setView] = useState(
        {
            latitude: default_lat,
            longitude: default_long,
            width: "100%",
            height: "400px",
            zoom: 10
        }
    );

    const [markerLat, setMarkerLat] = useState(default_lat);
    const [markerLon, setMarkerLon] = useState(default_long);
    const [infoLink, setInfoLink] = useState("");


    useEffect(() => {
        if (!props.locations)
            return;
        const locationName = props.locations[0].location;
        console.log(locationName)
        setInfoLink(props.locations[0].wikipedia_url);
        axios.get("https://nominatim.openstreetmap.org/search?q=" + locationName + "&format=json")
            .then(response => {
                if (response.data.length > 0) {
                    let newViewport = view;
                    newViewport.latitude = parseFloat(response.data[0].lat);
                    newViewport.longitude = parseFloat(response.data[0].lon);
                    setView(newViewport);
                    setMarkerLat(parseFloat(response.data[0].lat));
                    setMarkerLon(parseFloat(response.data[0].lon));
                }
            })
            .catch(error => console.log(error))
    }, [(props.locations) ? props.locations.length : 0]);


    return (
        <ReactMapGL
            {...view}
            mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
            onViewportChange={view => setView(view)}
            mapStyle={"mapbox://styles/teebolt16/ck4cj4f5y13gw1cmmtboiklua"}
        >
            <Marker
                latitude={markerLat}
                longitude={markerLon}
                offsetTop={-24}
                offsetLeft={-12}
            >
                <LocationOnIcon
                    onClick={() => window.open(infoLink, "_blank")}
                />
            </Marker>
        </ReactMapGL>
    )
};
export default MyMap;