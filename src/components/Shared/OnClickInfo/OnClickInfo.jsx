import useMyStyles from "../MaterialUiStyles/useMyStyles";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/Shared/OnClickInfo.tsv";
import Linkify from "react-linkify";

const OnClickInfo = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("components/Shared/OnClickInfo.tsv", tsv);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [props.keyword]);

  const handleClick = () => {
    setChecked((prev) => !prev);
  };

  const componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );

  return (
    <div>
      <WbIncandescentIcon fontSize={"large"} onClick={handleClick} />
      {checked === true && (
        <div className={classes.onClickInfo}>
          <Typography variant={"body2"}>
            <Linkify componentDecorator={componentDecorator}>
              {keyword(props.keyword)}
            </Linkify>
          </Typography>
        </div>
      )}
    </div>
  );
};
export default OnClickInfo;
