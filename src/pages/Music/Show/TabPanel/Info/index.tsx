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
import AlbumsTable from "../../../../../components/Table/Album";
import ItunesButton from "../../../../../components/Button/Link/Itunes";
import TwitterButton from "../../../../../components/Button/Link/Twitter";
import MainDialog from "./Dialog/Main";
import RoleDialog from "./Dialog/Artist";
import AlbumDialog from "./Dialog/Album";
import routes from "../../../../../router/routes.json";
import { selectCurrentUser } from "../../../../../slices/currentUser";
import { IItunesMusic, IMusic } from "../../../../../interfaces";

const Info: React.FC = () => {
  const params = useParams<{ userId: string; id: string }>();
  const currentUser = useSelector(selectCurrentUser);
  const isSignedIn = currentUser?.id === Number(params.userId);
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(["music", params.id]);
  const itunesMusic = queryClient.getQueryData<IItunesMusic>([
    "itunesMusic",
    music?.musicLink?.itunes,
  ]);
  return (
    <>
      <Box mb={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Link</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TwitterButton href={music?.musicLink?.twitter} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <ItunesButton href={itunesMusic?.trackViewUrl} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mb={3}>
        {isSignedIn && <MainDialog />}
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
                  {music?.composers?.map((composer) => (
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
                  {music?.lyrists?.map((lyrists) => (
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
        {isSignedIn && <RoleDialog />}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Artist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {music?.artistMusics?.map((artistMusic) => (
                <TableRow key={artistMusic.id}>
                  <TableCell>{artistMusic.role}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`${routes.ARTISTS}/${artistMusic.artist.id}`}
                    >
                      {artistMusic.artist.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isSignedIn && <AlbumDialog />}
      <AlbumsTable data={music?.albums} />
    </>
  );
};
export default Info;
