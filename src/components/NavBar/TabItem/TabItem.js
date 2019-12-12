import {Route, Switch} from 'react-router-dom'
import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import DrawerItem from "../DrawerItem/DrawerItem";
import {useDispatch} from "react-redux";
import {selectPage} from "../../../redux/actions";

const TabItem = (props) => {
    const dispatch = useDispatch();
    if (!props.tabItems || props.tabItems.length === 0)
        return null;
    return (
        <Switch>
            {
                props.tabItems.map((item, index) => {
                    return (
                        <Route
                            key={index}
                            path={"/app/" + item.path}
                            render={
                                () => {
                                    dispatch(selectPage(index));
                                    return (
                                        (item.path === "tools") ?
                                            <DrawerItem drawerItems={props.drawerItems}/>
                                            :
                                            <Container key={index}>
                                                <Fade in={true}>
                                                    <div>
                                                        {props.tabItems[index].content}
                                                        {props.tabItems[index].footer}
                                                    </div>
                                                </Fade>
                                            </Container>
                                    )
                                }
                            }
                        />
                    );
                })
            }
        </Switch>
    );
};
export default TabItem;