import {useState} from "react";
import {Filters} from "./Filters";

const useFilter = (imageSrc, filter, scale) =>{
    const [imageUrl, setImageUrl] = useState("");

    let img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      let filters = new Filters();
      console.log("called");
      setImageUrl(filters.filterImage(img, filter, scale))
    };
    return imageUrl;
};
export default useFilter;