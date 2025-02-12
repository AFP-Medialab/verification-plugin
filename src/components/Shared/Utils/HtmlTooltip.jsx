import React, { useState } from "react";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "components/Shared/MaterialUiStyles/useMyStyles";

const HtmlTooltipStyled = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    //backgroundColor: '#f5f5f9',
    //color: 'rgba(0, 0, 0, 0.87)',
    //maxWidth: 220,
    //fontSize: theme.typography.pxToRem(12),
    //border: '1px solid #dadde9',
  },
}));

export const HtmlTooltip = ({ text, index }) => {
  const keyword = i18nLoadNamespace("components/Shared/utils");
  const classes = useMyStyles();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(0);

  return (
    <HtmlTooltipStyled
      title={
        <React.Fragment>
          {console.log(text)}
          {text}
        </React.Fragment>
      }
      classes={{ tooltip: classes.assistantTooltip }}
    >
      <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
    </HtmlTooltipStyled>
  );
};
