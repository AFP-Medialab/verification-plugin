import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import {useDispatch} from "react-redux";
import {selectTool} from "../../../redux/actions";
import AllTools from "../../NavItems/tools/Alltools/AllTools";
import Analysis from "../../NavItems/tools/Analysis/Analysis";
import Keyframes from "../../NavItems/tools/Keyframes/Keyframes";
import Thumbnails from "../../NavItems/tools/Thumbnails/Thumbnails";
import TwitterAdvancedSearch from "../../NavItems/tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import Magnifier from "../../NavItems/tools/Magnifier/Magnifier";
import Metadata from "../../NavItems/tools/Metadata/Metadata";
import VideoRights from "../../NavItems/tools/VideoRights/VideoRights";
import Forensic from "../../NavItems/tools/Forensic/Forensic";
import {Route, Switch} from 'react-router-dom'
import Footer from "../../Footer/Footer";
import TwitterSna from "../../NavItems/tools/TwitterSna/TwitterSna";

const DrawerItem = (props) => {

    const drawerItemsContent = [
        {
            content: <AllTools tools={props.drawerItems}/>,
            footer: <div/>
        },
        {
            content: <Analysis/>,
            footer: <Footer content={"footer_analysis"}/>
        },
        {
            content: <Keyframes/>,
            footer: <Footer content={"footer_keyframes"}/>
        },
        {
            content: <Thumbnails/>,
            footer: <Footer content={"footer_thumbnails"}/>
        },
        {
            content: <TwitterAdvancedSearch/>,
            footer: <Footer content={"footer_twitter"}/>
        },
        {
            content: <Magnifier/>,
            footer: <Footer content={"footer_magnifier"}/>
        },
        {
            content: <Metadata/>,
            footer: <Footer content={"footer_metadata"}/>
        },
        {
            content: <VideoRights/>,
            footer: <Footer content={"footer_rights"}/>
        },
        {
            content: <Forensic/>,
            footer: <Footer content={"footer_forensic"}/>
        },
        {
            content: <TwitterSna/>,
            footer: <Footer content={"footer_magnifier"}/>
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
                                                        {drawerItemsContent[index].footer}
                                                    </div>
                                                </Fade>
                                            </Container>
                                        )
                                    }
                                }
                            />
                        );
                    }
                    return null;
                })
            }
        </Switch>
    );
};
export default DrawerItem;