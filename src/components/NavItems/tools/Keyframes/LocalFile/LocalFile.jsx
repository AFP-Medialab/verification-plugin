import React from "react";
import Iframe from "react-iframe";

import Box from "@mui/material/Box";

const LocalFile = () => {
  return (
    <Box>
      <Iframe
        loading="lazy"
        frameBorder="0"
        url={"https://kse.idt.iti.gr/service/start.html"}
        width="100%"
        height="700px"
      />
    </Box>
  );
};
export default LocalFile;
