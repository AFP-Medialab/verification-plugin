import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
  IconButton,
  Button,
} from "@mui/material";

import {
  ArrowLeft,
  ChevronLeft,
  Close,
  FastRewind,
  FirstPage,
  KeyboardArrowLeft,
  KeyboardDoubleArrowLeft,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { c2paCurrentImageIdSet } from "redux/reducers/tools/c2paReducer";
import moment from "moment";

/**
 *
 * @param result {Object} Object containing the parsed c2pa information for this image
 * @param handleClose {function} Closes the result
 * @returns {React.JSX.Element}
 */

const C2paResults = (props = { result, handleClose }) => {
  const currentImageId = useSelector((state) => state.c2pa.currentImageId);
  const mainImageId = useSelector((state) => state.c2pa.mainImageId);
  const validationIssues = useSelector((state) => state.c2pa.validationIssues);
  const result = props.result;

  const img = result[currentImageId].url;
  const parentId = result[currentImageId].parent;
  const manifestData = result[currentImageId].manifestData;

  const dispatch = useDispatch();

  const handleClose = () => {
    props.handleClose();
  };

  const setImage = (ingredientId) => {
    dispatch(c2paCurrentImageIdSet(ingredientId));
  };

  const returnToMain = () => {
    props.returnToMain();
  };

  return (
    <Card>
      <CardHeader
        title={"Results"}
        action={
          <IconButton aria-label="close" onClick={handleClose}>
            <Close sx={{ color: "white" }} />
          </IconButton>
        }
      />
      <Box m={2} />
      <Grid container direction="row" spacing={3} p={4}>
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
        <Grid item xs>
          <Card p={1}>
            {/* <CardHeader title={"C2pa Info"}/> */}
            <CardContent>
              <Typography variant="h5">{"C2pa Info"}</Typography>
              <Box m={1} />
              {validationIssues ? (
                <Alert severity="error">
                  {"Content credentials could not be verified for this image"}
                </Alert>
              ) : !manifestData ? (
                <Alert severity="info">{"No c2pa info for this image"}</Alert>
              ) : (
                <Stack>
                  <Typography>{manifestData.title}</Typography>
                  <Box m={1} />
                  <Box p={1}>
                    {/* <CardContent> */}
                    <Stack>
                      <Typography variant="h6">
                        {"Content Credentials"}
                      </Typography>

                      <Box p={1}>
                        <Typography>
                          {"Issuer: " + manifestData.signatureInfo.issuer}
                        </Typography>
                        <Typography>
                          {"Date issued: " +
                            moment(manifestData.signatureInfo.time).format(
                              "D.MM.yyyy",
                            )}
                        </Typography>
                      </Box>
                    </Stack>
                    {/* </CardContent> */}
                    <Box m={1} />
                    <Divider m={1} />
                  </Box>
                  {/* <Box m={1} /> */}

                  <Box p={1}>
                    {/* <CardContent> */}
                    <Stack>
                      <Typography variant="h6">{"Credit"}</Typography>
                      <Box p={1}>
                        {manifestData.producer ? (
                          <Typography>
                            {"Produced by: " + manifestData.producer}
                          </Typography>
                        ) : (
                          <Alert severity="info">
                            {"No info on the producer of this image."}
                          </Alert>
                        )}
                      </Box>
                    </Stack>
                    {/* </CardContent> */}
                    <Box m={1} />
                    <Divider m={1} />
                  </Box>

                  <Box p={1}>
                    {/* <CardContent> */}
                    <Stack>
                      <Typography variant="h6">
                        {"Capture Information"}
                      </Typography>
                      <Box p={1}>
                        {manifestData.captureInfo ? (
                          <>
                            {manifestData.captureInfo.make ? (
                              <Typography>
                                {"Make: " + manifestData.captureInfo.make}
                              </Typography>
                            ) : null}
                            {manifestData.captureInfo.model ? (
                              <Typography>
                                {"Model: " + manifestData.captureInfo.model}
                              </Typography>
                            ) : null}
                            {manifestData.captureInfo.dateTime ? (
                              <Typography>
                                {"Capture date: " +
                                  moment(
                                    manifestData.captureInfo.dateTime,
                                  ).format("D.MM.yyyy")}
                              </Typography>
                            ) : null}
                          </>
                        ) : (
                          <Alert severity="info">
                            {"No capture information available."}
                          </Alert>
                        )}
                      </Box>
                    </Stack>
                    <Box m={1} />
                    <Divider />
                    {/* </CardContent> */}
                  </Box>

                  <Box p={1}>
                    {/* <CardContent> */}
                    {manifestData.editsAndActivity || manifestData.children ? (
                      <Stack>
                        <Typography variant="h6">{"Process"}</Typography>

                        <Box p={1}>
                          {manifestData.editsAndActivity ? (
                            <>
                              <Typography fontSize={18}>{"Edits"}</Typography>
                              <Box m={1} />
                              <Box paddingLeft={2}>
                                {manifestData.editsAndActivity.map(
                                  (obj, key) => {
                                    return (
                                      <Typography key={key}>
                                        {obj.label + ": " + obj.description}
                                      </Typography>
                                    );
                                  },
                                )}
                              </Box>
                            </>
                          ) : (
                            <></>
                          )}
                        </Box>

                        <Box p={1}>
                          {manifestData.children ? (
                            <>
                              <Typography fontSize={18}>
                                {"Ingredients"}
                              </Typography>
                              <Box m={1} />
                              <Stack direction="row" spacing={1} p={1}>
                                {manifestData.children.map((obj, key) => {
                                  return (
                                    <Box key={key}>
                                      <img
                                        src={result[obj].url}
                                        style={{
                                          maxWidth: "150px",
                                          maxHeight: "60vh",
                                          borderRadius: "10px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          setImage(obj);
                                        }}
                                      />
                                      {/* <Typography fontSize={12}>
                                      {obj.title}
                                    </Typography> */}
                                    </Box>
                                  );
                                })}
                              </Stack>
                            </>
                          ) : (
                            <></>
                          )}
                        </Box>
                      </Stack>
                    ) : (
                      <Alert security="info">
                        {"No process information for this image."}
                      </Alert>
                    )}
                    {/* </CardContent> */}
                  </Box>
                </Stack>
              )}
              {parentId ? (
                <Box maxWidth="fit-content" marginInline="auto">
                  <Button
                    onClick={() => setImage(parentId)}
                    startIcon={<KeyboardArrowLeft />}
                    variant="contained"
                  >
                    {"Previous image"}
                  </Button>
                  <Box m={0.5} />
                  {parentId !== mainImageId ? (
                    <Button
                      onClick={() => setImage(mainImageId)}
                      startIcon={<KeyboardDoubleArrowLeft />}
                      variant="contained"
                    >
                      {"First image"}
                    </Button>
                  ) : null}
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default C2paResults;
