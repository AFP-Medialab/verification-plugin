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
import tsv from "../../../../LocalDictionary/components/NavItems/tools/CovidSearch.tsv";


const CovidSearch = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("components/NavItems/tools/CovidSearch.tsv", tsv);
  console.log("kedddd", keyword);

  // Authentication Redux state
  const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

  const dispatch = useDispatch();

console.log("nnnnn", keyword("covid_search_title"));
  return (
    <div>
      <Paper className={classes.root}>
       <CustomTile text={keyword("covid_search_title")} />

        <Box m={3} />
        <div class="gcse-search"></div>
        
      </Paper>
      
    </div>);
};
export default CovidSearch;