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
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";

const SemanticSearch = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const languagesList = [
    { title: "English" },
    { title: "French" },
    { title: "Arabic" },
  ];

  const searchEngineModes = [
    {
      name: "Automatic selection",
      description:
        "Automatic selection will analyze the provided input and according to its language and length will automatically select the most appropriate search engine.",
    },
    {
      name: "English based semantic search",
      description:
        "An English-based semantic search, where you can search any piece of text (a sentence, a paragraph or even a whole FB / Telegram / Twitter post) for any matching previously fact-checked claim. The input needs to be in English in this case (it can be translated by you from other languages using automatic translation such as Google Translate - if this model will perform well and we will use it  in the production app, we will add automatic translation later).",
    },
    {
      name: "Multilingual semantic Search",
      description:
        "A Multilingual semantic search, which works the same as the one above, but should be able to work with all common languages, including CEDMO ones, i.e.,  Slovak, Czech, and Polish.",
    },
    {
      name: "English based keyword search",
      description:
        "Finally, a simple English-based keyword-based search (a standard/baseline engine that can provide good results for shorter inputs and can serve for comparison with previous more advanced models).",
    },
  ];

  const searchEngineModalStyle = {
    position: "absolute",
    display: "block",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    backgroundColor: "background.paper",
    outline: "unset",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setErrorMessage("This is a test error message");
    }, 5000);
  };

  const [openSearchEngineModal, setOpenSearchEngineModal] =
    React.useState(false);
  const handleOpenSearchEngineModal = () => {
    setOpenSearchEngineModal(true);
  };

  const handleCloseSearchEngineModal = () => setOpenSearchEngineModal(false);

  return (
    <Box>
      <Stack direction="column" spacing={4}>
        <HeaderTool
          name={"Fact Check Semantic Search"}
          description={
            "Search for semantically related fact checks by providing a paragraph of text (e.g., a social media post). The search is multilingual - input text can be in (almost) any language."
          }
          icon={
            <ManageSearch sx={{ fill: "#00926c", width: 40, height: 40 }} />
          }
        />
        <Alert severity="info">
          Tip – this is a semantic search. Use one or more sentences for more
          accurate results.
        </Alert>
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
                    label={"Search if already fact-checked"}
                    placeholder={"Search if already fact-checked"}
                    multiline
                    minRows={2}
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
                  <Stack direction="column" spacing={1}>
                    <SelectSmall
                      items={searchEngineModes}
                      initialValue={searchEngineModes[0].name}
                      disabled={isLoading}
                    />
                    <Link
                      onClick={handleOpenSearchEngineModal}
                      sx={{ cursor: "pointer" }}
                    >
                      How to choose?
                    </Link>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={openSearchEngineModal}
                      onClose={handleCloseSearchEngineModal}
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={openSearchEngineModal}>
                        <Box sx={searchEngineModalStyle}>
                          <Typography
                            id="transition-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            How to choose the search engine?
                          </Typography>
                          <Stack
                            id="transition-modal-description"
                            direction="column"
                            spacing={2}
                            mt={2}
                          >
                            {searchEngineModes.map((searchEngine, index) => {
                              return (
                                <Stack direction="column" key={index}>
                                  <Typography variant="subtitle1">
                                    {searchEngine.name}
                                  </Typography>
                                  <Alert severity="info" icon={false}>
                                    {searchEngine.description}
                                  </Alert>
                                </Stack>
                              );
                            })}
                          </Stack>
                        </Box>
                      </Fade>
                    </Modal>
                  </Stack>

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

        {errorMessage && (
          <Box>
            <Fade in={!!errorMessage} timeout={750}>
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
