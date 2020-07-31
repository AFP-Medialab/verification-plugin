import React from "react";
import useMyStyles from "../MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/Shared/Footer.tsv";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";


const Footer = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/Shared/Footer.tsv", tsv);

    let provideBy, link, linkLabel, contactUs;

    switch (props.type) {
        case "iti":
            provideBy = keyword("iti_part_1");
            link = keyword("iti_link");
            linkLabel = keyword("iti_link_label");
            contactUs = keyword("iti_part_2");
            break;
        case "GRIHO":
            return (
                <div className={classes.footer}>
                    <Typography variant={"body2"}>
                        {
                            keyword("GRIHO_part_1")
                        }
                    </Typography>
                    <Typography variant={"body2"}>
                        {
                            keyword("GRIHO_part_2")
                        }
                        <Link href={"mailto:" + keyword("GRIHO_email")}>
                            {keyword("GRIHO_email")}
                        </Link>
                    </Typography>
                </div>
            );
        case "usfd":
            provideBy = "Provided by "//keyword("usfd_part_1");
            link = "https://gate.ac.uk/"//keyword("usfd_link");
            linkLabel = "USFD "//keyword("usfd_link_label");
            contactUs = "To contact us ..."//keyword("usfd_part_2"), to be updated to gate contacts;
            break;
        case "afp-usfd-eudisinfolab":
            provideBy = keyword("apf_part_1");
            link = [keyword("apf_link"), keyword("usfd_link"), keyword("eudisinfolab_link")];
            linkLabel = [keyword("apf_link_label"), ", " + keyword("usfd_link_label"), " " + keyword("and") + " " + keyword("eudisinfolab_link_label")];
            contactUs = keyword("apf_part_2");
            break;
        default:
            provideBy = keyword("apf_part_1");
            link = keyword("apf_link");
            linkLabel = keyword("apf_link_label");
            contactUs = keyword("apf_part_2");
            break;
    }

    return (
        <div className={classes.footer}>
            <Typography variant={"body2"}>
                {
                    provideBy
                }
                {
                    linkLabel.constructor === Array && link.constructor === Array ? (
                        link.map((element, index) => {
                            return (
                                <Link target="_blank" href={element} key={index}>
                                    {
                                        linkLabel[index]
                                    }
                                </Link>
                            )
                        })
                    ) : (
                            <Link target="_blank" href={link}>
                                {
                                    linkLabel
                                }
                            </Link>
                        )
                }
            </Typography>

            <Typography variant={"body2"}>
                {
                    contactUs
                }
            </Typography>
        </div>
    )
};
export default Footer;