import React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import { CardHeader, Divider, Grid2, Pagination } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import moment from "moment/moment";

import { WarningOutlined } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { treeMapToElements } from "./assistantUtils";
import { useDispatch } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const AssistantCommentResult = ({ collectdComments }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  //const sharedKeyword = i18nLoadNamespace("components/Shared/utils");
  const expandMinimiseText = keyword("expand_minimise_text");

  const classes = useMyStyles();
  const dispatch = useDispatch();
  const pageSize = 20;
  const numPages = Math.ceil(collectdComments.length / pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  function renderCommentList(commentList, offset = null, pageSize = null) {
    let renderedComments = [];
    if (offset === null) {
      offset = 0;
      pageSize = 99999;
    }

    let lastIndex = commentList.length;
    if (offset + pageSize < lastIndex) {
      lastIndex = offset + pageSize;
    }
    for (let i = offset; i < lastIndex; i++) {
      const comment = commentList[i];
      const text = comment.textOriginal;
      const authorName = comment.authorDisplayName;
      const publishedDate = moment(comment.publishedAt);
      const updatedDate = moment(comment.updatedAt);

      let renderedReplies = [];
      if ("replies" in comment) {
        renderedReplies = renderCommentList(comment.replies);
      }
      renderedComments.push(
        <ListItem key={comment.id}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <div>
                <span style={{ fontWeight: "bold" }}>{authorName}</span>{" "}
                <span style={{ fontStyle: "italic", fontSize: "small" }}>
                  {updatedDate.format("Do MMM YYYY hh:mm")}
                </span>
              </div>
              <Divider flexItem />
              <p>{text}</p>
              {renderedReplies}
            </CardContent>
          </Card>
        </ListItem>,
      );
    }

    return <List>{renderedComments}</List>;
  }

  function renderComments() {
    const offset = (currentPage - 1) * pageSize;
    return renderCommentList(collectdComments, offset, pageSize);
  }

  function pageChangeHandler(event, page) {
    setCurrentPage(page);
  }

  return (
    <Card data-testid="assistant-collected-comments">
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("collected_comments_title")}
      />
      <CardContent width="100%">
        <Pagination
          count={numPages}
          variant="outlined"
          onChange={pageChangeHandler}
          page={currentPage}
        />
        {renderComments()}
        <Pagination
          count={numPages}
          variant="outlined"
          onChange={pageChangeHandler}
          page={currentPage}
        />
      </CardContent>
    </Card>
  );
};
export default AssistantCommentResult;
