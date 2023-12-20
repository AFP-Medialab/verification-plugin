import React from "react";
import useMyStyles from "../MaterialUiStyles/useMyStyles";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const Footer = (props) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/Shared/Footer");

  let provideBy, link, linkLabel, contactUs;

  switch (props.type) {
    case "iti":
      provideBy = keyword("iti_part_1");
      link = keyword("iti_link");
      linkLabel = keyword("iti_link_label");
      contactUs = keyword("iti_part_2");
      break;
    case "iti-unina":
      provideBy = keyword("iti_part_1");
      link = [keyword("iti_link"), keyword("unina_link")];
      linkLabel = keyword("iti_link_label");
      linkLabel = [
        keyword("iti_link_label"),
        " " + keyword("and") + " " + keyword("unina_link_label"),
      ];
      contactUs = keyword("iti_part_2");
      break;
    case "GRIHO":
      return (
        <div className={classes.footer}>
          <Typography variant={"body2"}>{keyword("GRIHO_part_1")}</Typography>
          <Typography variant={"body2"}>
            {keyword("GRIHO_part_2")}
            <Link href={"mailto:" + keyword("GRIHO_email")}>
              {keyword("GRIHO_email")}
            </Link>
          </Typography>
        </div>
      );
    case "usfd":
      provideBy = keyword("usfd_part_1");
      link = keyword("usfd_link");
      linkLabel = keyword("usfd_link_label");
      contactUs = keyword("usfd_part_2");
      break;
    case "afp-usfd-eudisinfolab":
      provideBy = keyword("afp_part_1");
      link = [
        keyword("afp_link"),
        keyword("usfd_link"),
        keyword("eudisinfolab_link"),
      ];
      linkLabel = [
        keyword("afp_link_label"),
        ", " + keyword("usfd_link_label"),
        " " + keyword("and") + " " + keyword("eudisinfolab_link_label"),
      ];
      contactUs = keyword("afp_part_2");
      break;
    case "iti-borelli-afp":
      provideBy = keyword("iti_part_1");
      link = [
        keyword("iti_link"),
        keyword("borelli_link"),
        keyword("afp_link"),
      ];
      linkLabel = [
        keyword("iti_link_label"),
        ", " + keyword("borelli_link_label"),
        " " + keyword("and") + " " + keyword("afp_link_label"),
      ];
      contactUs = keyword("afp_part_2");
      break;
    case "borelli-afp":
      provideBy = keyword("borelli_part_1");
      link = [keyword("borelli_link"), keyword("afp_link")];
      linkLabel = [
        keyword("borelli_link_label"),
        " " + keyword("and") + " " + keyword("afp_link_label"),
      ];
      contactUs = keyword("afp_part_2");
      break;
    default:
      provideBy = keyword("afp_part_1");
      link = keyword("afp_link");
      linkLabel = keyword("afp_link_label");
      contactUs = keyword("afp_part_2");
      break;
  }

  return (
    <div className={classes.footer}>
      <Typography variant={"body2"}>
        {provideBy}
        {linkLabel.constructor === Array && link.constructor === Array ? (
          link.map((element, index) => {
            return (
              <Link target="_blank" href={element} key={index}>
                {linkLabel[index]}
              </Link>
            );
          })
        ) : (
          <Link target="_blank" href={link}>
            {linkLabel}
          </Link>
        )}
      </Typography>

      <Typography variant={"body2"}>{contactUs}</Typography>
    </div>
  );
};
export default Footer;
