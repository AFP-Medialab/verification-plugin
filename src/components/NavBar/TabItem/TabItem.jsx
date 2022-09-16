import {Route, Routes} from 'react-router-dom'
import {Container} from "@mui/material";
import Fade from "@mui/material/Fade";
import React, {useEffect} from "react";
import DrawerItem from "../DrawerItem/DrawerItem";
import {useDispatch} from "react-redux";
import {selectPage} from "../../../redux/actions";

const TabItem = (props) => {
    if (!props.tabItems || props.tabItems.length === 0)
        return null;
    return (
       <Routes>
            {
                props.tabItems.map((item, index) => {
                   // console.log("/" + item.path + "/:url?")
                    return (
                    <Route
                        path={item.path + "/*"}
                        key={index}  
                        element={<TabContent index={index} path={item.path} tabItems={props.tabItems} drawerItems={props.drawerItems}/>}
                        />
                    )
                } )

            }
       </Routes>
    );
    
};
const TabContent = ({index, path, drawerItems, tabItems}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(selectPage(index))
    }, [index])
    return (
        (path === "tools") ?
            <DrawerItem drawerItems={drawerItems}/>
            :
            <Container key={index}>
                <Fade in={true}>
                    <div>
                        {tabItems[index].content}
                        {tabItems[index].footer}
                    </div>
                </Fade>
            </Container>
        )

}
export default TabItem;