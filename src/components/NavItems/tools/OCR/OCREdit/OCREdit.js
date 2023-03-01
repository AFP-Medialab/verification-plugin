import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import { Alert } from "@material-ui/lab";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import { Collapse, Grid, TextField } from "@material-ui/core";

import axios from "axios";
import {
  loadFastTextLanguages,
  loadFeedbackScripts,
} from "../../../../../redux/actions/tools/ocrActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/Shared/utils.tsv";

//TODO
// 1. update assistantEndpoint
// 2. use keyword for labels and buttons
// 3. do we want to use saga?
// 4. beware of the new brach that uses mui v4
// 5. !Important we may need to get the ocr prediction from the backend that comes from the feedback column
// 6. Images should be stored only if user provided feedback
const filter = createFilterOptions();
export const OCREdit = ({ ocrResult, type, image_id }) => {
  //use index with image_id
  const dispatch = useDispatch();
  const assistantEndpoint = "http://localhost:8025/"; //process.env.REACT_APP_ASSISTANT_URL;

  const keyword = useLoadLanguage("components/Shared/utils.tsv", tsv);

  const fastTextLanguages = useSelector(
    (state) => state.ocr.fastTextLanguages?.languages
  );
  const feedbackScripts = useSelector(
    (state) => state.ocr.feedbackScripts?.scripts
  );

  //selected feedback script and language
  const [selectedScript, setSelectedScript] = useState({
    code: ocrResult.script.code,
    name: ocrResult.script.name,
  });
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: ocrResult.language.code,
    name: ocrResult.language.name,
  });

  const [text, setText] = useState(ocrResult.text);

  //disable the submit button while sending the data
  const [isSending, setIsSending] = useState(false);
  //keep track of the response message
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    // load script and language lists from feedback backend
    if (!fastTextLanguages) dispatch(loadFastTextLanguages());
    if (!feedbackScripts) dispatch(loadFeedbackScripts());
  }, []);

  // handle change of script selection
  const handleScriptChange = (event, value) => {
    if (typeof value === "string") {
      setSelectedScript({
        name: value,
      });
    } else if (value && value.inputValue) {
      // Create a new value from the user input
      setSelectedScript({
        code: value.inputValue.toLowerCase(),
        name: value.inputValue,
      });
    }
    //else if value is null
    else if (value === null) {
      setSelectedScript({
        code: ocrResult.script.code,
        name: ocrResult.script.name,
      });
    } else {
      setSelectedScript(value);
    }
  };

  // handle change of language selection
  const handleLanguageChange = (event, value) => {
    if (typeof value === "string") {
      setSelectedLanguage({
        name: value,
      });
    } else if (value && value.inputValue) {
      // Create a new value from the user input
      setSelectedLanguage({
        code: value.inputValue.toLowerCase(),
        name: value.inputValue,
      });
    }
    //else if value is null
    else if (value === null) {
      setSelectedLanguage({
        code: ocrResult.language.code,
        name: ocrResult.language.name,
      });
    } else {
      setSelectedLanguage(value);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleCancel = () => {
    setSelectedScript({
      code: ocrResult.script.code,
      name: ocrResult.script.name,
    });
    setSelectedLanguage({
      code: ocrResult.language.code,
      name: ocrResult.language.name,
    });
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
        {feedbackScripts && (
          <Autocomplete
            options={feedbackScripts}
            value={selectedScript.name}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              // Add "new label" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.name;
            }}
            renderOption={(option) => option.name}
            // getOptionSelected={(option, value) => option.name === value.name}
            onChange={handleScriptChange}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              // Suggest the creation of a new value
              if (params.inputValue !== "") {
                filtered.push({
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Script" variant="outlined" />
            )}
          />
        )}
      </Grid>
      <Grid item xs={6}>
        {fastTextLanguages && (
          <Autocomplete
            options={fastTextLanguages}
            value={selectedLanguage.name}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === "string") {
                return option;
              }
              // Add "new label" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.name;
            }}
            renderOption={(option) => option.name}
            // getOptionSelected={(option, value) => option.name === value.name}
            onChange={handleLanguageChange}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              // Suggest the creation of a new value
              if (params.inputValue !== "") {
                filtered.push({
                  inputValue: params.inputValue,
                  name: `Add "${params.inputValue}"`,
                });
              }

              return filtered;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Script" variant="outlined" />
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
