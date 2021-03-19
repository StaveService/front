import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
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
import Typography from "@material-ui/core/Typography";
import { IMusic } from "../../interfaces";
import routes from "../../router/routes.json";

const Show: React.FC = () => {
  const [music, setMusic] = useState<IMusic>();
  const params = useParams<{ id: string; userId: string }>();
  useEffect(() => {
    axios
      .get<IMusic>(`/users/${params.userId}/musics/${params.id}`)
      .then((res) => setMusic(res.data))
      // TODO:
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }, []);
  if (!music?.id) return <LinearProgress />;
  return (
    <Container>
      <Typography variant="h3">{music.title}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Composer</TableCell>
              <TableCell>
                {music.music_composers?.map((composer) => (
                  <Link
                    key={composer.id}
                    component={RouterLink}
                    to={`${routes.ARTIST}${composer.id}`}
                  >
                    {composer.name}
                  </Link>
                ))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Lyrists</TableCell>
              <TableCell>
                {music.music_lyrists?.map((lyrists) => (
                  <Link
                    key={lyrists.id}
                    component={RouterLink}
                    to={`${routes.ARTIST}${lyrists.id}`}
                  >
                    {lyrists.name}
                  </Link>
                ))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>BPM</TableCell>
              <TableCell>{music.bpm}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Length</TableCell>
              <TableCell>{music.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>BAND</TableCell>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`${routes.BAND}${music.band?.id || "undefined"}`}
                >
                  {music.band?.name}
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created by</TableCell>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`${routes.USER}${music.user?.id || "undefined"}`}
                >
                  {music.user?.nickname}
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h3">Artists</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Artist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {music.roles?.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.role}</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.ARTIST}${role.artist.id}`}
                  >
                    {role.artist.name}
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
