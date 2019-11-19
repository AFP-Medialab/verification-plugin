import {
    Route,
    useParams
} from 'react-router-dom'
import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import DrawerItem from "../DrawerItem/DrawerItem";
import {useDispatch} from "react-redux";
import {selectPage, selectTool} from "../../../redux/actions";

const TabItem = (props) => {
    const {tab} = useParams();
    const dispatch = useDispatch();

    return (
        <div>
            {
                props.tabItems.map((item, index) => {
                    if (tab === item.path) {
                        dispatch(selectPage(index));
                        if (tab === "tools") {
                            return (
                                <Route key={index} path={"/app/tools/:drawer/:url?"}>
                                    <DrawerItem drawerItems={props.drawerItems}/>
                                </Route>
                            )
                        }
                        return (
                            <Container key={index}>
                                <Fade in={true}>
                                    <div>
                                        {props.tabItems[index].content}
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
export default TabItem;