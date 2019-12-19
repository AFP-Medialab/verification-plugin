import Map from 'pigeon-maps'
import Marker from 'pigeon-marker/react'
import React, {useEffect, useState} from "react";
import axios from "axios";


const MyMap = (props) => {

    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
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
                    setLat(response.data[0].lat);
                    setLon(response.data[0].lon);
                }
            })
            .catch(error => console.log(error))
    }, [(props.locations) ? props.locations.length : 0]);


    const handleMarkerClick = ({event, payload, anchor}) => {
        window.open(infoLink, "_blank")
    };

    console.log(lat, lon, infoLink)

    return (
        <div>
            <Map
                center={[lat, lon]}
                zoom={12}
                width={600}
                height={400}
            >
                <Marker
                    anchor={[lat, lon]}
                    payload={1}
                    onClick={handleMarkerClick}
                />
            </Map>
        </div>
    );
};
export default MyMap;