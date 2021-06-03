import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import Image from "material-ui-image";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import { IAlbum, IItunesAlbum } from "../../interfaces";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import routes from "../../constants/routes.json";
import { lookupItunesAlbum } from "../../axios/itunes";

interface AlbumProps {
  albums: IAlbum[] | undefined;
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
}
interface IMergedAlbum extends IAlbum {
  itunesArtworkUrl: string;
}
const Album: React.FC<AlbumProps> = ({
  albums,
  loading,
  page,
  pageCount,
  onPage,
}: AlbumProps) => {
  const [mergedAlbums, setMergedAlbums] = useState<IMergedAlbum[]>([]);
  const { onError } = useQuerySnackbar();
  const ids = albums?.map((album) => album.albumLink?.itunes).join(",");
  // react-query
  const onSuccess = (results: IItunesAlbum[]) => {
    if (!albums) return;
    let i = 0;
    setMergedAlbums(
      albums.map((album) => {
        if (album.albumLink?.itunes === results[i]?.collectionId) {
          const mergedMusic = {
            ...album,
            itunesArtworkUrl: results[i]?.artworkUrl60,
          };
          i += 1;
          return mergedMusic;
        }
        return { ...album, itunesArtworkUrl: "undefiend" };
      })
    );
  };
  useQuery(
    [queryKey.ITUNES, queryKey.ALBUMS, ids],
    () => lookupItunesAlbum(ids).then((res) => res.results),
    {
      onSuccess,
      onError,
    }
  );
  return (
    <>
      <TableContainer component={Paper}>
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
            {mergedAlbums.map(({ id, itunesArtworkUrl, title }) => (
              <TableRow key={id}>
                <TableCell>
                  <Image src={itunesArtworkUrl} />
                </TableCell>
                <TableCell>
                  <Link component={RouterLink} to={`${routes.ALBUMS}/${id}`}>
                    {title}
                  </Link>
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
Album.defaultProps = {
  page: undefined,
  pageCount: 10,
  onPage: undefined,
  loading: false,
};
export default Album;
