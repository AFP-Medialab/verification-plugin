import React from "react";

import { keyframes } from "@/constants/tools";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";

const KeyframesHeader = ({ keywordAllTools }) => (
  <HeaderTool
    name={keywordAllTools("navbar_keyframes")}
    description={keywordAllTools("navbar_keyframes_description")}
    icon={
      <keyframes.icon
        sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
      />
    }
  />
);

export default KeyframesHeader;
