import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import { IMusic } from "../../interfaces";

const Music: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IMusic[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic[]>("/musics")
      .then((res) => {
        console.log(res);
        setRows(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Band</TableCell>
            <TableCell>Composer</TableCell>
            <TableCell>Lyrist</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.band?.name}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell>{row.user?.nickname}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && <LinearProgress />}
    </TableContainer>
  );
};

export default Music;
