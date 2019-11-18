import {useEffect, useState} from "react"

export const useKeyframes = (result, dependencies) => {

    const [simpleList, setSimpleList] = useState([]);
    const [detailedList, setDetailedList] = useState([]);

    useEffect(() => {
        let tmpDetailed = [];
        let tmpSimple = [];
        result["scenes"].map((scenesValue) => {
            return scenesValue["shots"].map((shotsValue) => {
                return shotsValue["subshots"].map((subshotsValue) => {
                    return subshotsValue["keyframes"].map((keyframesValue, key) => {
                        tmpDetailed.push(keyframesValue["url"]);
                        if (key === 1)
                            tmpSimple.push(keyframesValue["url"]);
                        return true;
                    })
                })
            })
        });
        setDetailedList(tmpDetailed);
        setSimpleList(tmpSimple);
    }, dependencies);


    return [simpleList, detailedList];
};