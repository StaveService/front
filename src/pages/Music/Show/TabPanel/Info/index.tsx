import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
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
import { AxiosResponse } from "axios";
import AlbumsTable from "../../../../../components/Table/Album";
import LinkTable from "../../../../../components/Table/Link";
import ItunesMusicDialog from "../../../../../components/Dialog/Itunes/Music";
import MusixmatchDialog from "../../../../../components/Dialog/Musixmatch";
import SpotifyTrackDialog from "../../../../../components/Dialog/Spotify/Track";
import YoutubeDialog from "../../../../../components/Dialog/Youtube";
import MainDialog from "./Dialog/Main";
import RoleDialog from "./Dialog/Artist";
import AlbumDialog from "./Dialog/Album";
import { setHeaders } from "../../../../../slices/currentUser/currentUser";
import {
  IItunesMusic,
  IMusic,
  IMusicLink,
  IMusixmatchTrack,
  ISpotifyTrack,
} from "../../../../../interfaces";
import { patchMusicLink } from "../../../../../axios/axios";
import useQuerySnackbar from "../../../../../hooks/useQuerySnackbar";
import styles from "./index.module.css";
import getIDfromYoutubeURL from "../../../../../helpers/getIDfromYoutubeURL";
import { ShowProps } from "../../interface";

const Info: React.FC<ShowProps> = ({ queryKey }: ShowProps) => {
  const { onError } = useQuerySnackbar();
  // react-router
  const params = useParams<{ userId: string; id: string }>();
  const id = Number(params.id);
  const userId = Number(params.userId);
  // react-redux
  const dispatch = useDispatch();
  // react-query
  const queryClient = useQueryClient();
  const music = queryClient.getQueryData<IMusic>(queryKey);
  const itunesMusics = queryClient.getQueryData<IItunesMusic[]>([
    "itunes",
    "music",
    music?.link?.itunes,
  ]);
  const handleUpdateSuccess = (res: AxiosResponse<IMusicLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      queryKey,
      (prev) => prev && { ...prev, link: res.data }
    );
  };
  const patchMutation = useMutation(
    (link: Partial<Omit<IMusicLink, "id">>) =>
      patchMusicLink(userId, id, music?.link.id, link),
    {
      onSuccess: handleUpdateSuccess,
      onError,
    }
  );
  // handlers
  const handleSpotifySelect = (selectedMusic: ISpotifyTrack) =>
    patchMutation.mutate({ spotify: selectedMusic.id });
  const handleItunesSelect = (selectedMusic: IItunesMusic) =>
    patchMutation.mutate({ itunes: selectedMusic.trackId });
  const handleMusixmatchSelect = (selectedMusic: IMusixmatchTrack) =>
    patchMutation.mutate({ musixmatch: selectedMusic.track.track_id });
  const handleYoutubeSelect = (value: string) =>
    patchMutation.mutate({ youtube: value });
  return (
    <>
      <Box mb={3}>
        <LinkTable
          itunes={{
            link:
              itunesMusics && itunesMusics[0]
                ? itunesMusics[0].trackViewUrl
                : undefined,
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
                  defaultValue={music?.title}
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
                  defaultValue={music?.title}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleMusixmatchSelect}
                  showSearchBar
                />
              );
            },
          }}
          youtube={{
            type: "v",
            link: music?.link.youtube,
            renderDialog(open, handleClose) {
              return (
                <YoutubeDialog
                  id={music?.link.youtube || ""}
                  open={open}
                  onClose={handleClose}
                  onPatch={handleYoutubeSelect}
                  loading={patchMutation.isLoading}
                />
              );
            },
          }}
        />
      </Box>
      {music?.link.youtube && (
        <Box
          mb={3}
          display="block"
          position="relative"
          width="100%"
          height="0"
          pt="56.25%"
        >
          <iframe
            className={styles.iframe}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${
              getIDfromYoutubeURL(music?.link.youtube) || "undefined"
            }`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      )}
      <Box mb={3}>
        <MainDialog queryKey={queryKey} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="main" />
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="releaseDate" />
                </TableCell>
                <TableCell>
                  {itunesMusics &&
                    itunesMusics[0] &&
                    itunesMusics[0].releaseDate &&
                    format(new Date(itunesMusics[0].releaseDate), "yyyy/MM/dd")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="composers" />
                </TableCell>
                <TableCell>
                  {music?.composers?.map((composer) => (
                    <Link
                      key={composer.id}
                      component={RouterLink}
                      to={`/artists/${composer.id}`}
                    >
                      {composer.name}
                    </Link>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="lyrists" />
                </TableCell>
                <TableCell>
                  {music?.lyrists?.map((lyrists) => (
                    <Link
                      key={lyrists.id}
                      component={RouterLink}
                      to={`/artists/${lyrists.id}`}
                    >
                      {lyrists.name}
                    </Link>
                  ))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="band" />
                </TableCell>
                <TableCell>
                  {music?.band && (
                    <Link component={RouterLink} to={`/bands/${music.band.id}`}>
                      {music.band.name}
                    </Link>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="user" />
                </TableCell>
                <TableCell>
                  {music?.user && (
                    <Link component={RouterLink} to={`/users/${music.user.id}`}>
                      {music.user.nickname}
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mb={3}>
        <RoleDialog queryKey={queryKey} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="role" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="artist" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {music?.artistMusics?.map((artistMusic) => (
                <TableRow key={artistMusic.id}>
                  <TableCell>{artistMusic.role}</TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`/artists/${artistMusic.artist.id}`}
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
      <AlbumDialog queryKey={queryKey} />
      <AlbumsTable albums={music?.albums || []} />
    </>
  );
};
export default Info;
