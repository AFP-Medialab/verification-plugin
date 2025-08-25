import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import { LoadingButton } from "@mui/lab";
import { ClearIcon } from "@mui/x-date-pickers";

const KeyframesInput = ({
  input,
  onInputChange,
  onSubmit,
  onReset,
  isDisabled,
  keyword,
}) => (
  <Box component="form" onSubmit={onSubmit}>
    <Grid container direction="row" spacing={3} sx={{ alignItems: "center" }}>
      <Grid size="grow">
        <TextField
          id="keyframes-input"
          label={keyword("keyframes_input")}
          fullWidth
          disabled={isDisabled}
          value={input}
          variant="outlined"
          onChange={(e) => onInputChange(e.target.value)}
          slotProps={{
            input: {
              endAdornment: input ? (
                <IconButton
                  size="small"
                  onClick={onReset}
                  disabled={isDisabled}
                  sx={{ p: 1 }}
                >
                  <ClearIcon />
                </IconButton>
              ) : undefined,
            },
          }}
        />
      </Grid>
      <Grid>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={!input.trim() || isDisabled}
          loading={isDisabled}
        >
          {keyword("button_submit")}
        </LoadingButton>
      </Grid>
    </Grid>
  </Box>
);

export default KeyframesInput;
