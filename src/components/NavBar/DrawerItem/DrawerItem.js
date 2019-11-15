import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import {useParams} from 'react-router-dom'
const DrawerItem = (props) => {
    const {drawer} = useParams();

    return (
        props.drawerItem.map((item, index) => {
            if (drawer === item.path)
                return (
                    <Container>
                        <Fade in={true}>
                            <div>
                                {props.drawerItem[index].content}
                            </div>
                        </Fade>
                    </Container>
                );
        })
    );
};
export default DrawerItem;