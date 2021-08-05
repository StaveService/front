import { AxiosResponse } from "axios";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import MusicsTable from "../../components/Table/Music";
import BandsTable from "../../components/Table/Band";
import AlbumsTable from "../../components/Table/Album";
import LinkTable from "../../components/Table/Link";
import BookmarkButton from "../../components/Button/Icon/Bookmark";
import ItunesArtistDialog from "../../components/Dialog/Itunes/Artist";
import SpotifyArtistDialog from "../../components/Dialog/Spotify/Artist";
import TwitterDialog from "../../components/Dialog/Twitter";
import WikipediaDialog from "../../components/Dialog/Wikipedia";
import TranslateDialog from "../../components/Dialog/Translate";
import DefaultLayout from "../../layout/Default";
import {
  IArtist,
  IArtistBookmark,
  IArtistLink,
  IItunesArtist,
  ISpotifyArtist,
  IWikipedia,
} from "../../interfaces";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import {
  selectCurrentUser,
  setHeaders,
} from "../../slices/currentUser/currentUser";
import queryKey from "../../constants/queryKey.json";
import { lookupItunesArtist } from "../../axios/itunes";
import {
  deleteArtistBookmark,
  IArtistParams,
  patchArtist,
  patchArtistLink,
  postArtistBookmark,
} from "../../axios/axios";
import { getWikipedia } from "../../axios/wikipedia";
import usePaginate from "../../hooks/usePaginate";
import { getArtist, getArtistAlbums, getArtistMusics } from "../../gql";
import { selectLocale } from "../../slices/language";

const Show: React.FC = () => {
  const [albumPage, handleAlbumPage] = usePaginate();
  const [musicPage, handleMusicPage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { onError } = useQuerySnackbar();
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const locale = useSelector(selectLocale);
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IArtistBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IArtist | undefined>(
      [queryKey.ARTIST, id],
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
    queryClient.setQueryData<IArtist | undefined>(
      [queryKey.ARTIST, id],
      (prev) =>
        prev && {
          ...prev,
          bookmark: undefined,
          bookmarksCount: prev.bookmarksCount - 1,
        }
    );
  };
  const handleUpdateSuccess = (res: AxiosResponse<IArtistLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IArtist | undefined>(
      [queryKey.ARTIST, id],
      (prev) => prev && { ...prev, link: res.data }
    );
  };
  const artist = useQuery(
    [queryKey.ARTIST, id, locale],
    getArtist(id, currentUser?.id, locale),
    {
      onError,
    }
  );
  const artistAlbums = useQuery(
    [queryKey.ARTIST, id, queryKey.ALBUMS, albumPage, locale],
    getArtistAlbums(id, albumPage, locale),
    { onError }
  );
  const artistMusics = useQuery(
    [queryKey.ARTIST, id, queryKey.MUSICS, musicPage, locale],
    getArtistMusics(id, musicPage, locale),
    { onError }
  );
  const wikipedia = useQuery<IWikipedia>(
    [queryKey.WIKIPEDIA, artist.data?.link.wikipedia],
    () => getWikipedia(artist.data?.link.wikipedia),
    { enabled: !!artist.data?.link.wikipedia, onError }
  );
  const itunesArtist = useQuery<IItunesArtist>(
    [queryKey.ITUNES, queryKey.ARTIST, artist.data?.link.itunes],
    () =>
      lookupItunesArtist<number>(artist.data?.link.itunes).then(
        (res) => res.results[0]
      ),
    { enabled: !!artist.data?.link.itunes, onError }
  );
  const createMutation = useMutation(() => postArtistBookmark(id), {
    onSuccess: handleCreateSuccess,
    onError,
  });
  const destroyMutation = useMutation(
    () => deleteArtistBookmark(id, artist.data?.bookmark?.id),
    {
      onSuccess: handleDestroySuccess,
      onError,
    }
  );
  const updateLinkMutation = useMutation(
    (link: Partial<Omit<IArtistLink, "id">>) =>
      patchArtistLink(id, artist.data?.link.id, link),
    { onSuccess: handleUpdateSuccess, onError }
  );
  // handlers
  const handleCreateMutation = () => createMutation.mutate();
  const handleDestroyMutation = () => destroyMutation.mutate();
  const handleSelect = (selectedArtist: IItunesArtist) =>
    updateLinkMutation.mutate({ itunes: selectedArtist.artistId });
  const handleWikipediaSelect = (selectedWikipedia: IWikipedia) =>
    updateLinkMutation.mutate({ wikipedia: selectedWikipedia.pageid });
  const handleSpotifySelect = (selectedArtist: ISpotifyArtist) =>
    updateLinkMutation.mutate({ spotify: selectedArtist.id });
  const handleSubmit = (value: string) =>
    updateLinkMutation.mutate({ twitter: value });

  return (
    <DefaultLayout>
      {artist.data?.localed && (
        <Box mb={3}>
          <Alert severity="warning">
            <AlertTitle>Not translated</AlertTitle>
            Please Contribute! — <strong>check it out!</strong>
          </Alert>
        </Box>
      )}
      <Grid container>
        <Grid item xs={10}>
          <Typography variant="h5">
            <AccessibilityNewIcon />
            {artist.data?.name}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <BookmarkButton
            count={artist.data?.bookmarksCount}
            bookmarked={!!artist.data?.bookmark || false}
            onCreate={handleCreateMutation}
            onDestroy={handleDestroyMutation}
          />
        </Grid>
        <Grid item xs={1}>
          <TranslateDialog<IArtist, IArtistParams>
            queryKey={queryKey.ARTIST}
            name="name"
            label="Name"
            patchFn={patchArtist}
          />
        </Grid>
      </Grid>
      <Box>
        <Typography variant="body1" color="initial">
          {wikipedia.data?.extract}
        </Typography>
      </Box>
      <Box mb={3}>
        <LinkTable
          twitter={{
            link: artist.data?.link.twitter,
            renderDialog(open, handleClose) {
              return (
                <TwitterDialog
                  defaultValue={artist.data?.link.twitter || undefined}
                  open={open}
                  loading={updateLinkMutation.isLoading}
                  onClose={handleClose}
                  onPatch={handleSubmit}
                />
              );
            },
          }}
          itunes={{
            link: itunesArtist.data?.artistLinkUrl || "",
            renderDialog(open, handleClose) {
              return (
                <ItunesArtistDialog
                  defaultValue={artist.data?.name}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleSelect}
                  showSearchBar
                />
              );
            },
          }}
          wikipedia={{
            link: artist.data?.link.wikipedia,
            renderDialog(open, handleClose) {
              return (
                <WikipediaDialog
                  defaultValue={artist.data?.name}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleWikipediaSelect}
                  showSearchBar
                />
              );
            },
          }}
          spotify={{
            type: "artist",
            link: artist.data?.link.spotify,
            renderDialog(open, handleClose) {
              return (
                <SpotifyArtistDialog
                  defaultValue={artist.data?.name}
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
        <BandsTable
          bands={artist.data?.bands || []}
          loading={artist.isLoading}
        />
      </Box>
      <Box mb={3}>
        <AlbumsTable
          albums={artistAlbums.data?.data || []}
          loading={artistAlbums.isLoading}
          page={albumPage}
          pageCount={artistAlbums.data?.pagination.totalPages}
          onPage={handleAlbumPage}
        />
      </Box>
      <MusicsTable
        musics={artistMusics.data?.data || []}
        loading={artistMusics.isLoading}
        page={musicPage}
        pageCount={artistMusics.data?.pagination.totalPages}
        onPage={handleMusicPage}
      />
    </DefaultLayout>
  );
};

export default Show;
