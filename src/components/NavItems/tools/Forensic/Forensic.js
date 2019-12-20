import {Paper} from "@material-ui/core";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useGetImages from "./Hooks/useGetImages";
import LinearProgress from "@material-ui/core/LinearProgress";
import ForensicResults from "./Results/ForesnsicResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";

const Forensic = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);

    const resultUrl = useSelector(state => state.forensic.url);
    const resultData = useSelector(state => state.forensic.result);
    const isLoading = useSelector(state => state.forensic.loading);


    const [input, setInput] = useState(resultUrl);
    const [image, setImage] = useState("");

    useGetImages(image);

    const submitUrl = () => {
        if (input && input !== ""){
            setImage(input);
        }
    };

    useEffect(() => {
    if (url !== undefined){
        const uri = decodeURIComponent(url);
        setInput(uri);
        setImage(uri);
    }}, [url]);

    useEffect(() =>{
        setImage("")
    }, [image]);

    return (
      <div>
          <Paper className={classes.root}>
              <CustomTile text={keyword("forensic_title")}/>
              <Box m={1}/>
              <TextField
                  value={input}
                  id="standard-full-width"
                  label={keyword("forensic_input")}
                  style={{margin: 8}}
                  placeholder={""}
                  fullWidth
                  disabled={isLoading}
                  onChange={e => {setInput(e.target.value)}}
              />
              <Button disabled={isLoading}>
                  <label htmlFor="fileInputForensic">
                      <FolderOpenIcon />
                      <Typography variant={"subtitle2"}>{keyword("button_localfile")}</Typography>
                  </label>
                  <input id="fileInputForensic" type="file" hidden={true} onChange={e => {
                      setInput(URL.createObjectURL(e.target.files[0]))
                  }}/>
              </Button>
              <Box m={2}/>
              <Button variant="contained" color="primary" onClick={submitUrl} disabled={isLoading}>
                  {keyword("button_submit")}
              </Button>
              <Box m={2}/>
              <LinearProgress hidden={!isLoading}/>
          </Paper>
          {
              resultData &&
              <ForensicResults result={resultData}/>
          }
      </div>
    );
};
export default Forensic;