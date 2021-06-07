import React, { useState } from "react";
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
import { useQuery } from "react-query";
import Pagination from "@material-ui/lab/Pagination";
import { IItunesMusic, IMusic } from "../../interfaces";
import routes from "../../constants/routes.json";
import queryKey from "../../constants/queryKey.json";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import { lookupItunesMusic } from "../../axios/itunes";

interface MusicProps {
  musics: IMusic[] | undefined;
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading?: boolean;
}
interface IMergedMusic extends IMusic {
  itunesArtworkUrl: string;
}
const Music: React.FC<MusicProps> = ({
  musics,
  page,
  pageCount,
  onPage,
  loading,
}: MusicProps) => {
  const [mergedMusics, setMergedMusics] = useState<IMergedMusic[]>([]);
  const ids = musics?.map((music) => music.musicLink?.itunes).join(",");
  const columns = [
    {
      route: routes.MUSICS,
      name: "Musics",
    },
    { route: routes.BANDS, name: "Bands" },
    {
      route: routes.ARTISTS,
      name: "Composers",
    },
    {
      route: routes.ARTISTS,
      name: "Lyrists",
    },
    { route: routes.USERS, name: "Users" },
  ];
  const { onError } = useQuerySnackbar();
  const onSuccess = (results: IItunesMusic[]) => {
    if (!musics) return;
    let i = 0;
    setMergedMusics(
      musics?.map((music) => {
        if (music.musicLink?.itunes === results[i]?.trackId) {
          const mergedMusic = {
            ...music,
            itunesArtworkUrl: results[i]?.artworkUrl60,
          };
          i += 1;
          return mergedMusic;
        }
        return { ...music, itunesArtworkUrl: "undefiend" };
      })
    );
  };
  useQuery(
    [queryKey.ITUNES, queryKey.MUSICS, ids],
    () => lookupItunesMusic(ids).then((res) => res.results),
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
            {mergedMusics.map(
              ({
                id,
                title,
                band,
                user,
                itunesArtworkUrl,
                composers,
                lyrists,
              }) => {
                return (
                  <TableRow key={id}>
                    <TableCell>
                      <Image src={itunesArtworkUrl} />
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
                      {band && (
                        <Link
                          component={RouterLink}
                          to={`${routes.BANDS}/${band?.id || "undefined"}`}
                        >
                          {band?.name}
                        </Link>
                      )}
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
                );
              }
            )}
          </TableBody>
        </Table>
        {loading && <LinearProgress />}
      </TableContainer>
      {page && <Pagination count={pageCount} page={page} onChange={onPage} />}
    </>
  );
};
Music.defaultProps = {
  page: undefined,
  pageCount: undefined,
  onPage: undefined,
  loading: false,
};
export default Music;
