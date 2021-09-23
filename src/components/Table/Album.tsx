import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Image from "material-ui-image";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { IAlbum } from "../../interfaces";
import routes from "../../constants/routes.json";
import Layout, { LayoutProps } from "./Layout";
import { useLookupItunesAlbum } from "../../reactQuery/itunes";

interface AlbumProps extends LayoutProps {
  albums: IAlbum[];
}
const Album: React.FC<AlbumProps> = ({
  albums,
  loading,
  page,
  pageCount,
  onPage,
}: AlbumProps) => {
  const ids = albums.map((album) => album.link.itunes).join(",");
  let i = 0;
  let imageUrl: string | undefined = "";
  // react-query
  const itunesAlbums = useLookupItunesAlbum({ id: ids });
  return (
    <Layout page={page} pageCount={pageCount} onPage={onPage} loading={loading}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Link component={RouterLink} to={routes.ALBUMS}>
                <FormattedMessage id="albums" />
              </Link>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {albums?.map(({ id, title, link }) => {
            if (
              link.itunes &&
              itunesAlbums.data &&
              itunesAlbums.data[i] &&
              link.itunes === itunesAlbums.data[i].collectionId
            ) {
              imageUrl = itunesAlbums.data[i].artworkUrl60;
              i += 1;
            } else {
              imageUrl = undefined;
            }
            return (
              <TableRow key={id}>
                <TableCell>{imageUrl && <Image src={imageUrl} />}</TableCell>
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
