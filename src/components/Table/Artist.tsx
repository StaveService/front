import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import Pagination from "@material-ui/lab/Pagination";
import TwitterIcon from "../Icon/Twitter";
import LinkIconButton from "../Button/Icon/Link";
import { IArtist } from "../../interfaces";
import routes from "../../constants/routes.json";

interface ArtistProps {
  artists: IArtist[] | undefined;
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
}
const Artist: React.FC<ArtistProps> = ({
  artists,
  page,
  pageCount,
  onPage,
  loading,
}: ArtistProps) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Link component={RouterLink} to={routes.ARTISTS}>
                  Artists
                </Link>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {artists?.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.ARTISTS}/${artist.id}`}
                  >
                    {artist.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <LinkIconButton
                    href={
                      artist.artistLink?.twitter &&
                      `https://twitter.com/${
                        artist.artistLink?.twitter || "undefined"
                      }`
                    }
                  >
                    <TwitterIcon />
                  </LinkIconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <LinearProgress />}
      </TableContainer>
      {page && <Pagination count={pageCount} page={page} onChange={onPage} />}
    </>
  );
};
Artist.defaultProps = {
  page: undefined,
  pageCount: 10,
  onPage: undefined,
  loading: false,
};
export default Artist;
