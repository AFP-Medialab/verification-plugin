import React from "react";
import useMyStyles from "../MaterialUiStyles/useMyStyles";
import {useSelector} from "react-redux";


const Footer = (props) => {
    const classes = useMyStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary &&  dictionary[lang]) ? dictionary[lang][key] : "";
    };

    return (
        <div className={classes.footer}>
            <div className={"content"} dangerouslySetInnerHTML={{__html: keyword(props.content)}}/>
        </div>
    )
};
export default Footer;