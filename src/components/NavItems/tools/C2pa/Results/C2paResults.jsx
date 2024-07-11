import { Box } from "@mui/material";

const C2paResults = (result) => {
  return (
    <Box>
      <Box>{result.title}</Box>
      <Box>
        {result.signatureIssuer
          ? result.signatureIssuer
          : "no signature issuer"}
      </Box>
    </Box>
  );
};

export default C2paResults;
