import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "react-query";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Image from "material-ui-image";
import Layout, { LayoutProps } from "./Layout";
import { IMusic } from "../../interfaces";
import routes from "../../constants/routes.json";
import queryKey from "../../constants/queryKey.json";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import { lookupItunesMusic } from "../../axios/itunes";

interface MusicProps extends LayoutProps {
  musics: IMusic[];
}
const Music: React.FC<MusicProps> = ({
  musics,
  page,
  pageCount,
  onPage,
  loading,
}: MusicProps) => {
  const ids = musics.map((music) => music.link.itunes || 0).join(",");
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
  let i = 0;
  let imageUrl = "";
  const { onError } = useQuerySnackbar();
  const itunesMusics = useQuery(
    [queryKey.ITUNES, queryKey.MUSICS, ids],
    () => lookupItunesMusic<string>(ids).then((res) => res.results),
    {
      enabled: !!ids,
      onError,
    }
  );
  return (
    <Layout page={page} pageCount={pageCount} onPage={onPage} loading={loading}>
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
          {musics?.map(
            ({ id, title, band, user, composers, lyrists, link }) => {
              if (link.itunes && itunesMusics.data) {
                imageUrl = itunesMusics.data[i].artworkUrl60;
                i += 1;
              }
              return (
                <TableRow key={id}>
                  <TableCell>
                    {imageUrl && (
                      <Image loading={itunesMusics.isLoading} src={imageUrl} />
                    )}
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
    </Layout>
  );
};
export default Music;
