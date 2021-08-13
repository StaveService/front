import { AxiosResponse } from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GroupIcon from "@material-ui/icons/Group";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ArtistDialog from "./Dialog/Artist";
import ArtistsTable from "../../../components/Table/Artist";
import MusicsTable from "../../../components/Table/Music";
import AlbumsTable from "../../../components/Table/Album";
import LinkTable from "../../../components/Table/Link";
import BookmarkButton from "../../../components/Button/Icon/Bookmark";
import ItunesArtistDialog from "../../../components/Dialog/Itunes/Artist";
import TwitterDialog from "../../../components/Dialog/Twitter";
import WikipediaDialog from "../../../components/Dialog/Wikipedia";
import SpotifyArtistDialog from "../../../components/Dialog/Spotify/Artist";
import TranslateDialog from "../../../components/Dialog/Translate";
import YoutubeDialog from "../../../components/Dialog/Youtube";
import DefaultLayout from "../../../layout/Default";
import {
  IBand,
  IBandBookmark,
  IBandLink,
  IItunesArtist,
  ISpotifyArtist,
  IWikipedia,
} from "../../../interfaces";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import {
  selectCurrentUser,
  setHeaders,
} from "../../../slices/currentUser/currentUser";
import queryKey from "../../../constants/queryKey.json";
import { lookupItunesArtist } from "../../../axios/itunes";
import {
  postBandBookmark,
  deleteBandBookmark,
  patchBandLink,
  IBandParams,
  patchBand,
} from "../../../axios/axios";
import { getWikipedia } from "../../../axios/wikipedia";
import usePaginate from "../../../hooks/usePaginate";
import { getBand, getBandAlbums, getBandMusics } from "../../../gql";
import { selectLocale } from "../../../slices/language";

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
  const handleCreateSuccess = (res: AxiosResponse<IBandBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      [queryKey.BAND, id, locale],
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
    queryClient.setQueryData<IBand | undefined>(
      [queryKey.BAND, id, locale],
      (prev) =>
        prev && {
          ...prev,
          bookmark: undefined,
          bookmarksCount: prev.bookmarksCount - 1,
        }
    );
  };
  const handleUpdateSuccess = (res: AxiosResponse<IBandLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      [queryKey.BAND, id, locale],
      (prev) => prev && { ...prev, link: res.data }
    );
  };
  const band = useQuery(
    [queryKey.BAND, id, locale],
    getBand(id, currentUser?.id, locale),
    {
      onError,
    }
  );
  const bandAlbums = useQuery(
    [queryKey.BAND, id, queryKey.ALBUMS, albumPage, locale],
    getBandAlbums(id, albumPage, locale),
    {
      onError,
    }
  );
  const bandMusics = useQuery(
    [queryKey.BAND, id, queryKey.MUSICS, musicPage, locale],
    getBandMusics(id, musicPage, locale),
    {
      onError,
    }
  );
  const itunesArtist = useQuery<IItunesArtist>(
    [queryKey.ITUNES, queryKey.BAND, band.data?.link.itunes],
    () =>
      lookupItunesArtist<number>(band.data?.link.itunes).then(
        (res) => res.results[0]
      ),
    { enabled: !!band.data?.link.itunes, onError }
  );
  const wikipedia = useQuery<IWikipedia>(
    [queryKey.WIKIPEDIA, band.data?.link.wikipedia],
    () => getWikipedia(band.data?.link.wikipedia),
    { enabled: !!band.data?.link.wikipedia, onError }
  );
  const createBookmarkMutation = useMutation(() => postBandBookmark(id), {
    onSuccess: handleCreateSuccess,
    onError,
  });
  const destroyBookmarkMutation = useMutation(
    () => deleteBandBookmark(id, band.data?.bookmark?.id),
    { onSuccess: handleDestroySuccess, onError }
  );
  const updateLinkMutation = useMutation(
    (link: Partial<Omit<IBandLink, "id">>) =>
      patchBandLink(id, band.data?.link.id, link, locale),
    { onSuccess: handleUpdateSuccess, onError }
  );
  // handlers
  const handleItunesSelect = (selectedBand: IItunesArtist) =>
    updateLinkMutation.mutate({ itunes: selectedBand.artistId });
  const handleWikipediaSelect = (selectedWikipedia: IWikipedia) =>
    updateLinkMutation.mutate({ wikipedia: selectedWikipedia.pageid });
  const handleSpotifySelect = (selectedSpotify: ISpotifyArtist) =>
    updateLinkMutation.mutate({ spotify: selectedSpotify.id });
  const handleYoutubeSelect = (value: string) =>
    updateLinkMutation.mutate({ youtube: value });
  const handleSubmit = (value: string) =>
    updateLinkMutation.mutate({ twitter: value });
  const handleCreateBookmarkMutation = () => createBookmarkMutation.mutate();
  const handleDestroyBookmarkMutation = () => destroyBookmarkMutation.mutate();
  return (
    <DefaultLayout>
      {band.data?.localed && (
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
            <GroupIcon />
            {band.data?.name}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <BookmarkButton
            count={band.data?.bookmarksCount}
            bookmarked={!!band.data?.bookmark || false}
            onCreate={handleCreateBookmarkMutation}
            onDestroy={handleDestroyBookmarkMutation}
          />
        </Grid>
        <Grid item xs={1}>
          <TranslateDialog<IBand, IBandParams>
            queryKey={queryKey.BAND}
            name="name"
            label="Name"
            patchFn={patchBand}
          />
        </Grid>
      </Grid>
      <Box>{wikipedia.data?.extract}</Box>
      <Box mb={3}>
        <LinkTable
          twitter={{
            link: band.data?.link.twitter,
            renderDialog(open, handleClose) {
              return (
                <TwitterDialog
                  defaultValue={band.data?.link.twitter}
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
                  defaultValue={band.data?.name}
                  open={open}
                  onClose={handleClose}
                  onSelect={handleItunesSelect}
                  showSearchBar
                />
              );
            },
          }}
          wikipedia={{
            link: band.data?.link.wikipedia,
            renderDialog(open, handleClose) {
              return (
                <WikipediaDialog
                  defaultValue={band.data?.name}
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
            link: band.data?.link.spotify,
            renderDialog(open, handleClose) {
              return (
                <SpotifyArtistDialog
                  defaultValue={band.data?.name}
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
            link: band.data?.link.youtube,
            renderDialog(type, open, baseURL, handleClose) {
              return (
                <YoutubeDialog
                  type={type}
                  id={band.data?.link.youtube || ""}
                  baseURL={baseURL}
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
        <ArtistDialog />
        <ArtistsTable artists={band.data?.artists} loading={band.isLoading} />
      </Box>
      <Box mb={3}>
        <MusicsTable
          musics={bandMusics.data?.data || []}
          loading={bandMusics.isLoading}
          page={musicPage}
          pageCount={bandMusics.data?.pagination.totalPages}
          onPage={handleMusicPage}
        />
      </Box>
      <Box mb={3}>
        <AlbumsTable
          albums={bandAlbums.data?.data || []}
          loading={band.isLoading}
          page={albumPage}
          pageCount={bandAlbums.data?.pagination.totalPages}
          onPage={handleAlbumPage}
        />
      </Box>
    </DefaultLayout>
  );
};
export default Show;
