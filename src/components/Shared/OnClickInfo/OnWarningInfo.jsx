import React, { useEffect, useState } from "react";
import Linkify from "react-linkify";

import Typography from "@mui/material/Typography";

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import useMyStyles from "../MaterialUiStyles/useMyStyles";

const OnWarningInfo = (props) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(props.trueClick ? true : false);
  }, [props.keyword, props.trueClick]);

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
      <WarningRoundedIcon fontSize={"large"} onClick={handleClick} />
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
export default OnWarningInfo;
