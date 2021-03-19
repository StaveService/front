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
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { IArtist } from "../../interfaces";
import routes from "../../router/routes.json";

const Show: React.FC = () => {
  const [artist, setArtist] = useState<IArtist>();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    axios
      .get(`/artists/${params.id}`)
      .then((res) => setArtist(res.data))
      // TODO:
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }, []);
  if (!artist?.id) return <LinearProgress />;
  return (
    <Container>
      <Typography variant="h3">{artist.name}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Music</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artist.musics?.map((music) => (
              <TableRow key={music.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USER}${music.user?.id || "undefined"}${
                      routes.MUSIC
                    }${music.id}`}
                  >
                    {music.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USER}${music.user?.id || "undefined"}`}
                  >
                    {music.user?.nickname}
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
