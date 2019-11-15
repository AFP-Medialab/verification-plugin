import {
    Route,
    useParams
} from 'react-router-dom'
import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import DrawerItem from "../DrawerItem/DrawerItem";

const TabItem = (props) => {
    const {tab} = useParams();

    return (
        props.tabItems.map((item, index) => {
            if (tab === item.path) {
                if (tab === "tools"){
                    return (
                        <Route path={"/app/tools/:drawer"}>
                            <DrawerItem drawerItem={props.drawerItem}/>
                        </Route>
                    )
                }
                return (
                    <Container>
                        <Fade in={true}>
                            <div>
                                {tabItems[index].content}
                            </div>
                        </Fade>
                    </Container>
                );
            }
        })
    );
};
export default TabItem;