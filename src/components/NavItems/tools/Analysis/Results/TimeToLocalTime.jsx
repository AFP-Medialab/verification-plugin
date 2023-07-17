import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";

const TimeToLocalTime = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Analysis.tsv",
    tsv,
  );
  const regex = /(.*), (.*) \(?UTC\)?/;
  let link = undefined;
  if (regex.test(props.time)) {
    const date_and_time = props.time.match(regex);
    const url = "http://www.timeanddate.com/worldclock/converter.html?iso=";
    link =
      url +
      date_and_time[1].replace(/-/g, "") +
      "T" +
      date_and_time[2].replace(/:/g, "");
  }

  return (
    <div>
      <Typography variant="body2" className={classes.text}>
        {props.time}
        {link && (
          <Link href={link} target={"_blank"}>
            {keyword("convert_to_local_time")}
          </Link>
        )}
      </Typography>
    </div>
  );
};
export default TimeToLocalTime;
