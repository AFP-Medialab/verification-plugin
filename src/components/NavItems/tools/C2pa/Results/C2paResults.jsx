import {
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

const C2paResults = (props) => {
  const result = props.result;
  const img = props.image;
  console.log("resultss", result);
  return (
    <>
      <CardHeader title={"Reuslts"} />
      <Box m={2} />
      <Grid container direction="row" spacing={4}>
        <Grid item xs>
          <img
            src={img}
            style={{
              maxWidth: "100%",
              maxHeight: "60vh",
              borderRadius: "10px",
            }}
          />
        </Grid>
        <Grid container item direction="column" xs>
          <Card>
            <Typography> {"C2pa Info"} </Typography>
            <Box>{result.title}</Box>
            <Box>
              {result.signatureIssuer
                ? result.signatureIssuer
                : "no signature issuer"}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default C2paResults;
