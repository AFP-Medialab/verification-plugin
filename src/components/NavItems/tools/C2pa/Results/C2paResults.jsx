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
  Icon,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";

import {
  ArrowLeft,
  ChevronLeft,
  Close,
  ExpandMore,
  FastRewind,
  FirstPage,
  KeyboardArrowLeft,
  KeyboardDoubleArrowLeft,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { c2paCurrentImageIdSet } from "redux/reducers/tools/c2paReducer";
import moment from "moment";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

/**
 *
 * @param result {Object} Object containing the parsed c2pa information for this image
 * @param handleClose {function} Closes the result
 * @returns {React.JSX.Element}
 */

const C2paResults = (props = { result, handleClose }) => {
  const currentImageId = useSelector((state) => state.c2pa.currentImageId);
  const mainImageId = useSelector((state) => state.c2pa.mainImageId);
  //const validationIssues = useSelector((state) => state.c2pa.validationIssues);
  const result = props.result;

  const img = result[currentImageId].url;
  const parentId = result[currentImageId].parent;
  const manifestData = result[currentImageId].manifestData;
  const validationIssues = result[currentImageId].validationIssues;

  const dispatch = useDispatch();

  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  const handleClose = () => {
    props.handleClose();
  };

  const setImage = (ingredientId) => {
    dispatch(c2paCurrentImageIdSet(ingredientId));
  };

  const title = (title, information) => {
    return (
      <Grid container direction="row">
        <Grid item>
          <Typography variant="h6">{title}</Typography>
        </Grid>
      </Grid>
    );
  };

  const validationMessage = (issues) => {
    if (issues.trustedSourceIssue && issues.errorMessages.length <= 2) {
      return keyword("content_credentials_unknown_source");
    } else {
      return keyword("content_credentials_invalid");
    }
  };

  return (
    <Card>
      <CardHeader
        title={keyword("c2pa_results_title")}
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
              {validationIssues ? (
                <Box m={1}>
                  <Alert severity="error" m={1}>
                    {validationMessage(validationIssues)}
                  </Alert>
                </Box>
              ) : null}
              <Typography variant="h5">
                {keyword("c2pa_information")}
              </Typography>
              <Box m={1} />
              {!manifestData ? (
                <Box m={1}>
                  <Alert severity="info" m={1}>
                    {keyword("no_c2pa_info")}
                  </Alert>
                </Box>
              ) : (
                <>
                  <Stack>
                    <Typography>{manifestData.title}</Typography>
                    <Box m={1} />
                    <Box p={1}>
                      {/* <CardContent> */}
                      <Stack>
                        <Typography variant="h6">
                          {keyword("content_credentials_title")}
                        </Typography>

                        <Box p={1}>
                          <Typography>
                            {keyword("content_credentials_issuer") +
                              manifestData.signatureInfo.issuer}
                          </Typography>
                          <Typography>
                            {keyword("content_credentials_date_issued") +
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
                        <Typography variant="h6">
                          {keyword("credit_title")}
                        </Typography>
                        <Box p={1}>
                          {manifestData.producer ? (
                            <>
                              <Typography>
                                {manifestData.producer.name
                                  ? keyword("credit_producer") +
                                    manifestData.producer.name
                                  : ""}
                              </Typography>
                              {manifestData.producer.socials ? (
                                <>
                                  <Typography>
                                    {keyword("credit_social")}
                                  </Typography>
                                  <Stack>
                                    {manifestData.producer.socials.map(
                                      (obj, key) => {
                                        return (
                                          <Typography key={key}>
                                            {obj["@id"]}
                                          </Typography>
                                        );
                                      },
                                    )}
                                  </Stack>
                                </>
                              ) : null}
                            </>
                          ) : (
                            <Alert severity="info">
                              {keyword("credit_no_info")}
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
                          {keyword("capture_info_title")}
                        </Typography>
                        <Box p={1}>
                          {manifestData.captureInfo ? (
                            <>
                              {manifestData.captureInfo.make ? (
                                <Typography>
                                  {keyword("capture_info_make") +
                                    manifestData.captureInfo.make}
                                </Typography>
                              ) : null}
                              {manifestData.captureInfo.model ? (
                                <Typography>
                                  {keyword("capture_info_model") +
                                    manifestData.captureInfo.model}
                                </Typography>
                              ) : null}
                              {manifestData.captureInfo.dateTime ? (
                                <Typography>
                                  {keyword("capture_info_date") +
                                    moment(
                                      manifestData.captureInfo.dateTime,
                                    ).format("D.MM.yyyy")}
                                </Typography>
                              ) : null}
                              {manifestData.captureInfo.latitude ? (
                                <Typography>
                                  {keyword("capture_info_latitude") +
                                    manifestData.captureInfo.latitude}
                                </Typography>
                              ) : null}
                              {manifestData.captureInfo.longitude ? (
                                <Typography>
                                  {keyword("capture_info_longitude") +
                                    manifestData.captureInfo.longitude}
                                </Typography>
                              ) : null}
                              {manifestData.captureInfo.allCaptureInfo ? (
                                <Accordion>
                                  <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography>
                                      {keyword("capture_info_more_results")}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {manifestData.captureInfo.allCaptureInfo.map(
                                      (obj, key) => {
                                        return (
                                          <Stack key={key}>
                                            {console.log(obj.data)}
                                            {Object.keys(obj.data).map(
                                              (objKey, index) => {
                                                console.log(obj.data[objKey]);
                                                if (
                                                  typeof obj.data[objKey] ===
                                                  "string"
                                                ) {
                                                  return (
                                                    <Typography key={index}>
                                                      {objKey +
                                                        ": " +
                                                        obj.data[objKey]}
                                                    </Typography>
                                                  );
                                                } else {
                                                  return null;
                                                }
                                              },
                                            )}
                                          </Stack>
                                        );
                                      },
                                    )}
                                  </AccordionDetails>
                                </Accordion>
                              ) : null}
                            </>
                          ) : (
                            <Alert severity="warning">
                              {keyword("capture_no_info")}
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
                      {manifestData.editsAndActivity ||
                      manifestData.children ? (
                        <Stack>
                          <Typography variant="h6">
                            {keyword("process_title")}
                          </Typography>

                          <Box p={1}>
                            {manifestData.editsAndActivity ? (
                              <>
                                <Typography fontSize={18}>
                                  {keyword("process_edits")}
                                </Typography>
                                <Box m={1} />
                                <Box paddingLeft={2}>
                                  {manifestData.editsAndActivity.map(
                                    (obj, key) => {
                                      {
                                        console.log(obj);
                                      }
                                      return (
                                        <Stack key={key}>
                                          <Stack direction="row">
                                            <img src={obj.icon} />
                                            <Typography paddingLeft={1}>
                                              {obj.label + ":"}
                                            </Typography>
                                          </Stack>
                                          <Typography paddingLeft={1}>
                                            {obj.description}
                                          </Typography>
                                          <Box m={0.5} />
                                        </Stack>
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
                                  {keyword("process_ingredients")}
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
                        <Alert severity="info">
                          {keyword("process_no_info")}
                        </Alert>
                      )}
                      {/* </CardContent> */}
                    </Box>
                  </Stack>
                </>
              )}
              {parentId ? (
                <Box maxWidth="fit-content" marginInline="auto">
                  <Button
                    onClick={() => setImage(parentId)}
                    startIcon={<KeyboardArrowLeft />}
                    variant="contained"
                  >
                    {keyword("previous_image")}
                  </Button>
                  <Box m={0.5} />
                  {parentId !== mainImageId ? (
                    <Button
                      onClick={() => setImage(mainImageId)}
                      startIcon={<KeyboardDoubleArrowLeft />}
                      variant="contained"
                    >
                      {keyword("first_image")}
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
