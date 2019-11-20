import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import {useDispatch} from "react-redux";
import {selectPage, selectTool} from "../../../redux/actions";
import AllTools from "../../NavItems/tools/Alltools/AllTools";
import Analysis from "../../NavItems/tools/analysis/Analysis";
import Keyframes from "../../NavItems/tools/Keyframes/Keyframes";
import Thumbnails from "../../NavItems/tools/Thumbnails/Thumbnails";
import TwitterAdvancedSearch from "../../NavItems/tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import Magnifier from "../../NavItems/tools/Magnifier/Magnifier";
import Metadata from "../../NavItems/tools/Metadata/Metadata";
import VideoRights from "../../NavItems/tools/VideoRights/VideoRights";
import Forensic from "../../NavItems/tools/Forensic/Forensic";
import {Route, Switch} from 'react-router-dom'

const DrawerItem = (props) => {

    const drawerItemsContent = [
        {
            content: <AllTools tools={props.drawerItems}/>,
        },
        {
            content: <Analysis/>,
        },
        {
            content: <Keyframes/>,
        },
        {
            content: <Thumbnails/>,
        },
        {
            content: <TwitterAdvancedSearch/>,
        },
        {
            content: <Magnifier/>,
        },
        {
            content: <Metadata/>,
        },
        {
            content: <VideoRights/>,
        },
        {
            content: <Forensic/>,
        }
    ];

    const dispatch = useDispatch();

    return (
        <Switch>
            {
                props.drawerItems.map((item, index) => {
                    if (item.path) {
                        return (
                            <Route
                                key={index}
                                path={"/app/tools/" + item.path + "/:url?"}
                                render={
                                    () => {
                                        dispatch(selectTool(index));
                                        return (
                                            <Container key={index}>
                                                <Fade in={true}>
                                                    <div>
                                                        {drawerItemsContent[index].content}
                                                    </div>
                                                </Fade>
                                            </Container>
                                        )
                                    }
                                }
                            />
                        );
                    }
                })
            }
        </Switch>
    );
};
export default DrawerItem;