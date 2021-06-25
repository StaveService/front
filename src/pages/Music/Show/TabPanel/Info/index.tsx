import React from "react";
import { useMutation, useQueryClient } from "react-query";
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
import { useDispatch, useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import AlbumsTable from "../../../../../components/Table/Album";
import LinkTable from "../../../../../components/Table/Link";
import ItunesMusicDialog from "../../../../../components/Dialog/Itunes/Music";
import MusixmatchDialog from "../../../../../components/Dialog/Musixmatch";
import SpotifyTrackDialog from "../../../../../components/Dialog/Spotify/Track";
import MainDialog from "./Dialog/Main";
import RoleDialog from "./Dialog/Artist";
import AlbumDialog from "./Dialog/Album";
import routes from "../../../../../constants/routes.json";
import { selectHeaders, setHeaders } from "../../../../../slices/currentUser";
import {
  IItunesMusic,
  IMusic,
  IMusicLink,
  IMusicmatchTrack,
  ISpotifyTrack,
} from "../../../../../interfaces";
import queryKey from "../../../../../constants/queryKey.json";
import { patchMusicLink } from "../../../../../axios/axios";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";

const Info: React.FC = () => {
  const { onError } = useQuerySnackbar();
  // react-router
  const params = useParams<{ userId: string; id: string }>();
  const id = Number(params.id);
  const userId = Number(params.userId);
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // react-query
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>([queryKey.MUSIC, id]);
  const itunesMusic = queryClient.getQueryData<IItunesMusic>([
    queryKey.ITUNES,
    queryKey.MUSIC,
    music?.link?.itunes,
  ]);
  const handleCreateSuccess = (res: AxiosResponse<IMusicLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) => prev && { ...prev, link: res.data }
    );
  };
  const patchMutation = useMutation(
    (link: Partial<Omit<IMusicLink, "id">>) =>
      patchMusicLink(userId, id, music?.link?.id, link, headers),
    {
      onSuccess: handleCreateSuccess,
      onError,
    }
  );
  // handlers
  const handleSpotifySelect = (selectedMusic: ISpotifyTrack) =>
    patchMutation.mutate({ spotify: selectedMusic.id });
  const handleItunesSelect = (selectedMusic: IItunesMusic) =>
    patchMutation.mutate({ itunes: selectedMusic.trackId });
  const handleMusixmatchSelect = (selectedMusic: IMusicmatchTrack) =>
    patchMutation.mutate({ musixmatch: selectedMusic.track.track_id });
  return (
    <>
      <Box mb={3}>
        <LinkTable
          itunes={{
            link: itunesMusic?.trackViewUrl,
            renderDialog(open, handleClose) {
              return (
                <ItunesMusicDialog
                  defaultValue={music?.title}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleItunesSelect}
                  showSearchBar
                />
              );
            },
          }}
          spotify={{
            type: "track",
            link: music?.link?.spotify,
            renderDialog(open, handleClose) {
              return (
                <SpotifyTrackDialog
                  value={music?.title}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleSpotifySelect}
                  showSearchBar
                />
              );
            },
          }}
          musixmatch={{
            renderDialog(open, handleClose) {
              return (
                <MusixmatchDialog
                  value={music?.title}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleMusixmatchSelect}
                  showSearchBar
                />
              );
            },
          }}
        />
      </Box>
      <Box mb={3}>
        <MainDialog />
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
        <RoleDialog />
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
      <AlbumDialog />
      <AlbumsTable albums={music?.albums} />
    </>
  );
};
export default Info;
