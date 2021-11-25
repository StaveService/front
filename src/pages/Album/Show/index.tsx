import React from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
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
import ArtistDialog from "./Dialog/Artist";
import BookmarkButton from "../../../components/Button/Icon/Bookmark";
import DefaultLayout from "../../../layout/Default";
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
import usePaginate from "../../../hooks/usePaginate";
import { selectLocale } from "../../../slices/language";
import { useAlbumMusicsQuery, useAlbumQuery } from "../../../reactQuery/query";
import { useLookupItunesAlbum } from "../../../reactQuery/itunes";

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
  // react-intl
  const intl = useIntl();
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
  const album = useAlbumQuery({ id, locale, currentUserId: currentUser?.id });
  const albumMusics = useAlbumMusicsQuery({ id, page: musicPage, locale });
  const itunesAlbums = useLookupItunesAlbum({ id: album.data?.link.itunes });
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
            <AlertTitle>
              <FormattedMessage id="untranslation" />
            </AlertTitle>
            <strong>
              <FormattedMessage id="pleaseTranslate" />
            </strong>
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
            inputLabel={intl.formatMessage({ id: "title" })}
            buttonLabel={intl.formatMessage({ id: "translateTitle" })}
            patchFn={patchAlbum}
          />
        </Grid>
      </Grid>
      <Box height="100px" width="100px" m="auto">
        {itunesAlbums.data && itunesAlbums.data[0] && (
          <Image src={itunesAlbums.data[0].artworkUrl100} />
        )}
      </Box>
      <Box mb={3}>
        <LinkTable
          itunes={{
            link:
              itunesAlbums.data && itunesAlbums.data[0]
                ? itunesAlbums.data[0].collectionViewUrl
                : "",
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
