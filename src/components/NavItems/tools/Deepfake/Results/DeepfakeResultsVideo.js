import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles"
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { Typography } from "@material-ui/core";


const DeepfakeResutlsVideo = (props) => {

    const classes = useMyStyles();
    //const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
    const results = props.result;
    const url = props.url;
    const imgElement = React.useRef(null);

    const [rectangles, setRectangles] = useState(null);
    const [rectanglesReady, setRectanglesReady] = useState(false);


    console.log(results);


    

    //console.log("Rectangles: ", rectangles);


    return (
        <div>

            <Card style={{ overflow: "visible" }}>

                <CardHeader
                    style={{ borderRadius: "4px 4px 0px 0px" }}
                    title={"Video"}
                    className={classes.headerUpladedImage}
                />
                <div>


                    

                </div>
            </Card>

        </div>);
};
export default DeepfakeResutlsVideo;


