import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const FacebookVideoDescription = ({classes, keyword, report}) => {
    return (
    <Table
      className={classes.table}
      size="small"
      aria-label="a dense table"
    >
      <TableBody>
      {report.video.description && (
        <TableRow>
          <TableCell component="th" scope="row">
            {keyword("facebook_video_name_6")}
          </TableCell>
          <TableCell align="right">{report.video.description}</TableCell>
        </TableRow>
      )}
      {report.source.from && (
          <TableRow>
            <TableCell component="th" scope="row">
            {keyword("source")}
            </TableCell>
            <TableCell align="right">{report.source.from}</TableCell>
          </TableRow>
        )}
        {report.video_id && (
          <TableRow>
            <TableCell component="th" scope="row">
            {keyword("facebook_video_name_1")}
            </TableCell>
            <TableCell align="right">{report.video_id}</TableCell>
          </TableRow>
        )}
          <TableRow>
            <TableCell component="th" scope="row">
              {keyword("facebook_video_name_2")}
            </TableCell>
            <TableCell align="right">
              {report.video.title}
            </TableCell>
          </TableRow>
        {report.video.length && (
          <TableRow>
            <TableCell component="th" scope="row">
              {keyword("facebook_video_name_3")}
            </TableCell>
            <TableCell align="right">
              {report.video.length}
            </TableCell>
          </TableRow>
        )}
        {report.video.content_category && (
          <TableRow>
            <TableCell component="th" scope="row">
              {keyword("facebook_video_name_4")}
            </TableCell>
            <TableCell align="right">
              {report.video.content_category}
            </TableCell>
          </TableRow>
        )}
        {report.video.content_tags && (
          <TableRow>
            <TableCell component="th" scope="row">
              {keyword("facebook_video_name_5")}
            </TableCell>
            <TableCell align="right">
              {"" + report.video.content_tags.join(", ")}
            </TableCell>
          </TableRow>
        )}
        {report.video.likes && (
          <TableRow>
            <TableCell component="th" scope="row">
              {keyword("facebook_video_name_7")}
            </TableCell>
            <TableCell align="right">
              {report.video.likes}
            </TableCell>
          </TableRow>
        )}
        {report.video.updated_time && (
          <TableRow>
            <TableCell component="th" scope="row">
              {keyword("facebook_video_name_8")}
            </TableCell>
            <TableCell align="right">
              {report.video.updated_time}
            </TableCell>
          </TableRow>
        )}
        {report.video.created_time && (
          <TableRow>
            <TableCell component="th" scope="row">
              {keyword("facebook_video_name_9")}
            </TableCell>
            <TableCell align="right">
              {report.video.created_time}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    )
};
export default FacebookVideoDescription;