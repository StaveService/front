import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { IAlbum } from "../../interfaces";
import routes from "../../router/routes.json";

interface AlbumProps {
  albums: IAlbum[];
  loading?: boolean;
}
const Album: React.FC<AlbumProps> = ({ albums, loading }: AlbumProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Link component={RouterLink} to={routes.ALBUMS}>
                Albums
              </Link>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {albums.map((album) => (
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
      {loading && <LinearProgress />}
    </TableContainer>
  );
};
Album.defaultProps = {
  loading: false,
};
export default Album;
