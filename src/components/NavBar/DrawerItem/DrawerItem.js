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
import Footer from "../../Shared/Footer/Footer";
import TwitterSna from "../../NavItems/tools/TwitterSna/TwitterSna";
import CovidSearch from "../../NavItems/tools/CovidSearch/CovidSearch";
import XNetwork from "../../NavItems/tools/XNetwork/XNetwork";
import OCR from "../../NavItems/tools/OCR/OCR";

const DrawerItem = (props) => {

    const drawerItemsContent = [
        {
            content: <AllTools tools={props.drawerItems}/>,
            footer: <div/>
        },
        {
            content: <Analysis/>,
            footer: <Footer type={"iti"}/>
        },
        {
            content: <Keyframes/>,
            footer: <Footer type={"iti"}/>
        },
        {
            content: <Thumbnails/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <TwitterAdvancedSearch/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <Magnifier/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <Metadata/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <VideoRights/>,
            footer: <Footer type={"GRIHO"}/>
        },
        {
            content: <Forensic/>,
            footer: <Footer type={"iti-borelli-afp"}/>
        },
        {
            content: <TwitterSna/>,
            footer: <Footer type={"afp-usfd-eudisinfolab"}/>
        },
        {
            content: <CovidSearch/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <XNetwork/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <OCR/>,
            footer: <Footer type={"usfd"}/>
        },
        {
            content: <Checkgif/>,
            footer: <Footer type={"borelli-afp"}/>
        },
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
                                path={"/app/tools/" + item.path + "/:url?/:type?/"}
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