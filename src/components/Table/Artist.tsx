import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import { IArtist } from "../../interfaces";
import routes from "../../router/routes.json";

const Artist: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IArtist[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IArtist[]>("/artists")
      .then((res) => setRows(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Link component={RouterLink} to={`${routes.ARTIST}${row.id}`}>
                  {row.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && <LinearProgress />}
    </TableContainer>
  );
};

export default Artist;
