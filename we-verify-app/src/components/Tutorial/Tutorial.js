import React from 'react';
import Languages from "../Languages/Languages";
import videoUrl from "./images/VideoURLmenu.png";
import insta from "./images/InstagramDemo.png";

function Tutorial() {

    const lang = 'fr';

    return (
        <div id="Tutorial">
            <h1> {Languages(lang, "tuto_title")} </h1>
            <h2>{Languages(lang, "tuto_h_1")}</h2>
            <img src={videoUrl} alt={""}/>
            <p>{Languages(lang, "tuto_1")}</p>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_2")}}></div>
            <p >{Languages(lang, "tuto_3")}</p>
            <img src={insta} alt={""}/>
            <h2>{Languages(lang, "tuto_h_2")}</h2>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_4")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_5")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_6")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_7")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_8")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_9")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_10")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_11")}}></div>
            <div className={"content"} dangerouslySetInnerHTML={{__html: Languages(lang, "tuto_12")}}></div>

        </div>
    );

}
export default Tutorial;