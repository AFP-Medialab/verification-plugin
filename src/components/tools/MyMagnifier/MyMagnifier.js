import {Paper} from "@material-ui/core";
import React, {useState} from "react";
import Loop from "./Loop";

const MyMagnifier = () => {

    const [zoom, setZoom] = useState(1.5);

    const updateZoom = () => {
        setZoom(0)
    };

    return (
        <Paper>
            <Loop/>
        </Paper>
    )
};
export default MyMagnifier;