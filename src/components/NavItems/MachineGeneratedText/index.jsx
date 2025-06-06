import React, { useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

import MachineGeneratedTextForm from "@/components/NavItems/MachineGeneratedText/components/MachineGeneratedTextForm";
import MachineGeneratedTextResults from "@/components/NavItems/MachineGeneratedText/components/MachineGeneratedTextResults";
import JsonBlock from "@Shared/JsonBlock";

import { useMachineGeneratedText } from "./useMachineGeneratedText";

const MachineGeneratedText = () => {
  const [submittedText, setSubmittedText] = useState("");

  const [searchString, setSearchString] = useState("");

  const { mutationChunks, mutationSentences } = useMachineGeneratedText();

  const handleSubmit = () => {
    setSubmittedText(searchString);
    mutationChunks.mutate(searchString);
    mutationSentences.mutate(searchString);
  };

  return (
    <Stack direction="column" spacing={4}>
      <MachineGeneratedTextForm
        mutationChunks={mutationChunks}
        mutationSentences={mutationSentences}
        searchString={searchString}
        setSearchString={setSearchString}
        onSubmit={handleSubmit}
      />

      {(mutationChunks.status === "pending" ||
        mutationSentences.status === "pending") && (
        <Alert icon={<CircularProgress size={20} />} severity="info">
          {"Loading..."}
        </Alert>
      )}

      {mutationChunks.status === "error" ||
        (mutationSentences.status === "error" && (
          <Alert severity="error">
            {"An error happened, try again later"}
            <Box mt={2}>
              <JsonBlock>
                {JSON.stringify(mutationChunks.error, null, 2)}
              </JsonBlock>
            </Box>
          </Alert>
        ))}

      {mutationChunks.data && mutationSentences.data && (
        <MachineGeneratedTextResults
          submittedText={submittedText}
          mutationChunks={mutationChunks}
          mutationSentences={mutationSentences}
        />
      )}
    </Stack>
  );
};

export default MachineGeneratedText;
