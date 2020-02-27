import React from "react";
import Magnifier from "react-magnifier";


const Loop = (props) => {
    return (
        <div>
            <div>
                <Magnifier
                    src={props.src}
                    width={"60%"}
                    zoomFactor={"2"}
                    mgWidth={200}
                    mgHeight={200}
                />
            </div>
        </div>
    );
};
export default Loop;