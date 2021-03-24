import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Image from "material-ui-image";
import LinearProgress from "@material-ui/core/LinearProgress";
import { IMusic } from "../../interfaces";
import routes from "../../router/routes.json";

interface IIndex {
  musics: IMusic[];
  loading: boolean;
}

const Music: React.FC<IIndex> = ({ musics, loading }: IIndex) => {
  const columns = [
    {
      route: routes.MUSICS,
      name: "Musics",
    },
    {
      route: routes.ARTISTS,
      name: "Composers",
    },
    {
      route: routes.ARTISTS,
      name: "Lyrists",
    },
    { route: routes.BANDS, name: "Bands" },
    { route: routes.USERS, name: "Users" },
  ];
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((column) => (
              <TableCell key={column.name}>
                <Link component={RouterLink} to={column.route}>
                  {column.name}
                </Link>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {musics.map(
            ({
              id,
              title,
              itunes_artwork_url: itunesArtworkUrl,
              band,
              user,
              music_composers: composers,
              music_lyrists: lyrists,
            }) => (
              <TableRow key={id}>
                <TableCell>
                  <Image
                    src={itunesArtworkUrl}
                    disableSpinner={!itunesArtworkUrl}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USERS}/${user?.id || "undefined"}${
                      routes.MUSICS
                    }/${id}`}
                  >
                    {title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BANDS}/${band?.id || "undefined"}`}
                  >
                    {band?.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {composers?.map((composer) => (
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
                  {lyrists?.map((lyrist) => (
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
                    to={`${routes.USERS}/${user?.id || "undefined"}`}
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

export default Music;