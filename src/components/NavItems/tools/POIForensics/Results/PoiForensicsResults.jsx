import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import ErrorBoundaryFallback from "@Shared/ErrorBoundaryFallback/ErrorBoundaryFallback";
import { JsonBlock } from "@Shared/JsonBlock";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { LineChart } from "@mui/x-charts/LineChart";
import { result } from "lodash";

import { usePoiSync } from "../Hooks/usePoiSync";
import { drawBoundingBox } from "../poiUtils";

/**
 * React component that displays the results of POI forensics feature
 * @param {results, handleClose} props
 * @returns
 */
const PoiForensicsResults = (props) => {
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const keyword = i18nLoadNamespace("components/NavItems/tools/PoiForensics");

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const results = props.result;

  const [xAxisData, setXAxisData] = useState([]);
  const [yAxisData, setYAxisData] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (
      results &&
      results.poi_forensics_report &&
      results.poi_forensics_report.scores_per_time
    ) {
      const scores = results.poi_forensics_report.scores_per_time;
      const times = results.poi_forensics_report.time_vector;

      setYAxisData(scores);
      setXAxisData(times);
    }
  }, [results]);

  // this is meant to prevent JS error in the console for the first render
  // we dont build teh graph if the axis data are not fullfilled
  const hasData = xAxisData.length > 0 && yAxisData.length > 0;

  const handleClose = () => {
    props.handleClose();
  };

  const handleChartClick = (event, d) => {
    if (d && d.dataIndex !== undefined) {
      const index = d.dataIndex;
      setSelectedIndex(index);

      const timestamp = results.poi_forensics_report.time_vector[index];
      if (videoRef.current) {
        videoRef.current.currentTime = timestamp;

        videoRef.current.onseeked = () => drawBoundingBox(index);
      }
    }
  };

  // this personalized Hook is in charge of syncing the canvas with the video so we can have a box around the face
  // when its detected
  usePoiSync(videoRef, canvasRef, results, setSelectedIndex);

  return (
    <>
      <Card variant="outlined" sx={{ width: "100%" }}>
        <CardHeader
          title={keyword("poi_forensics_result_title")}
          action={
            <IconButton aria-label="close" onClick={handleClose} sx={{ p: 1 }}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Stack direction="column" spacing={4}>
            <Grid
              container
              direction="row"
              sx={{
                justifyContent: "space-evenly",
                alignItems: "flex-start",
              }}
            >
              <Stack direction="row" spacing={4}>
                <Grid size={{ xs: 6 }} container direction="column" spacing={2}>
                  <Grid
                    size={{ xs: 6 }}
                    container
                    direction="column"
                    sx={{
                      width: "100%",
                    }}
                  >
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          lineHeight: 0,
                        }}
                      >
                        <video
                          ref={videoRef}
                          crossOrigin="anonymous"
                          height="auto"
                          controls
                          key={results.poi_forensics_report.video_path}
                          style={{
                            borderRadius: "10px",
                            maxHeight: "50vh",
                            width: "auto",
                            maxWidth: "100%",
                            display: "block",
                            objectFit: "contain",
                          }}
                          controlsList="nofullscreen nodownload"
                          disablePictureInPicture={true}
                        >
                          <source
                            src={results.poi_forensics_report.video_path}
                            type="video/mp4"
                          />
                        </video>
                        <canvas
                          ref={canvasRef}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            pointerEvents: "none",
                            borderRadius: "10px",
                          }}
                        />
                      </Box>
                    </ErrorBoundary>
                  </Grid>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Stack
                    direction="column"
                    sx={{
                      justifyContent: "center",
                    }}
                  >
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                      {hasData && (
                        <>
                          <LineChart
                            xAxis={[
                              {
                                data: xAxisData,
                                min: 0,
                              },
                            ]}
                            yAxis={[
                              {
                                min: 0,
                              },
                            ]}
                            series={[
                              {
                                data: yAxisData,
                              },
                            ]}
                            height={300}
                            grid={{ vertical: true, horizontal: true }}
                            onAxisClick={handleChartClick}
                          >
                            <ChartsReferenceLine
                              y={1}
                              label={keyword("poi_forensics_result_treshold")}
                              lineStyle={{
                                stroke: "red",
                                strokeDasharray: "3 3",
                              }}
                            />
                          </LineChart>
                          <Typography>
                            {keyword("poi_forensics_graph_title")}
                          </Typography>
                        </>
                      )}
                    </ErrorBoundary>
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default PoiForensicsResults;
