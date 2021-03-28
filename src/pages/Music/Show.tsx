import React, { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Image from "material-ui-image";
import AlbumsTable from "../../components/Table/Album";
import { IItunesMusic, IItunesMusicsResponse, IMusic } from "../../interfaces";
import routes from "../../router/routes.json";
import { itunesAxios } from "../../constants/axios";

const Show: React.FC = () => {
  const [music, setMusic] = useState<IMusic>();
  const [itunesMusic, setItunesMusic] = useState<IItunesMusic>();
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string; userId: string }>();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic>(
        `${routes.USERS}/${params.userId}${routes.MUSICS}/${params.id}`
      )
      .then((res) => setMusic(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (music) {
      itunesAxios
        .get<IItunesMusicsResponse>("/lookup", {
          params: { id: music.itunes_track_id, entity: "song" },
        })
        .then((res) => setItunesMusic(res.data.results[0]))
        .catch((err) => console.log(err));
    }
  }, [music]);

  return (
    <Container>
      <Typography variant="h3">{music?.title}</Typography>
      <Box height="100px" width="100px" m="auto">
        <Image src={itunesMusic?.artworkUrl100 || "undefiend"} />
      </Box>
      <Box mb={3}>
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
                  {music?.music_composers?.map((composer) => (
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
                  {music?.music_lyrists?.map((lyrists) => (
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
                <TableCell>{music?.bpm}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Length</TableCell>
                <TableCell>{music?.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>BAND</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BANDS}/${music?.band?.id || "undefined"}`}
                  >
                    {music?.band?.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created by</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USERS}/${music?.user?.id || "undefined"}`}
                  >
                    {music?.user?.nickname}
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box mb={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Artist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {music?.roles?.map((role) => (
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
      </Box>
      <AlbumsTable albums={music?.albums || []} loading={loading} />
    </Container>
  );
};

export default Show;
