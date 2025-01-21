import React from "react";
import Iframe from "react-iframe";
import Box from "@mui/material/Box";

const LocalFile = () => {
  return (
    <div>
      <Box m={2} />
      <Box>
        <Iframe
          frameBorder="0"
          url={"https://kse.idt.iti.gr/service/start.html"}
          width="100%"
          height="700px"
        />
      </Box>
    </div>
  );
};
export default LocalFile;
