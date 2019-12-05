import React from "react";
import {
    GlassMagnifier,
} from "react-image-magnifiers";

const Loop = (props) => {
    return (
        <div>
            <div>
                <GlassMagnifier
                    imageSrc={props.src}
                    imageAlt="Example"
                    magnifierSize={"40%"}
                />
            </div>
        </div>
    );
};
export default Loop;