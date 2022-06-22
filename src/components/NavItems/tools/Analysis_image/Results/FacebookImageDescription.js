import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

const FacebookImageDescription = ({classes, keyword, report}) => {
    return ( 
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableBody>
                {report.image_id && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {keyword("image_id")}
                    </TableCell>
                    <TableCell align="right">{report.image_id}</TableCell>
                  </TableRow>
                )}
                {report.image.caption && (
                    <TableRow>
                    <TableCell component="th" scope="row">
                      {keyword("facebook_image_caption")}
                    </TableCell>
                    <TableCell align="right">{report.image.caption}</TableCell>
                  </TableRow>
                )
                }
                {report.platform && (
                    <TableRow>
                        <TableCell component="th" scope="row">
                        {keyword("platform")}
                        </TableCell>
                        <TableCell align="right">{report.platform}</TableCell>
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
                {report.image.length && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {keyword("facebook_video_name_3")}
                    </TableCell>
                    <TableCell align="right">
                      {report.image.length}
                    </TableCell>
                  </TableRow>
                )}
                {report.image.can_tag && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {keyword("facebook_video_name_5")}
                    </TableCell>
                    <TableCell align="right">
                      {"" + report.image.can_tag.join(", ")}
                    </TableCell>
                  </TableRow>
                )}
                {report.image.created_time && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {keyword("facebook_video_name_9")}
                    </TableCell>
                    <TableCell align="right">
                      {report.image.created_time}
                    </TableCell>
                  </TableRow>
                )}
                {report.image.updated_time && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {keyword("facebook_video_name_8")}
                    </TableCell>
                    <TableCell align="right">
                      {report.image.updated_time}
                    </TableCell>
                  </TableRow>
                )}
                {report.verification_cues.twitter_search_url && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {keyword("twitter_search")}
                    </TableCell>
                    <TableCell align="right">
                    <a href={report.verification_cues.twitter_search_url}
                            rel="noopener noreferrer"
                            target="_blank">
                      {report.verification_cues.twitter_search_url}</a>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
    );
}
export default FacebookImageDescription;