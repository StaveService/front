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
      .catch((err) => console.log(err));
  }, [params]);

  if (!artist?.id) return <LinearProgress />;

  return (
    <Container>
      <Typography variant="h3">{artist.name}</Typography>
      <Typography variant="h3">Band</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Band</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artist.bands?.map((band) => (
              <TableRow key={band.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BANDS}/${band.id}`}
                  >
                    {band.name}
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
              <TableCell>Band</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artist.albums?.map((album) => (
              <TableRow key={album.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BANDS}/${album.id}`}
                  >
                    {album.title}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h3">Music</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Music</TableCell>
              <TableCell>Composer</TableCell>
              <TableCell>Lyrist</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artist.musics?.map((music) => (
              <TableRow key={music.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USERS}/${music.user?.id || "undefined"}${
                      routes.MUSICS
                    }/${music.id}`}
                  >
                    {music.title}
                  </Link>
                </TableCell>
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
                <TableCell>
                  {music.music_lyrists?.map((lyrist) => (
                    <Link
                      key={lyrist.id}
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${lyrist.id}`}
                    >
                      {lyrist.name}
                    </Link>
                  ))}
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USERS}/${music.user?.id || "undefined"}`}
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
