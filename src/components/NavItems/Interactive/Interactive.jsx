import React, { useState } from "react";
import Iframe from "react-iframe";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Grid2 from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
} from "../../Shared/ReverseSearch/reverseSearchUtils";

const Interactive = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const keyword = i18nLoadNamespace("components/NavItems/Interactive");
  const answersAvailable = useSelector((state) => state.interactiveExplanation);
  const currentLang = useSelector((state) => state.language);

  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const carouselItems = () => {
    let res = [];
    let cpt = 1;
    while (keyword("quiz_item_url_" + cpt) !== "quiz_item_url_" + cpt) {
      res.push({
        url: keyword("quiz_item_url_" + cpt),
        title: keyword("quiz_item_title_" + cpt),
        answer: keyword("quiz_item_answer_" + cpt),
        answerUrl: keyword("quiz_item_answer_" + cpt + "_url"),
        ext: keyword("quiz_item_url_" + cpt)
          .split(".")
          .pop(),
      });
      cpt++;
    }
    return res;
  };
  const carousel = carouselItems();

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [answerExpanded, setAnswerExpanded] = useState(false);

  const handleExpanded = () => {
    if (answersAvailable) setAnswerExpanded(!answerExpanded);
    else alert(keyword("quiz_unlock_message"));
  };

  const previous = () => {
    setCarouselIndex(
      carouselIndex === 0 ? carousel.length - 1 : carouselIndex - 1,
    );
  };

  const next = () => {
    setCarouselIndex(
      carouselIndex === carousel.length - 1 ? 0 : carouselIndex + 1,
    );
  };

  return (
    <Paper className={classes.root}>
      <Box justifyContent="center" display="flex" flexDirection="column">
        <CustomTile text={keyword("quiz_title")} />
        {carousel.map((obj, key) => {
          const isImage =
            obj.ext === "jpg" ||
            obj.ext === "jpeg" ||
            obj.ext === "png" ||
            obj.ext === "bmp" ||
            obj.ext === "gif";
          return (
            <div key={key} hidden={key !== carouselIndex}>
              <div>
                {isImage ? (
                  <img
                    src={obj.url}
                    className={classes.InteractiveMedia}
                    alt={obj.url}
                  />
                ) : (
                  <Iframe
                    frameBorder={0}
                    src={obj.url}
                    width={"80%"}
                    height={window.innerHeight / 2}
                  />
                )}
              </div>
              <Grid2
                container
                justifyContent="space-between"
                spacing={2}
                alignContent={"center"}
              >
                <Grid2>
                  <Fab color={"primary"} onClick={previous}>
                    {isCurrentLanguageLeftToRight ? (
                      <NavigateBeforeIcon
                        fontSize={"large"}
                        style={{ color: "white" }}
                      />
                    ) : (
                      <NavigateNextIcon
                        fontSize={"large"}
                        style={{ color: "white" }}
                      />
                    )}
                  </Fab>
                </Grid2>
                <Grid2>
                  <Fab color={"primary"} onClick={next}>
                    {isCurrentLanguageLeftToRight ? (
                      <NavigateNextIcon
                        fontSize={"large"}
                        style={{ color: "white" }}
                      />
                    ) : (
                      <NavigateBeforeIcon
                        fontSize={"large"}
                        style={{ color: "white" }}
                      />
                    )}
                  </Fab>
                </Grid2>
              </Grid2>
              {isImage ? (
                <Grid2
                  container
                  justifyContent="center"
                  spacing={2}
                  alignContent={"center"}
                >
                  <Grid2>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        reverseImageSearch(
                          obj.url,
                          SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME,
                          false,
                        );
                      }}
                    >
                      {keyword("quiz_similarity")}
                    </Button>
                  </Grid2>
                  <Grid2>
                    <Button
                      data-testid="interactive-forensic"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        navigate(
                          "/app/tools/forensic/" + encodeURIComponent(obj.url),
                        );
                        //history.push("tools/forensic/" + encodeURIComponent(obj.url))
                      }}
                    >
                      {keyword("quiz_forensic")}
                    </Button>
                  </Grid2>
                </Grid2>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate(
                      "/app/tools/keyframes/" + encodeURIComponent(obj.url),
                    );
                    //history.push("tools/keyframes/" + encodeURIComponent(obj.url))
                  }}
                >
                  {keyword("quiz_keyframes")}
                </Button>
              )}

              <Box m={3} />
              <Typography variant={"h5"}>{obj.title}</Typography>
              <Accordion expanded={answerExpanded} onChange={handleExpanded}>
                <AccordionSummary
                  expandIcon={answersAvailable ? <ExpandMoreIcon /> : null}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Grid2
                    container
                    justifyContent="space-between"
                    spacing={2}
                    alignContent={"center"}
                  >
                    <Grid2>
                      <Typography className={classes.heading} align={"justify"}>
                        {keyword("quiz_explanations")}
                      </Typography>
                    </Grid2>
                    <Grid2>
                      {answersAvailable ? (
                        <LockOpenIcon />
                      ) : (
                        <LockOutlinedIcon />
                      )}
                    </Grid2>
                  </Grid2>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography align={"justify"}>
                    {obj.answer}
                    <Link target="_blank" href={obj.answerUrl}>
                      {obj.answerUrl}
                    </Link>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      </Box>
    </Paper>
  );
};
export default Interactive;
