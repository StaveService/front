import React from "react";
import { useQueryClient } from "react-query";
import { Link as RouterLink, useParams } from "react-router-dom";
import { format } from "date-fns";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import AlbumsTable from "../../../../../components/Table/Album";
import ItunesIcon from "../../../../../components/Icon/Itunes";
import MainDialog from "./Dialog/Main";
import RoleDialog from "./Dialog/Role";
import AlbumDialog from "./Dialog/Album";
import routes from "../../../../../router/routes.json";
import { selectCurrentUser } from "../../../../../slices/currentUser";
import { IItunesMusic, IMusic } from "../../../../../interfaces";

const Info: React.FC = () => {
  const params = useParams<{ userId: string; id: string }>();
  const currentUser = useSelector(selectCurrentUser);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(["musics", params.id]);
  const itunesMusic = queryClient.getQueryData<IItunesMusic>([
    "itunesMusics",
    music?.itunes_track_id,
  ]);
  return (
    <>
      <Box mb={3}>
        <Button
          startIcon={<ItunesIcon />}
          component={Link}
          href={itunesMusic?.artistViewUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Itunes
        </Button>
        {currentUser?.id === Number(params.userId) && <MainDialog />}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Main</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>ReleaseDate</TableCell>
                <TableCell>
                  {itunesMusic?.releaseDate &&
                    format(new Date(itunesMusic.releaseDate), "yyyy/MM/dd")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Composer</TableCell>
                <TableCell>
                  {music?.music_composers?.map((composer) => (
                    <Link
                      key={composer.id}
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${composer.id}`}
                    >
                      {composer.name}
                    </Link>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lyrists</TableCell>
                <TableCell>
                  {music?.music_lyrists?.map((lyrists) => (
                    <Link
                      key={lyrists.id}
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${lyrists.id}`}
                    >
                      {lyrists.name}
                    </Link>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Band</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.BANDS}/${music?.band?.id || "undefined"}`}
                  >
                    {music?.band?.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created by</TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`${routes.USERS}/${music?.user?.id || "undefined"}`}
                  >
                    {music?.user?.nickname}
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mb={3}>
        {currentUser?.id === Number(params.userId) && <RoleDialog />}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Artist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {music?.roles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.role}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${role.artist.id}`}
                    >
                      {role.artist.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {currentUser?.id === Number(params.userId) && <AlbumDialog />}
      <AlbumsTable albums={music?.albums || []} />
    </>
  );
};
export default Info;
