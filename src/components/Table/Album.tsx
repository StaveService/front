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
import { itunes } from "../../axios";
import { IAlbum, IItunesAlbum, IItunesResponse } from "../../interfaces";
import routes from "../../router/routes.json";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

interface AlbumProps {
  albums: IAlbum[];
  loading?: boolean;
}
interface IMergedAlbum extends IAlbum {
  itunesArtworkUrl: string;
}
const Album: React.FC<AlbumProps> = ({ albums, loading }: AlbumProps) => {
  const [mergedAlbums, setMergedAlbums] = useState<IMergedAlbum[]>([]);
  const { onError } = useQuerySnackbar();
  // react-query
  const onSuccess = (results: IItunesAlbum[]) => {
    let i = 0;
    setMergedAlbums(
      albums.map((album) => {
        if (album.itunes_collection_id === results[i]?.collectionId) {
          const mergedMusic = {
            ...album,
            itunesArtworkUrl: results[i].artworkUrl60,
          };
          i += 1;
          return mergedMusic;
        }
        return { ...album, itunesArtworkUrl: "undefiend" };
      })
    );
  };
  useQuery(
    [
      "itunesMusics",
      albums.map((album) => album.itunes_collection_id).join(","),
    ],
    () =>
      itunes
        .get<IItunesResponse<IItunesAlbum>>("/lookup", {
          params: {
            id: albums.map((album) => album.itunes_collection_id).join(","),
            entity: "song",
          },
        })
        .then((res) => res.data.results),
    { onSuccess, onError }
  );
  return (
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
          {mergedAlbums.map((album) => (
            <TableRow key={album.id}>
              <TableCell>
                <Image src={album.itunesArtworkUrl} />
              </TableCell>
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
