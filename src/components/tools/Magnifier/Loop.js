import React from "react";
//import Magnifier from "react-magnifier";
import {
    Magnifier,
    GlassMagnifier,
    SideBySideMagnifier,
    PictureInPictureMagnifier,
    MOUSE_ACTIVATION,
    TOUCH_ACTIVATION
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