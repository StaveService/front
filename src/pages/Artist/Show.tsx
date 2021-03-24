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
import MusicsTable from "../../components/Table/Music";
import BandsTable from "../../components/Table/Band";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artist, setArtist] = useState<IArtist>();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/artists/${params.id}`)
      .then((res) => setArtist(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [params]);

  if (!artist?.id) return <LinearProgress />;

  return (
    <Container>
      <Typography variant="h3">{artist.name}</Typography>
      <Typography variant="h3">Band</Typography>

      <BandsTable bands={artist.bands || []} loading={loading} />
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
      <MusicsTable musics={artist.musics || []} loading={loading} />
    </Container>
  );
};

export default Show;
