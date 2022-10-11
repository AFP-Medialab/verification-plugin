import {Route, Routes} from 'react-router-dom'
import {Container} from "@mui/material";
import Fade from "@mui/material/Fade";
import React, {useEffect} from "react";
import DrawerItem from "../DrawerItem/DrawerItem";
import {useDispatch} from "react-redux";
import {selectPage} from "../../../redux/reducers/navReducer";
import { useParams, useSearchParams, useLocation } from 'react-router-dom';

const TabItem = (props) => {
    
    if (!props.tabItems || props.tabItems.length === 0)
        return null;
    return (
       <Routes>
        {
            props.tabItems.map((item, index) => {
                return (
                    
                    <Route
                        key={index} 
                        path={item.path+"/*"}
                        element={<TabContent index={index} path={item.path} tabItems={props.tabItems} drawerItems={props.drawerItems}/>}
                        />
                    
                )
            } )

        }
       </Routes>
    );
    
};
const TabContent = ({index, path, drawerItems, tabItems}) => {
    //console.log("path .... ", path);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(selectPage(index))
    }, [index])
    
    switch (path) {
        case "tools":
            return (<DrawerItem drawerItems={drawerItems}/>)    
        case "assistant":
            return (
                <Routes>
                    <Route path={"*"}>
                        <Route index element={<ContentContainer tabItems={tabItems} index={index} />} />
                        <Route path={":url"} element={<ContentContainer tabItems={tabItems} index={index} />} />
                    </Route>
                </Routes>)
        default:
            return (
                <ContentContainer tabItems={tabItems} index={index} />
            )
            
    }
}

const ContentContainer = ({tabItems, index}) => {
    return (
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