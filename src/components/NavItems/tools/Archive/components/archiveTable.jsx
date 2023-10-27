import React, { useState } from "react";

import {
  Link,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";

import FileCopyIcon from "@mui/icons-material/FileCopy";
import DoneIcon from "@mui/icons-material/Done";
import { prettifyLargeString } from "../utils";
import { useTrackEvent } from "Hooks/useAnalytics";
import { getclientId } from "components/Shared/GoogleAnalytics/MatomoAnalytics";
import { useSelector } from "react-redux";

export const ArchiveTable = (props) => {
  const [clicks, setClicks] = useState([]);

  const client_id = getclientId();
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.email : null;

  const handleIconClick = (id) => {
    let result = clicks.includes(id)
      ? clicks.filter((click) => click != id)
      : [...clicks, id];
    setClicks(result);
  };

  useTrackEvent(
    "submission",
    "archiving",
    "archiving",
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
            <TableCell sx={{ fontWeight: 700 }}>Archived url</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Original url</TableCell>
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
