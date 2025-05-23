import React, { useState } from "react";
import { useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";

import DoneIcon from "@mui/icons-material/Done";
import FileCopyIcon from "@mui/icons-material/FileCopy";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";

import { prettifyLargeString } from "../utils";

export const ArchiveTable = (props) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  const [clicks, setClicks] = useState([]);

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const handleIconClick = (id) => {
    let result = clicks.includes(id)
      ? clicks.filter((click) => click !== id)
      : [...clicks, id];
    setClicks(result);
  };

  useTrackEvent(
    "submission",
    "wacz_archiving",
    "WACZ archiving",
    props.fileName,
    client_id,
    props.fileName,
    uid,
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>
              {keyword("archived_url_table_header")}
            </TableCell>
            <TableCell sx={{ fontWeight: 700 }}>
              {keyword("original_url_table_header")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow
              key={row.archivedUrl}
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell component="th" scope="row">
                <Tooltip
                  title={
                    clicks.includes(row.archivedUrl) ? "Copied!" : "Copy link"
                  }
                >
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(row.archivedUrl);
                      handleIconClick(row.archivedUrl);
                    }}
                    aria-label="copy url"
                  >
                    {clicks.includes(row.archivedUrl) ? (
                      <DoneIcon color="success" />
                    ) : (
                      <FileCopyIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Link href={row.archivedUrl} target="_blank">
                  {prettifyLargeString(row.archivedUrl)}
                </Link>
              </TableCell>
              <TableCell>
                <Tooltip
                  title={
                    clicks.includes(row.archivedUrl) ? "Copied!" : "Copy link"
                  }
                >
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(row.originalUrl);
                      handleIconClick(row.originalUrl);
                    }}
                    aria-label="copy url"
                  >
                    {clicks.includes(row.originalUrl) ? (
                      <DoneIcon color="success" />
                    ) : (
                      <FileCopyIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Link href={row.originalUrl} target="_blank">
                  {prettifyLargeString(row.originalUrl)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArchiveTable;
