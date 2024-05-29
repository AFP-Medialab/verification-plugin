import React, { useEffect, useState } from "react";
import { Image, Layer, Rect, Stage, Text } from "react-konva";
import { preloadImage } from "../../Forensic/utils";

const TextImageCanvas = ({ imgSrc, text, filterDataURL }) => {
  const stageRef = React.useRef(null);
  const [img, setImg] = useState(null);

  const handleExport = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    filterDataURL(uri);
  };

  const textBackground = () => {};

  useEffect(() => {
    async function loadAndPreloadImage() {
      const loadedImg = await preloadImage(imgSrc);
      setImg(loadedImg);
    }

    loadAndPreloadImage();
    if (img) handleExport();
  }, [imgSrc, img]);

  if (img) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const width = 300;
    const height = 300 / imgRatio;

    return (
      <Stage width={width} height={height}>
        <Layer ref={stageRef}>
          <Image image={img} width={width} height={height} />
          <Text
            text={text}
            fontSize={40}
            draggable
            fill="red"
            onDragEnd={handleExport}
          />
        </Layer>
      </Stage>
    );
  } else {
    return;
  }
};

export default TextImageCanvas;
