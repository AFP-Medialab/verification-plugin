import React, { useEffect } from "react";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/CovidSearch.tsv";
import OnClickInfo from "../../../Shared/OnClickInfo/OnClickInfo";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as CovidIcon } from '../../../NavBar/images/SVG/Search/Covid19.svg';
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";



const CovidSearch = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("components/NavItems/tools/CovidSearch.tsv", tsv);
  const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = "https://cse.google.com/cse.js?cx=000556916517770601014:" + keyword("covidsearch_engines");
    script.async = true;

    if (script.src !== "https://cse.google.com/cse.js?cx=000556916517770601014:") {
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      }
    }

  }, [keyword]);


  return (
    <div>
      <HeaderTool name={keywordAllTools("navbar_covidsearch")} description={keywordAllTools("navbar_covidsearch_description")} icon={<CovidIcon style={{ fill: "#51A5B2" }} />} />

      <Card>
        <CardHeader
          title={keyword("navbar_covidsearch")}
          className={classes.headerUpladedImage}
        />
        <div className={classes.root2}>
          <div className="gcse-search"></div>
          <Box m={1} />
          <OnClickInfo keyword={"covid19_tip"} />
        </div>

      </Card>

    </div>);
};
export default CovidSearch;