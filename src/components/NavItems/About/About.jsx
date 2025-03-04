import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid2 from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import {
  toggleHumanRightsCheckBox,
  toggleUnlockExplanationCheckBox,
} from "../../../redux/actions";
import {
  toggleAnalyticsCheckBox,
  toggleState,
} from "../../../redux/reducers/cookiesReducers";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import afpImage from "./images/Logo-AFP-384.png";
import afcnLogo from "./images/afcn_logo.png";
import arijLogo from "./images/arij_logo.png";
import itiImage from "./images/iti.jpg";
import europeImage from "./images/logo_EUh2020_horizontal.png";

const About = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/About");
  const currentLang = useSelector((state) => state.language);
  const humanRights = useSelector((state) => state.humanRightsCheckBox);
  const interactiveExplanation = useSelector(
    (state) => state.interactiveExplanation,
  );
  const cookiesUsage = useSelector((state) => state.cookies.active);
  const gaUsage = useSelector((state) => state.cookies.analytics);
  const dispatch = useDispatch();

  const additionalDangerousContent = () => {
    let res = [];
    let cpt = 1;
    while (keyword("additional_about_" + cpt) !== "") {
      res.push("additional_about_" + cpt);
      cpt++;
    }
    return res;
  };

  return (
    <Paper className={classes.root}>
      <Box
        justifyContent="center"
        display="flex"
        flexDirection="column"
        align={"center"}
      >
        <CustomTile text={keyword("about_title")} />
        <Box m={3} />
        <Typography variant={"body2"} align={"justify"}>
          {keyword("source_part_1")}
          {keyword("mit_licence_link_label")}
          {keyword("source_part_2")}
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("description")}
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("feedBack_part_1")}
          <Link href={"mailto:" + keyword("invid_email")}>
            {keyword("invid_email")}
          </Link>
          {/*
                        keyword("feedBack_part_2")
                    }
                    {
                            keyword("feedback_widget")
                    }
                    {
                        keyword("feedback_part_3")
                    */}
        </Typography>
        <Box m={3} />
        <Typography variant={"h6"}>{keyword("disclaimer")}</Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("disclaimer_text")}
        </Typography>
        <Box m={3} />
        <Typography variant={"h6"}>{keyword("privacy")}</Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("privacy_text")}
        </Typography>
        <Box m={3} />
        <Typography variant={"body2"} align={"justify"}>
          {keyword("info_weverify_part_1")}
          <Link target="_blank" href={keyword("info_weverify_link_website")}>
            {keyword("info_weverify_website")}
          </Link>
          {keyword("info_weverify_part_2")}
          <Link target="_blank" href={keyword("info_invid_link_twitter")}>
            {keyword("twitter")}
          </Link>
          {/*keyword("info_weverify_part_3")*/}
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("info_invid_part_1")}
          <Link target="_blank" href={keyword("info_invid_link_website")}>
            {keyword("info_invid_website")}
          </Link>
          {keyword("info_invid_part_2")}
          <Link target="_blank" href={keyword("info_invid_link_twitter")}>
            {keyword("twitter")}
          </Link>
          {keyword("info_invid_part_3")}
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("developed_text_part_1")}
          <Link target="_blank" href={keyword("medialab_link")}>
            {keyword("medialab_link_label")}
          </Link>
          {keyword("developed_text_part_2")}
          <Link target="_blank" href={keyword("iti_link")}>
            {keyword("iti_link_label")}
          </Link>
          {keyword("developed_text_part_3")}
          <Link target="_blank" href={keyword("lleida_link")}>
            {keyword("lleida_link_label")}
          </Link>
          <Link target="_blank" href={keyword("borelli_link")}>
            {keyword("borelli_link_label")}
          </Link>
          {keyword("developed_text_part_4")}
          <Link target="_blank" href={keyword("usfd_link")}>
            {keyword("usfd_link_label")}
          </Link>
          {keyword("arabic_translation_part_1")}
          <Link target="_blank" href={keyword("afcn_link")}>
            {keyword("afcn_link_label")}
          </Link>
          {keyword("arabic_translation_part_2")}
          <Link target="_blank" href={keyword("arij_link")}>
            {keyword("arij_link_label")}
          </Link>
        </Typography>
        {/*additionalDangerousContent().map((value, key) => {
          return (
            <div
              className={"content"}
              key={key}
              dangerouslySetInnerHTML={{ __html: value }}
            ></div>
          );
        })*/}
      </Box>
      <Grid2
        container
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        mb={4}
      >
        <Grid2 size={{ xs: 12 }}>
          <img className={classes.AboutMedia} src={afpImage} alt={afpImage} />
        </Grid2>
        <Grid2>
          <img className={classes.AboutMedia} src={itiImage} alt={itiImage} />
        </Grid2>
        <Grid2>
          <img
            className={classes.AboutMedia}
            src={europeImage}
            alt={europeImage}
          />
        </Grid2>
        {currentLang === "ar" ? (
          <>
            <Grid2 size={{ xs: 6 }}>
              <img
                className={classes.AboutMediaSmall}
                src={afcnLogo}
                alt={afcnLogo}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <img
                className={classes.AboutMediaSmall}
                src={arijLogo}
                alt={arijLogo}
              />
            </Grid2>
          </>
        ) : null}
      </Grid2>
      <FormControlLabel
        control={
          <Checkbox
            checked={humanRights}
            onChange={() => dispatch(toggleHumanRightsCheckBox())}
            value="checkedBox"
            color="primary"
          />
        }
        label={keyword("about_human_rights")}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={interactiveExplanation}
            onChange={() => dispatch(toggleUnlockExplanationCheckBox())}
            value="checkedBox"
            color="primary"
          />
        }
        label={keyword("quiz_unlock_explanations")}
      />
      {cookiesUsage !== null && (
        <FormControlLabel
          control={
            <Checkbox
              checked={cookiesUsage}
              onChange={() => dispatch(toggleState(cookiesUsage))}
              value="checkedBox"
              color="primary"
            />
          }
          label={keyword("storage_usage")}
        />
      )}
      {gaUsage !== null && (
        <FormControlLabel
          control={
            <Checkbox
              checked={gaUsage}
              onChange={() => dispatch(toggleAnalyticsCheckBox(gaUsage))}
              value="checkedBox"
              color="primary"
            />
          }
          label={keyword("cookies_usage")}
        />
      )}
    </Paper>
  );
};
export default About;
