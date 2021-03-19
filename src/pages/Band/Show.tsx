import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { IBand } from "../../interfaces";
import routes from "../../router/routes.json";

const Show: React.FC = () => {
  const [band, setBand] = useState<IBand>();
  const params = useParams<{ id: string; userId: string }>();
  useEffect(() => {
    axios
      .get<IBand>(`/bands/${params.id}`)
      .then((res) => setBand(res.data))
      // TODO:
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }, []);

  if (!band?.id) return <LinearProgress />;

  return (
    <Container>
      <Typography variant="h3">{band.name}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Artist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {band.artists?.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.ARTIST}${artist.id}`}
                  >
                    {artist.name}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Show;
