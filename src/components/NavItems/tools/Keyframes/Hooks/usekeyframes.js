import {useEffect, useState} from "react"

export const useKeyframes = (result) => {

    const [simpleList, setSimpleList] = useState([]);
    const [detailedList, setDetailedList] = useState([]);

    useEffect(() => {
        let tmpDetailed = [];
        let tmpSimple = [];
        if (!result || !result.scenes)
            return;
        result.scenes.map((scenesValue) => {
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
    }, [JSON.stringify(result)]);
    return [simpleList, detailedList];
};