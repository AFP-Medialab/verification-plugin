import React from "react";
import { ImageMagnifier } from "../Utils/ImageMagnifier";

const Loop = (props) => {
  return (
    <div>
      <div>
        {
          <ImageMagnifier
            src={props.src}
            zoomLevel={2}
            magnifieWidth={200}
            magnifierHeight={200}
          />
          /* <Magnifier
                    src={props.src}
                    width={"60%"}
                    zoomFactor={"2"}
                    mgWidth={200}
                    mgHeight={200}
    />*/
        }
      </div>
    </div>
  );
};
export default Loop;
