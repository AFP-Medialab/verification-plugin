import React from "react";

import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";

import AboutIcon from "../components/NavBar/images/SVG/Navbar/About.svg";
import AssistantIcon from "../components/NavBar/images/SVG/Navbar/Assistant.svg";
import ClassroomIcon from "../components/NavBar/images/SVG/Navbar/Classroom.svg";
import GuideIcon from "../components/NavBar/images/SVG/Navbar/Guide.svg";
import InteractiveIcon from "../components/NavBar/images/SVG/Navbar/Interactive.svg";
import ToolsIcon from "../components/NavBar/images/SVG/Navbar/Tools.svg";
import About from "../components/NavItems/About/About";
import Assistant from "../components/NavItems/Assistant/Assistant";
import ClassRoom from "../components/NavItems/ClassRoom/ClassRoom";
import Interactive from "../components/NavItems/Interactive/Interactive";
import Tutorial from "../components/NavItems/tutorial/tutorial";
import { FOOTER_TYPES, Footer } from "../components/Shared/Footer/Footer";
import { TOOLS_CATEGORIES } from "./tools";

const ToolsSvgIcon = (props) => {
  return <SvgIcon component={ToolsIcon} inheritViewBox {...props} />;
};

const AssistantSvgIcon = (props) => {
  return <SvgIcon component={AssistantIcon} inheritViewBox {...props} />;
};

const GuideSvgIcon = (props) => {
  return <SvgIcon component={GuideIcon} inheritViewBox {...props} />;
};

const InteractiveSvgIcon = (props) => {
  return <SvgIcon component={InteractiveIcon} inheritViewBox {...props} />;
};

const ClassroomSvgIcon = (props) => {
  return <SvgIcon component={ClassroomIcon} inheritViewBox {...props} />;
};

const AboutSvgIcon = (props) => {
  return <SvgIcon component={AboutIcon} inheritViewBox {...props} />;
};

export const TOP_MENU_ITEMS = [
  {
    title: "navbar_tools",
    icon: ToolsSvgIcon,
    content: <Box />,
    path: "tools",
    footer: <Box />,
    typeTab: "verification",
    type: TOOLS_CATEGORIES.ALL,
  },
  {
    title: "navbar_assistant",
    icon: AssistantSvgIcon,

    content: <Assistant />,
    path: "assistant",
    footer: <Footer type={FOOTER_TYPES.USFD} />,
    typeTab: "verification",
    type: TOOLS_CATEGORIES.ALL,
  },
  {
    title: "navbar_tuto",
    icon: GuideSvgIcon,
    content: <Tutorial />,
    path: "tutorial",
    footer: <Footer type={FOOTER_TYPES.AFP} />,
    typeTab: "learning",
    type: TOOLS_CATEGORIES.ALL,
  },
  {
    title: "navbar_quiz",
    icon: InteractiveSvgIcon,
    content: <Interactive />,
    path: "interactive",
    footer: <Footer type={FOOTER_TYPES.AFP} />,
    typeTab: "learning",
    type: TOOLS_CATEGORIES.ALL,
  },
  {
    title: "navbar_classroom",
    icon: ClassroomSvgIcon,
    content: <ClassRoom />,
    path: "classroom",
    footer: <Footer type={FOOTER_TYPES.AFP} />,
    typeTab: "learning",
    type: TOOLS_CATEGORIES.ALL,
  },
  {
    title: "navbar_about",
    icon: AboutSvgIcon,
    content: <About />,
    path: "about",
    footer: <Footer type={FOOTER_TYPES.AFP} />,
    typeTab: "more",
  },
];
