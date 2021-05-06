import React from "react";
import Iframe from "react-iframe";
import Box from "@material-ui/core/Box";

const LocalFile = () => {
    return (
        <div>
            <Box m={2}/>
            <Box >
                <Iframe
                    frameBorder="0"
                    url={"http://mever.iti.gr/envisu4/"}
                    width="100%"
                    height="700px"
                />
            </Box>
        </div>
    );
};
export default LocalFile;