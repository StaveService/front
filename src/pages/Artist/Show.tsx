import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import { useDispatch, useSelector } from "react-redux";
import MusicsTable from "../../components/Table/Music";
import BandsTable from "../../components/Table/Band";
import AlbumsTable from "../../components/Table/Album";
import LinkTable from "../../components/Table/Link";
import BookmarkButton from "../../components/Button/Icon/Bookmark";
import ItunesArtistDialog from "../../components/Dialog/Itunes/Artist";
import TwitterDialog from "../../components/Dialog/Twitter";
import DefaultLayout from "../../layout/Default";
import {
  IArtist,
  IArtistBookmark,
  IArtistLink,
  IArtistType,
  IItunesArtist,
} from "../../interfaces";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../slices/currentUser";
import routes from "../../constants/routes.json";
import { graphQLClient } from "../../gql/client";
import { artistQuery } from "../../gql/query/artist";
import queryKey from "../../constants/queryKey.json";
import { lookupItunesArtist } from "../../axios/itunes";
import { Link, patchArtistLink } from "../../axios/axios";

const Show: React.FC = () => {
  const [albumPage, setAlbumPage] = useState(1);
  const [musicPage, setMusicPage] = useState(1);
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const { onError } = useQuerySnackbar();
  // react-redux
  const headers = useSelector(selectHeaders);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IArtistBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IArtist | undefined>(
      [queryKey.ARTIST, id, { musicPage, albumPage }],
      (prev) => prev && { ...prev, bookmark: res.data }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IArtist | undefined>(
      [queryKey.ARTIST, id, { musicPage, albumPage }],
      (prev) => prev && { ...prev, bookmark: undefined }
    );
  };
  const handleUpdateSuccess = (res: AxiosResponse<IArtistLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IArtist | undefined>(
      [queryKey.ARTIST, id, { musicPage, albumPage }],
      (prev) => prev && { ...prev, artistLink: res.data }
    );
  };
  const artist = useQuery<IArtist>(
    [queryKey.ARTIST, id, { musicPage, albumPage }],
    () =>
      graphQLClient
        .request<IArtistType>(artistQuery, {
          id,
          currentUserId: currentUser?.id,
          musicPage,
          albumPage,
        })
        .then((res) => res.artist),
    { onError }
  );
  const itunesArtist = useQuery<IItunesArtist>(
    [queryKey.ITUNES, queryKey.ARTIST, artist.data?.artistLink?.itunes],
    () =>
      lookupItunesArtist(artist.data?.artistLink?.itunes).then(
        (res) => res.results[0]
      ),
    { enabled: !!artist.data?.artistLink?.itunes, onError }
  );
  const createMutation = useMutation(
    () =>
      axios.post<IArtistBookmark>(
        match.url + routes.BOOKMARKS,
        undefined,
        headers
      ),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    () =>
      axios.delete(
        `${match.url + routes.BOOKMARKS}/${
          artist.data?.bookmark?.id || "undefined"
        }`,
        headers
      ),
    { onSuccess: handleDestroySuccess, onError }
  );
  const updateLinkMutation = useMutation(
    (link: Link) =>
      patchArtistLink(id, artist.data?.artistLink?.id, link, headers),
    { onSuccess: handleUpdateSuccess, onError }
  );
  // handlers
  const handleCreateMutation = () => createMutation.mutate();
  const handleDestroyMutation = () => destroyMutation.mutate();
  const handleSelect = (selectedArtist: IItunesArtist) =>
    updateLinkMutation.mutate({ itunes: selectedArtist.artistId });
  const handleSubmit = (value: string) =>
    updateLinkMutation.mutate({ twitter: value });
  const handleMusicPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setMusicPage(value);
  const handleAlbumPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setAlbumPage(value);

  return (
    <DefaultLayout>
      <Grid container>
        <Grid xs={11}>
          <Typography variant="h5">
            <AccessibilityNewIcon />
            {artist.data?.name}
          </Typography>
        </Grid>
        <Grid xs={1}>
          <BookmarkButton
            bookmarked={!!artist.data?.bookmark || false}
            onCreate={handleCreateMutation}
            onDestroy={handleDestroyMutation}
          />
        </Grid>
      </Grid>
      <Box mb={3}>
        <LinkTable
          twitter={{
            link: artist.data?.artistLink?.twitter,
            renderDialog(open, handleClose) {
              return (
                <TwitterDialog
                  defaultValue={artist.data?.artistLink?.twitter}
                  open={open}
                  loading={updateLinkMutation.isLoading}
                  onClose={handleClose}
                  onPatch={handleSubmit}
                />
              );
            },
          }}
          itunes={{
            link: itunesArtist.data?.artistLinkUrl,
            renderDialog(open, handleClose) {
              return (
                <ItunesArtistDialog
                  open={open}
                  onClose={handleClose}
                  onSelect={handleSelect}
                  showSearchBar
                />
              );
            },
          }}
        />
      </Box>
      <Box mb={3}>
        <BandsTable bands={artist.data?.bands} loading={artist.isLoading} />
      </Box>
      <Box mb={3}>
        <AlbumsTable
          albums={artist.data?.albums?.data}
          loading={artist.isLoading}
          page={albumPage}
          pageCount={artist.data?.albums?.pagination.totalPages}
          onPage={handleAlbumPage}
        />
      </Box>
      <MusicsTable
        musics={artist.data?.musics?.data}
        loading={artist.isLoading}
        page={musicPage}
        pageCount={artist.data?.musics?.pagination.totalPages}
        onPage={handleMusicPage}
      />
    </DefaultLayout>
  );
};

export default Show;
