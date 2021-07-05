import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import TwitterIcon from "../Icon/Twitter";
import LinkIconButton from "../Button/Icon/Link";
import { IArtist } from "../../interfaces";
import routes from "../../constants/routes.json";
import Layout, { LayoutProps } from "./Layout";

interface ArtistProps extends LayoutProps {
  artists: IArtist[] | undefined;
}
const Artist: React.FC<ArtistProps> = ({
  artists,
  page,
  pageCount,
  onPage,
  loading,
}: ArtistProps) => {
  return (
    <Layout page={page} pageCount={pageCount} onPage={onPage} loading={loading}>
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
                    artist.link.twitter
                      ? `https://twitter.com/${artist.link.twitter}`
                      : undefined
                  }
                >
                  <TwitterIcon />
                </LinkIconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
};
export default Artist;
