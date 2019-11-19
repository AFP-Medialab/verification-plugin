import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import {useParams} from 'react-router-dom'
import {useDispatch} from "react-redux";
import {selectTool} from "../../../redux/actions";
import AllTools from "../../tools/Alltools/AllTools";
import Analysis from "../../tools/analysis/Analysis";
import Keyframes from "../../tools/Keyframes/Keyframes";
import Thumbnails from "../../tools/Thumbnails/Thumbnails";
import TwitterAdvancedSearch from "../../tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import Magnifier from "../../tools/Magnifier/Magnifier";
import Metadata from "../../tools/Metadata/Metadata";
import VideoRights from "../../tools/VideoRights/VideoRights";
import Forensic from "../../tools/Forensic/Forensic";

const DrawerItem = (props) => {
    const {drawer, url} = useParams();

    const dispatch = useDispatch();
    const uri = (url !== undefined) ? decodeURIComponent(url) : undefined;

    const drawerItemsContent = [
        {
            content: <AllTools tools={props.drawerItems}/>,
        },
        {
            content: <Analysis url={uri}/>,
        },
        {
            content: <Keyframes url={uri}/>,
        },
        {
            content: <Thumbnails url={uri}/>,
        },
        {
            content: <TwitterAdvancedSearch url={uri}/>,
        },
        {
            content: <Magnifier url={uri}/>,
        },
        {
            content: <Metadata url={uri}/>,
        },
        {
            content: <VideoRights url={uri}/>,
        },
        {
            content: <Forensic url={uri}/>,
        }
    ];

    return (
        <div>
            {
                props.drawerItems.map((item, index) => {
                    if (drawer === item.path) {
                        dispatch(selectTool(index));
                        return (
                            <Container key={index}>
                                <Fade in={true}>
                                    <div>
                                        {drawerItemsContent[index].content}
                                    </div>
                                </Fade>
                            </Container>
                        );
                    }
                })
            }
        </div>
    );
};
export default DrawerItem;