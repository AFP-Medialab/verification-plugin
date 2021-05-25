import React, { useEffect } from "react";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/XNetwork.tsv";
import OnClickInfo from "../../../Shared/OnClickInfo/OnClickInfo";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as XNetworkIcon } from '../../../NavBar/images/SVG/Search/Xnetwork.svg';
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const XNetwork = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("components/NavItems/tools/XNetwork.tsv", tsv);
  const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

  useEffect(() => {

    const script = document.createElement('script');
    script.src = "https://cse.google.com/cse.js?cx=000556916517770601014:k08mmqlnmih";
    script.async = true;
  
    document.head.appendChild(script);
  
    return () => {
      document.head.removeChild(script);
    }
    
  }, []);

  return (
    <div>
      <HeaderTool name={keywordAllTools("navbar_xnetwork")} description={keywordAllTools("navbar_xnetwork_description")} icon={<XNetworkIcon style={{ fill: "#51A5B2" }} />} />

      <Card>
        <CardHeader
          title={keyword("navbar_xnetwork")}
          className={classes.headerUpladedImage}
        />
        <div className={classes.root2}>
          <div className="gcse-search"></div>
          <Box m={1} />
          <OnClickInfo keyword={"xnetwork_tip"}/>
        </div>
      </Card>
      
    </div>);
};
export default XNetwork;