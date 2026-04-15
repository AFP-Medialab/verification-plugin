import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { JsonBlock } from "@Shared/JsonBlock";

const PoiForensicsResults = (props) => {
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  return (
    <>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <JsonBlock jsonString={JSON.stringify(props.result, null, 2)} />
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default PoiForensicsResults;
