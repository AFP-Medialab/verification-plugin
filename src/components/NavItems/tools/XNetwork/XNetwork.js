import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../../redux/actions/errorActions";

import dateFormat from "dateformat";
import _ from "lodash";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import SearchIcon from '@material-ui/icons/Search';

import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/XNetwork.tsv";


const XNetwork = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("components/NavItems/tools/XNetwork.tsv", tsv);
  console.log("kedddd", keyword);

  const searchEngines = [
    "https://cse.google.com/cse.js?cx=000556916517770601014:k08mmqlnmih"
  ]

  useEffect(() => {

    searchEngines.forEach(engine => {
      const script = document.createElement('script');
      script.src = engine;
      script.async = true;
    
      document.head.appendChild(script);
    
      return () => {
        document.head.removeChild(script);
      }
    });
    
  }, []);

  return (
    <div>
      <Paper className={classes.root}>
       <CustomTile text={keyword("navbar_xnetwork")} />

        <Box m={3} />
        <div className="gcse-search"></div>
        
      </Paper>
      
    </div>);
};
export default XNetwork;