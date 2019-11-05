import React from "react";
import Magnifier from "react-magnifier";

const Loop = (props) => {
    return (
        <div>
            <Magnifier src={props.src} width={200} />
        </div>
    )
};
export default Loop;