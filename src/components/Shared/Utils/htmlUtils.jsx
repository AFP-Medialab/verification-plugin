import html2canvas from "html2canvas";

/**
 * Exports a React Element to a Jpeg file by converting it into a canvas element using `html2canvas`
 * @param ref {React.Ref} The ref of the React Element
 * @param fileName {string} The name of the jpeg file exported
 * @returns {Promise<void>} Starts the download of the Jpeg file
 */
export const exportReactElementAsJpg = async (ref, fileName) => {
  const canvas = await html2canvas(ref.current).catch((e) => {
    console.error(e);
    return e;
  });

  const img = canvas.toDataURL("image/jpeg", 1.0);
  const link = document.createElement("a");
  link.style.display = "none";
  link.download = fileName;
  link.href = img;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
};
