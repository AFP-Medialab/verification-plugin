import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import { Autocomplete, Alert } from "@material-ui/lab";

import { Collapse, Grid, TextField } from "@material-ui/core";

import axios from "axios";
import { loadFastTextLanguages } from "../../../../../redux/actions/tools/ocrActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/Shared/utils.tsv";

//TODO
// 1. update assistantEndpoint
// 2. use keyword for labels and buttons
// 3. do we want to use saga?
// 4. beware of the new brach that uses mui v4
// 5. !Important we may need to get the ocr prediction from the backend that comes from the feedback column

export const OCREdit = ({ ocrResult, type, image_id }) => {  //use index with image_id
  const dispatch = useDispatch();
  const assistantEndpoint = "http://localhost:8025/"; //process.env.REACT_APP_ASSISTANT_URL;

  const keyword = useLoadLanguage("components/Shared/utils.tsv", tsv);
  const scripts = useSelector((state) => state.ocr.scripts);
  const fastTextLanguages = useSelector((state) => state.ocr.fastTextLanguages);

  const [selectedScript, setSelectedScript] = useState(ocrResult.script.name);
  const [selectedLanguage, setSelectedLanguage] = useState(
    ocrResult.language.name
  );
  const [text, setText] = useState(ocrResult.text);



  //disable the submit button while sending the data
  const [isSending, setIsSending] = useState(false);
  //keep track of the response message
  const [responseMessage, setResponseMessage] = useState("");

  
  useEffect(() => {
    if (!fastTextLanguages) dispatch(loadFastTextLanguages());
  }, []);

  const handleScriptChange = (event, value) => {
    setSelectedScript(value);
  };

  const handleLanguageChange = (event, value) => {
    setSelectedLanguage(value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleCancel = () => {
    setSelectedScript(ocrResult.script.name);
    setSelectedLanguage(ocrResult.language.name);
    setText(ocrResult.text);
  };

  const handleSubmit = () => {
    setIsSending(true);
    let data = JSON.stringify({
      image_id: image_id,
      index: ocrResult.index,
      bounding_box: ocrResult.bounding_box,
      script: selectedScript,
      language: selectedLanguage,
      text: text,
    });
    axios
      .post(assistantEndpoint + "feedback", data)
      .then((res) => {
        setIsSending(false);
        setResponseMessage("Success");
      })
      .catch((err) => {
        setIsSending(false);
        setResponseMessage("Failed: " + err);
      });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {scripts && (
          <Autocomplete
            options={Object.values(scripts)}
            value={selectedScript}
            // getOptionLabel={(option) => option.name}
            // getOptionSelected={(option, value) => option.name === value.name}
            onChange={handleScriptChange}
            renderInput={(params) => (
              <TextField {...params} label="Script" variant="outlined" />
            )}
          />
        )}
      </Grid>
      <Grid item xs={6}>
        {fastTextLanguages && (
          <Autocomplete
            options={Object.values(fastTextLanguages)}
            // getOptionLabel={(option) => option.name}
            value={selectedLanguage}
            // getOptionSelected={(option, value) => option.name === value.name}
            onChange={handleLanguageChange}
            renderInput={(params) => (
              <TextField {...params} label="Language" variant="outlined" />
            )}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="text"
          label="Text"
          variant="outlined"
          fullWidth
          value={text}
          onChange={handleTextChange}
        />
      </Grid>

      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            disabled={isSending}
            onClick={handleCancel}
          >
            {/* {keyword("reset")} */}
            {"Reset"}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={isSending}
            onClick={handleSubmit}
          >
            {/* {isSending ? keyword("sending")+"..." : keyword("submit_suggestion")} */}
            {isSending ? "Sending..." : "Submit Suggestion"}
          </Button>
        </Grid>
      </Grid>
      {/* new element to show response message */}
      <Grid item xs={12}>
        {responseMessage && (
          <Alert
            variant="outlined"
            severity={responseMessage === "Success" ? "success" : "error"}
          >
            {/* {keyword(responseMessage)} */}
            {responseMessage}
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};
