import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import popUpEl from "./images/popUpImage/popUp_EL.png";
import popUpEn from "./images/popUpImage/popUp_EN.png";
import popUpEs from "./images/popUpImage/popUp_ES.png";
import popUpFr from "./images/popUpImage/popUp_FR.png";

// from https://material-ui.com/customization/default-theme/
// used typography body 2 style
const dangerousDivStyle = {
  textAlign: "justify",
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeight: 40,
  fontSize: "1rem",
  lineHeight: 1.5,
  letterSpacing: "0.00938em",
};

const Tutorial = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/Tutorial");
  const language = useSelector((state) => state.language);

  let popImg;
  switch (language) {
    case "fr":
      popImg = popUpFr;
      break;
    case "es":
      popImg = popUpEs;
      break;
    case "el":
      popImg = popUpEl;
      break;
    default:
      popImg = popUpEn;
      break;
  }

  return (
    <Paper variant="outlined" className={classes.root}>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CustomTile text={keyword("tuto_title")} />
        <Box
          sx={{
            m: 1,
          }}
        />
        <Alert severity="info" sx={{ mb: 2 }}>
          {
            <Trans
              t={keyword}
              i18nKey="afp_digital_courses_alert"
              components={{
                digitalCoursesUrl: (
                  <a
                    href={keyword("afp_digital_courses_url")}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--mui-palette-primary-main)" }}
                  />
                ),
              }}
            />
          }
        </Alert>
        <Typography variant="h3">{keyword("tuto_h_1")}</Typography>
        <Box
          sx={{
            m: 2,
          }}
        />
        <Box item={"true"}>
          <img src={popImg} alt={""} className={classes.InteractiveMedia} />
        </Box>
        <Box
          sx={{
            m: 1,
          }}
        />
        <div
          className={"content"}
          style={dangerousDivStyle}
          dangerouslySetInnerHTML={{ __html: keyword("tuto_1") }}
        ></div>
        <div
          className={"content"}
          style={dangerousDivStyle}
          dangerouslySetInnerHTML={{ __html: keyword("tuto_2") }}
        ></div>

        <Box
          sx={{
            m: 1,
          }}
        />
        <Typography variant="h3">{keyword("tuto_h_2")}</Typography>
        <Box
          sx={{
            m: 1,
          }}
        />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("analysis_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_4") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("keyframes_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_5") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("youtube_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_6") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("twitter_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_7") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("magnifier_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_8") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("metadata_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_9") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("copyright_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_10") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("forensic_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_11") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("twitter_sna_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_13") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("contextual_menu_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_12") }}
            ></div>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("analysis_image_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_analysis_img") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("ocr_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_ocr") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("checkgif_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_checkgif") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("factcheck_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_factcheck") }}
            ></div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              {keyword("xnetwork_title")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={"content"}
              style={dangerousDivStyle}
              dangerouslySetInnerHTML={{ __html: keyword("tuto_xnetwork") }}
            ></div>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
};
export default Tutorial;
