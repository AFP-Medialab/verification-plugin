import React, { useState } from "react";

import { Alert, Box, Card, Fade, Skeleton, Stack } from "@mui/material";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { ManageSearch } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import SemanticSearchResults from "./semanticSearchResults";
import CheckboxesTags from "./components/CheckboxesTags";
import { DatePicker } from "@mui/x-date-pickers";
import SelectSmall from "./components/SelectSmall";
import LoadingButton from "@mui/lab/LoadingButton";

const SemanticSearch = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");

  const [errorMessage, setErrorMessage] = useState(
    "This is a test error message",
  );

  const languagesList = [
    { title: "English" },
    { title: "French" },
    { title: "Arabic" },
  ];

  const searchEngineModes = [
    { name: "Multilingual semantic Search" },
    { name: "English based semantic search" },
    { name: "English based keyword search" },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <Box>
          <HeaderTool
            name={"Fact Check Semantic Search"}
            description={
              "Search for semantically related fact checks by providing a paragraph of text (e.g., a social media post). The search is multilingual - input text can be in (almost) any language."
            }
            icon={
              <ManageSearch sx={{ fill: "#00926c", width: 40, height: 40 }} />
            }
          />
          <Card>
            <Box p={3}>
              <form>
                <Stack spacing={6}>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <TextField
                      fullWidth
                      value={input}
                      label={"Search for a Fact Check"}
                      placeholder={"Search for a Fact Check"}
                      multiline
                      variant="outlined"
                      disabled={isLoading}
                      onChange={(e) => {
                        setInput(e.target.value);
                      }}
                    />
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      loading={isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      Submit
                    </LoadingButton>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <SelectSmall
                      items={searchEngineModes}
                      initialValue={searchEngineModes[0].name}
                      disabled={isLoading}
                    />
                    <DatePicker label="From:" disabled={isLoading} />
                    <DatePicker label="To:" disabled={isLoading} />
                    <CheckboxesTags
                      label="Language filter"
                      placeholder="Languages"
                      options={languagesList}
                      disabled={isLoading}
                    />
                    {/*<Button*/}
                    {/*  type="submit"*/}
                    {/*  variant="contained"*/}
                    {/*  color="primary"*/}
                    {/*  disabled={isLoading}*/}
                    {/*  onClick={async (e) => {*/}
                    {/*    e.preventDefault();*/}
                    {/*  }}*/}
                    {/*>*/}
                    {/*  Filter*/}
                    {/*</Button>*/}
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Card>
        </Box>

        {errorMessage && (
          <Box>
            <Fade in={errorMessage ? true : false} timeout={750}>
              <Alert severity="error">{errorMessage}</Alert>
            </Fade>
          </Box>
        )}
        {/*TODO: Add number of results*/}
        {isLoading ? (
          <Card>
            <Stack direction="column" spacing={4} p={4}>
              <Skeleton variant="rounded" height={40} />
              <Skeleton variant="rounded" width={400} height={40} />
            </Stack>
          </Card>
        ) : (
          <SemanticSearchResults />
        )}
      </Stack>
    </Box>
  );
};

export default SemanticSearch;
