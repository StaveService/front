import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSnackbar } from "notistack";
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
import { IItunesMusic, IItunesResponse, IMusic } from "../../interfaces";
import routes from "../../router/routes.json";
import { itunes } from "../../axios";

interface MusicProps {
  musics: IMusic[];
  loading: boolean;
}

interface IMergedMusic extends IMusic {
  itunesArtworkUrl: string;
}
const Music: React.FC<MusicProps> = ({ musics, loading }: MusicProps) => {
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
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (!musics.length) return;
    itunes
      .get<IItunesResponse<IItunesMusic>>("/lookup", {
        params: {
          id: musics.map((music) => music.itunes_track_id).join(","),
          entity: "song",
        },
      })
      .then((res) => {
        let i = 0;
        const { results } = res.data;
        setMergedMusics(
          musics.map((music) => {
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
      })
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }));
  }, [musics]);
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
          {mergedMusics.map(
            ({
              id,
              title,
              band,
              user,
              itunesArtworkUrl,
              music_composers: composers,
              music_lyrists: lyrists,
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
  );
};

export default Music;
