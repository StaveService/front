import { AxiosResponse } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
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
import YoutubeDialog from "../../components/Dialog/Youtube";
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
import {
  deleteArtistBookmark,
  IArtistParams,
  patchArtist,
  patchArtistLink,
  postArtistBookmark,
} from "../../axios/axios";
import usePaginate from "../../hooks/usePaginate";
import { selectLocale } from "../../slices/language";
import {
  useArtistAlbumsQuery,
  useArtistMusicsQuery,
  useArtistQuery,
} from "../../reactQuery/query";
import { useWikipediaQuery } from "../../reactQuery/wikipedia";
import { useLookupItunesArtist } from "../../reactQuery/itunes";

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
  // react-intl
  const intl = useIntl();
  const handleCreateSuccess = (res: AxiosResponse<IArtistBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IArtist | undefined>(
      ["artist", id, locale],
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
      ["artist", id, locale],
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
      ["artist", id, locale],
      (prev) => prev && { ...prev, link: res.data }
    );
  };
  const artist = useArtistQuery({ id, locale, currentUserId: currentUser?.id });
  const artistAlbums = useArtistAlbumsQuery({ id, page: albumPage, locale });
  const artistMusics = useArtistMusicsQuery({ id, page: musicPage, locale });
  const wikipedia = useWikipediaQuery(artist.data?.link.wikipedia);
  const itunesArtist = useLookupItunesArtist({ id: artist.data?.link.itunes });
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
  const handleYoutubeSelect = (value: string) =>
    updateLinkMutation.mutate({ youtube: value });
  const handleSubmit = (value: string) =>
    updateLinkMutation.mutate({ twitter: value });

  return (
    <DefaultLayout>
      {artist.data?.localed && (
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
            inputLabel={intl.formatMessage({ id: "name" })}
            buttonLabel={intl.formatMessage({ id: "translateName" })}
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
            link: itunesArtist.data ? itunesArtist.data[0].artistLinkUrl : "",
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
          youtube={{
            type: "channel",
            link: artist.data?.link.youtube,
            renderDialog(open, handleClose) {
              return (
                <YoutubeDialog
                  id={artist.data?.link.youtube || ""}
                  open={open}
                  onClose={handleClose}
                  onPatch={handleYoutubeSelect}
                  loading={updateLinkMutation.isLoading}
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
