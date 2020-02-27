import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import europeImage from "./images/logo_EUh2020_horizontal.png"
import itiImage from "./images/iti.jpg"
import afpImage from "./images/Logo-AFP-384.png"
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {toggleHumanRightsCheckBox, toggleUnlockExplanationCheckBox} from "../../../redux/actions"
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/About.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import {toggleState} from "../../../redux/actions/cookiesActions";



const About = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/About.tsv", tsv);
    const humanRights = useSelector(state => state.humanRightsCheckBox);
    const interactiveExplanation = useSelector(state => state.interactiveExplanation);
    const cookiesUsage = useSelector(state => state.cookies);
    const dispatch = useDispatch();

    const additionalDangerousContent = () => {
        let res = [];
        let cpt = 1;
        while (keyword("additional_about_" + cpt) !== ""){
            res.push("additional_about_" + cpt);
            cpt++;
        }
        return res;
    };

    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column" align={"center"} >
                <CustomTile text={keyword("about_title")}/>
                <Box m={3}/>
                <Typography variant={"body2"} align={"justify"}>
                    {
                        keyword("source_part_1")
                    }
                    <Link target="_blank" href={keyword("mit_licence_link")}>
                        {
                            keyword("mit_licence_link_label")
                        }
                    </Link>
                    {
                        keyword("source_part_2")
                    }
                </Typography>
                <Typography variant={"body2"} align={"justify"}>{keyword("description")}</Typography>
                <Typography variant={"body2"} align={"justify"}>
                    {
                        keyword("feedBack_part_1")
                    }
                    <Link href={"mailto:" + keyword("invid_email")}>
                        {
                            keyword("invid_email")
                        }
                    </Link>
                    {
                        keyword("feedBack_part_2")
                    }
                    {
                            keyword("feedback_widget")
                    }
                    {
                        keyword("feedback_part_3")
                    }
                </Typography>
                <Box m={3}/>
                <Typography variant={"h6"}>{keyword("disclaimer")}</Typography>
                <Typography variant={"body2"} align={"justify"}>
                    {
                        keyword("disclaimer_text")
                    }
                </Typography>
                <Box m={3}/>
                <Typography variant={"h6"}>{keyword("privacy")}</Typography>
                <Typography variant={"body2"} align={"justify"}>
                    {
                        keyword("privacy_text")
                    }
                </Typography>
                <Box m={3}/>
                <Typography variant={"body2"} align={"justify"}>
                    {
                        keyword("info_invid_part_1")
                    }
                    <Link target="_blank" href={keyword("info_invid_website")}>
                        {
                            keyword("info_invid_website")
                        }
                    </Link>
                    {
                        keyword("info_invid_part_2")
                    }
                    <Link target="_blank" href={keyword("info_invid_link_twitter")}>
                        {
                            keyword("twitter")
                        }
                    </Link>
                    {
                        keyword("info_invid_part_3")
                    }
                </Typography>
                <Typography variant={"body2"} align={"justify"}>
                    {
                        keyword("info_weverify_part_1")
                    }
                    <Link target="_blank" href={keyword("info_weverify_link_website")}>
                        {
                            keyword("info_weverify_website")
                        }
                    </Link>
                    {
                        keyword("info_weverify_part_2")
                    }
                    <Link target="_blank" href={keyword("info_invid_link_twitter")}>
                        {
                            keyword("twitter")
                        }
                    </Link>
                    {
                        keyword("info_weverify_part_3")
                    }
                </Typography>
                <Typography variant={"body2"} align={"justify"}>
                    {
                        keyword("developed_text_part_1")
                    }
                    <Link target="_blank" href={keyword("medialab_link")}>
                        {
                            keyword("medialab_link_label")
                        }
                    </Link>
                    {
                        keyword("developed_text_part_2")
                    }
                    <Link target="_blank" href={keyword("iti_link")}>
                        {
                            keyword("iti_link_label")
                        }
                    </Link>
                    {
                        keyword("developed_text_part_3")
                    }
                    <Link target="_blank" href={keyword("lleida_link")}>
                        {
                            keyword("lleida_link_label")
                        }
                    </Link>
                    {
                        keyword("developed_text_part_4")
                    }
                </Typography>

                {
                    additionalDangerousContent().map((value, key) => {
                        return (
                            <div className={"content"} key={key} dangerouslySetInnerHTML={{__html: value}}></div>
                        )
                    })
                }
            </Box>
            <img className={classes.AboutMedia} src={afpImage} alt={afpImage}/>
            <Box m={1}/>
            <img className={classes.AboutMedia} src={itiImage}  alt={itiImage}/>
            <img className={classes.AboutMedia} src={europeImage} alt={europeImage}/>
            <Box m={1}/>
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
            {
                cookiesUsage !== null &&
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={cookiesUsage}
                            onChange={() => dispatch(toggleState())}
                            value="checkedBox"
                            color="primary"
                        />
                    }
                    label={keyword("cookies_usage")}
                />
            }
        </Paper>
    );
};
export default About;