import React from "react";
import Iframe from "react-iframe";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {useSelector} from "react-redux";

const LocalFile = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    return (
        <div>
            <Box m={2}/>
            <Box >
                <Iframe
                    url={"http://multimedia3.iti.gr/video_fragmentation/service/start.html"}
                    width="100%"
                    height="700px"
                />
            </Box>
        </div>
    );
};
export default LocalFile;