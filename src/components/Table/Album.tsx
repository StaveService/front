import React from "react";
import { useQuery } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import Image from "material-ui-image";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { IAlbum } from "../../interfaces";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import routes from "../../constants/routes.json";
import { lookupItunesAlbum } from "../../axios/itunes";
import Layout, { LayoutProps } from "./Layout";

interface AlbumProps extends LayoutProps {
  albums: IAlbum[] | undefined;
}

const Album: React.FC<AlbumProps> = ({
  albums,
  loading,
  page,
  pageCount,
  onPage,
}: AlbumProps) => {
  const { onError } = useQuerySnackbar();
  const ids = albums?.map((album) => album.link?.itunes).join(",");
  let i = 0;
  let imageUrl = "";
  // react-query
  const itunesAlbums = useQuery(
    [queryKey.ITUNES, queryKey.ALBUMS, ids],
    () => lookupItunesAlbum(ids).then((res) => res.results),
    {
      onError,
    }
  );
  return (
    <Layout page={page} pageCount={pageCount} onPage={onPage} loading={loading}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Link component={RouterLink} to={routes.ALBUMS}>
                Albums
              </Link>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {albums?.map(({ id, title, link }) => {
            if (link?.itunes && itunesAlbums.data) {
              imageUrl = itunesAlbums.data[i].artworkUrl60;
              i += 1;
            }
            return (
              <TableRow key={id}>
                <TableCell>
                  <Image src={imageUrl} />
                </TableCell>
                <TableCell>
                  <Link component={RouterLink} to={`${routes.ALBUMS}/${id}`}>
                    {title}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Layout>
  );
};
export default Album;
