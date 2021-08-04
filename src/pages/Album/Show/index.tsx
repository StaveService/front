import React from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {
  IAlbum,
  IAlbumBookmark,
  IAlbumLink,
  IItunesAlbum,
  ISpotifyAlbum,
} from "../../../interfaces";
import MusicsTable from "../../../components/Table/Music";
import ArtistTable from "../../../components/Table/Artist";
import LinkTable from "../../../components/Table/Link";
import ItunesAlbumDialog from "../../../components/Dialog/Itunes/Album";
import SpotifyAlbumDialog from "../../../components/Dialog/Spotify/Album";
import TranslateDialog from "../../../components/Dialog/Translate";
import BookmarkButton from "../../../components/Button/Icon/Bookmark";
import DefaultLayout from "../../../layout/Default";
import ArtistDialog from "./Dialog/Artist";
import {
  deleteAlbumBookmark,
  IAlbumParams,
  patchAlbum,
  patchAlbumLink,
  postAlbumBookmark,
} from "../../../axios/axios";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import queryKey from "../../../constants/queryKey.json";
import {
  selectCurrentUser,
  setHeaders,
} from "../../../slices/currentUser/currentUser";
import { lookupItunesAlbum } from "../../../axios/itunes";
import usePaginate from "../../../hooks/usePaginate";
import { getAlbum, getAlbumMusics } from "../../../gql";
import { selectLocale } from "../../../slices/language";

const Show: React.FC = () => {
  const [musicPage, handleMusicPage] = usePaginate();
  const { onError } = useQuerySnackbar();
  // react-router
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const locale = useSelector(selectLocale);
  // react-query
  const queryClient = useQueryClient();
  const handleUpdateSuccess = (res: AxiosResponse<IAlbumLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IAlbum | undefined>(
      [queryKey.ALBUM, id, locale],
      (prev) => prev && { ...prev, link: res.data }
    );
  };
  const handleCreateSuccess = (res: AxiosResponse<IAlbumBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IAlbum | undefined>(
      [queryKey.ALBUM, id, locale],
      (prev) =>
        prev && {
          ...prev,
          bookmark: res.data,
          bookmarksCount: prev.bookmarksCount + 1,
        }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IAlbum | undefined>(
      [queryKey.ALBUM, id, locale],
      (prev) =>
        prev && {
          ...prev,
          bookmark: undefined,
          bookmarksCount: prev.bookmarksCount - 1,
        }
    );
  };
  const album = useQuery(
    [queryKey.ALBUM, id, locale],
    getAlbum(id, currentUser?.id),
    {
      onError,
    }
  );
  const albumMusics = useQuery(
    [queryKey.ALBUM, id, queryKey.MUSICS, musicPage, locale],
    getAlbumMusics(id, musicPage),
    {
      onError,
    }
  );
  const itunesAlbum = useQuery(
    [queryKey.ITUNES, queryKey.ALBUM, album.data?.link.itunes],
    () =>
      lookupItunesAlbum<number>(album.data?.link.itunes).then(
        (res) => res.results[0]
      ),
    { enabled: !!album.data?.link.itunes, onError }
  );
  const patchLinkMutation = useMutation(
    (link: Partial<Omit<IAlbumLink, "id">>) =>
      patchAlbumLink(id, album.data?.link.id, link),
    {
      onSuccess: handleUpdateSuccess,
      onError,
    }
  );
  const createMutation = useMutation(() => postAlbumBookmark(id), {
    onSuccess: handleCreateSuccess,
    onError,
  });
  const destroyMutation = useMutation(
    () => deleteAlbumBookmark(id, album.data?.bookmark?.id),
    {
      onSuccess: handleDestroySuccess,
      onError,
    }
  );
  // handlers
  const handleCreateMutation = () => createMutation.mutate();
  const handleDestroyMutation = () => destroyMutation.mutate();
  const handleSelect = (selectedAlbum: IItunesAlbum) =>
    patchLinkMutation.mutate({ itunes: selectedAlbum.collectionId });
  const handleSpotifySelect = (selectedAlbum: ISpotifyAlbum) =>
    patchLinkMutation.mutate({ spotify: selectedAlbum.id });
  return (
    <DefaultLayout>
      {album.data?.localed && (
        <Box mb={3}>
          <Alert severity="warning">
            <AlertTitle>Not translated</AlertTitle>
            Please Contribute! — <strong>check it out!</strong>
          </Alert>
        </Box>
      )}
      <Grid container>
        <Grid item xs={11}>
          <Typography variant="h5">
            <AlbumIcon />
            {album.data?.title}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <BookmarkButton
            count={album.data?.bookmarksCount}
            bookmarked={!!album.data?.bookmark}
            onCreate={handleCreateMutation}
            onDestroy={handleDestroyMutation}
          />
        </Grid>
        <Grid item xs={1}>
          <TranslateDialog<IAlbum, IAlbumParams>
            queryKey={queryKey.ARTIST}
            name="title"
            label="Title"
            patchFn={patchAlbum}
          />
        </Grid>
      </Grid>
      <Box height="100px" width="100px" m="auto">
        {itunesAlbum.data && <Image src={itunesAlbum.data.artworkUrl100} />}
      </Box>
      <Box mb={3}>
        <LinkTable
          itunes={{
            link: itunesAlbum.data?.collectionViewUrl || "",
            renderDialog(open, handleClose) {
              return (
                <ItunesAlbumDialog
                  open={open}
                  onClose={handleClose}
                  onSelect={handleSelect}
                  showSearchBar
                />
              );
            },
          }}
          spotify={{
            type: "album",
            link: album.data?.link.spotify,
            renderDialog(open, handleClose) {
              return (
                <SpotifyAlbumDialog
                  defaultValue={album.data?.title}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleSpotifySelect}
                  showSearchBar
                />
              );
            },
          }}
        />
      </Box>
      <Box mb={3}>
        <MusicsTable
          musics={albumMusics.data?.data || []}
          loading={albumMusics.isLoading}
          page={musicPage}
          pageCount={albumMusics.data?.pagination.totalPages}
          onPage={handleMusicPage}
        />
      </Box>
      <ArtistDialog />
      <ArtistTable artists={album.data?.artists} loading={album.isLoading} />
    </DefaultLayout>
  );
};

export default Show;
