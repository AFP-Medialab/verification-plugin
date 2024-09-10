import { useState } from "react";

export const useInput = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value: value,
    onChange: handleChange,
  };
};

export const useLoading = (action) => {
  const [loading, setLoading] = useState(false);
  const doAction = (...args) => {
    setLoading(true);
    return action(...args).finally(() => setLoading(false));
  };
  return [doAction, loading];
};

export const loadImageSize = (resultData, cols) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let height = 0;
      let colsWidth = 1180 / cols;
      if (Array.isArray(resultData) && resultData.length) {
        let img = new Image();
        img.src = resultData[0];
        height = (colsWidth * img.height) / img.width;
        if (img.width !== 0 && img.height !== 0) {
          resolve(height);
        }
      } else reject("no images");
    }, 3000);
  });
};
