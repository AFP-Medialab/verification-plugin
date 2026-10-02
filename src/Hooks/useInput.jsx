import { useState } from "react";

export const useInputWithPersistence = (initialValue, key) => {
  const [value, setValue] = useState(() => {
    if (!key) return initialValue;
    try {
      const persisted = sessionStorage.getItem(key);
      return persisted !== null ? JSON.parse(persisted) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (key) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error("Erreur d'écriture dans sessionStorage", e);
      }
    }
  }, [key, value]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange,
    setValue,
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
      let colsWidth = 1180 / cols;
      if (Array.isArray(resultData) && resultData.length) {
        const img = new Image();
        img.src = resultData[0];
        const height = (colsWidth * img.height) / img.width;
        if (img.width !== 0 && img.height !== 0) {
          resolve(height);
        }
      } else reject("no images");
    }, 3000);
  });
};
