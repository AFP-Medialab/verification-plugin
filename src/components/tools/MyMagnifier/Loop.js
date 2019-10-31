import React, {useEffect} from "react";
import Magnifier from "react-magnifier";

const Loop = () => {

    useEffect(() => {

        const handleScroll = (e) => {
            let scrollTop = window.scrollY;
            console.log(scrollTop);
        };

        window.addEventListener("scroll", handleScroll);
        return window.removeEventListener("scroll", handleScroll)
    }, []);


    return (
        <div>
            <Magnifier src={"https://picsum.photos/200"} width={200} />
        </div>
    )
};
export default Loop;