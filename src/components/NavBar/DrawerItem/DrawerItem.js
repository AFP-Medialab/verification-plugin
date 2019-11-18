import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import {useParams} from 'react-router-dom'
import {useDispatch} from "react-redux";
import {selectTool} from "../../../redux/actions";

const DrawerItem = (props) => {
        const {drawer} = useParams();

        const dispatch = useDispatch();

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
                                            {props.drawerItemsContent[index].content}
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