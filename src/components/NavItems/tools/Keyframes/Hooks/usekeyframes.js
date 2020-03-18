import {useEffect, useState} from "react"

export const useKeyframes = (result) => {

    const [simpleList, setSimpleList] = useState([]);
    const [detailedList, setDetailedList] = useState([]);
    let jsonResult = JSON.stringify(result);

    useEffect(() => {
        let tmpDetailed = [];
        let tmpSimple = [];
        
        if(!result)
            return;
        if (result.scenes)
            result.scenes.map((scenesValue) => {
                return scenesValue["shots"].map((shotsValue) => {
                    return shotsValue["subshots"].map((subshotsValue) => {
                        return subshotsValue["keyframes"].map((keyframesValue, key) => {
                            tmpDetailed.push(keyframesValue["url"]+"?dl=0");
                            if (key === 1)
                                tmpSimple.push(keyframesValue["url"]+"?dl=0");
                            return true;
                        })
                    })
                })
            });
        if(result.subshots)
            result.subshots.map(subshotsValue => {
                return subshotsValue["keyframes"].map((keyframesValue, key) => {
                    tmpDetailed.push(keyframesValue["url"]+"?dl=0");
                    if (key === 1)
                        tmpSimple.push(keyframesValue["url"]+"?dl=0");
                    return true;
                })
            });
        setDetailedList(tmpDetailed);
        setSimpleList(tmpSimple);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jsonResult]);
    return [simpleList, detailedList];
};