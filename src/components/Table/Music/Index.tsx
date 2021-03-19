import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import { IMusic } from "../../../interfaces";
import routes from "../../../router/routes.json";

const Musics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IMusic[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic[]>("/musics")
      .then((res) => setRows(res.data))
      // TODO:
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Link component={RouterLink} to={routes.MUSICS}>
                Music
              </Link>
            </TableCell>
            <TableCell>
              <Link component={RouterLink} to={routes.BANDS}>
                Band
              </Link>
            </TableCell>
            <TableCell>
              <Link component={RouterLink} to={routes.BANDS}>
                Composer
              </Link>
            </TableCell>
            <TableCell>
              <Link component={RouterLink} to={routes.BANDS}>
                Lyrist
              </Link>
            </TableCell>
            <TableCell>
              <Link component={RouterLink} to={routes.USERS}>
                User
              </Link>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(
            // eslint-disable-next-line camelcase
            ({ id, title, band, user, music_composers, music_lyrists }) => (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USER}${user?.id || "undefined"}${
                      routes.MUSIC
                    }${id}`}
                  >
                    {title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BAND}${band?.id || "undefined"}`}
                  >
                    {band?.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {music_composers?.map((composer) => (
                    <Link
                      key={composer.id}
                      component={RouterLink}
                      to={`${routes.ARTIST}${composer.id}`}
                    >
                      {composer.name}
                    </Link>
                  ))}
                </TableCell>
                <TableCell>
                  {music_lyrists?.map((lyrist) => (
                    <Link
                      key={lyrist.id}
                      component={RouterLink}
                      to={`${routes.ARTIST}${lyrist.id}`}
                    >
                      {lyrist.name}
                    </Link>
                  ))}
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USER}${user?.id || "undefined"}`}
                  >
                    {user?.nickname}
                  </Link>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      {loading && <LinearProgress />}
    </TableContainer>
  );
};

export default Musics;
