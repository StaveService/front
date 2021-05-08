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
import { IItunesMusic, IItunesResponse, IMusic } from "../../interfaces";
import routes from "../../router/routes.json";
import { itunes } from "../../axios";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

interface MusicProps {
  data: IMusic[] | undefined;
  page?: number;
  pageCount?: number;
  onPage?: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading: boolean | undefined;
  caption?: React.ReactNode | null;
}
interface IMergedMusic extends IMusic {
  itunesArtworkUrl: string;
}
const Music: React.FC<MusicProps> = ({
  data,
  page,
  pageCount,
  onPage,
  caption,
  loading,
}: MusicProps) => {
  const [mergedMusics, setMergedMusics] = useState<IMergedMusic[]>([]);
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
    if (!data) return;
    let i = 0;
    setMergedMusics(
      data.map((music) => {
        if (music.itunes_track_id === results[i]?.trackId) {
          const mergedMusic = {
            ...music,
            itunesArtworkUrl: results[i].artworkUrl60,
          };
          i += 1;
          return mergedMusic;
        }
        return { ...music, itunesArtworkUrl: "undefiend" };
      })
    );
  };
  useQuery(
    ["itunesMusics", data?.map((music) => music.itunes_track_id).join(",")],
    () =>
      itunes
        .get<IItunesResponse<IItunesMusic>>("/lookup", {
          params: {
            id: data?.map((music) => music.itunes_track_id).join(","),
            entity: "song",
          },
        })
        .then((res) => res.data.results),
    { onSuccess, onError }
  );
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          {caption && <caption>{caption}</caption>}
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
  caption: null,
  page: undefined,
  pageCount: 10,
  onPage: undefined,
};
export default Music;
