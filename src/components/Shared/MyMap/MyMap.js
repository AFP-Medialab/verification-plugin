import React, {useEffect, useState} from "react";
import axios from "axios";
import MapGL, {Marker} from "react-map-gl"
import LocationOnIcon from '@material-ui/icons/LocationOn';
import 'mapbox-gl/dist/mapbox-gl.css';


const MyMap = (props) => {

    const default_lat = 0;
    const default_long = 0;

    const [view, setView] = useState(
        {
            latitude: default_lat,
            longitude: default_long,
            width: "100%",
            height: "400px",
            zoom: 6
        }
    );

    const [markerLat, setMarkerLat] = useState(default_lat);
    const [markerLon, setMarkerLon] = useState(default_long);
    const [infoLink, setInfoLink] = useState("");


    useEffect(() => {
        if (!props.locations)
            return;
        const locationName = props.locations[0].location;
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
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(props.locations) ? props.locations.length : 0, props.locations]);


    return (
        <MapGL
            {...view}
            onViewportChange={view => setView(view)}
            mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v11"
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
        </MapGL>
    )
};
export default MyMap;