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
                    to={`${routes.ARTISTS}/${composer.id}`}
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
                    to={`${routes.ARTISTS}/${lyrists.id}`}
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
                  to={`${routes.BANDS}/${music.band?.id || "undefined"}`}
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
                  to={`${routes.USERS}/${music.user?.id || "undefined"}`}
                >
                  {music.user?.nickname}
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h3">Artist</Typography>
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
                    to={`${routes.ARTISTS}/${role.artist.id}`}
                  >
                    {role.artist.name}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h3">Album</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Album</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {music.albums?.map((album) => (
              <TableRow key={album.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.ALBUMS}/${album.id}`}
                  >
                    {album.title}
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
