import React, { useEffect } from "react";


import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/CovidSearch.tsv";


const CovidSearch = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("components/NavItems/tools/CovidSearch.tsv", tsv);

  useEffect(() => {
      
      const script = document.createElement('script');
      script.src = "https://cse.google.com/cse.js?cx=000556916517770601014:" + keyword("covidsearch_engines");
      console.log(script.src);
      script.async = true;
    
      document.head.appendChild(script);
    
      return () => {
        document.head.removeChild(script);
      }
    
  }, [keyword]);

  return (
    <div>
      <Paper className={classes.root}>
       <CustomTile text={keyword("navbar_covidsearch")} />

        <Box m={3} />
        <div className="gcse-search"></div>
        
      </Paper>
      
    </div>);
};
export default CovidSearch;