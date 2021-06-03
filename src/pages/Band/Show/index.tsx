import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GroupIcon from "@material-ui/icons/Group";
import Grid from "@material-ui/core/Grid";
import ArtistDialog from "./Dialog/Artist";
import ArtistsTable from "../../../components/Table/Artist";
import MusicsTable from "../../../components/Table/Music";
import AlbumsTable from "../../../components/Table/Album";
import LinkTable from "../../../components/Table/Link";
import BookmarkButton from "../../../components/Button/Bookmark";
import ItunesBandDialog from "../../../components/Dialog/Itunes/Band";
import DefaultLayout from "../../../layout/Default";
import {
  IBand,
  IBandBookmark,
  IBandLink,
  IBandType,
  IItunesArtist,
} from "../../../interfaces";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../../slices/currentUser";
import { graphQLClient } from "../../../gql/client";
import queryKey from "../../../constants/queryKey.json";
import { bandQuery } from "../../../gql/query/band";
import { lookupItunesArtist } from "../../../axios/itunes";
import {
  postBandBookmark,
  deleteBandBookmark,
  patchBandLink,
} from "../../../axios/axios";

const Show: React.FC = () => {
  const [albumPage, setAlbumPage] = useState(1);
  const [musicPage, setMusicPage] = useState(1);
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { onError } = useQuerySnackbar();
  const headers = useSelector(selectHeaders);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IBandBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      [queryKey.BAND, id, { musicPage, albumPage }],
      (prev) => prev && { ...prev, bookmark: res.data }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      [queryKey.BAND, id, { musicPage, albumPage }],
      (prev) => prev && { ...prev, bookmark: undefined }
    );
  };
  const handleUpdateSuccess = (res: AxiosResponse<IBandLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      [queryKey.BAND, id, { musicPage, albumPage }],
      (prev) => prev && { ...prev, bandLink: res.data }
    );
  };
  const band = useQuery<IBand>(
    [queryKey.BAND, id, { musicPage, albumPage }],
    () =>
      graphQLClient
        .request<IBandType>(bandQuery, {
          id,
          currentUserId: currentUser?.id,
          musicPage,
          albumPage,
        })
        .then((res) => res.band),
    { onError }
  );
  const itunesArtist = useQuery<IItunesArtist>(
    [queryKey.ITUNES, queryKey.BAND, band.data?.bandLink?.itunes],
    () =>
      lookupItunesArtist(band.data?.bandLink?.itunes).then(
        (res) => res.results[0]
      ),
    { enabled: !!band.data?.bandLink?.itunes, onError }
  );
  const createBookmarkMutation = useMutation(
    () => postBandBookmark(id, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyBookmarkMutation = useMutation(
    () => deleteBandBookmark(id, band.data?.bookmark?.id, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  const updateLinkMutation = useMutation(
    (itunesId: number) =>
      patchBandLink(id, band.data?.bandLink?.id, itunesId, headers),
    { onSuccess: handleUpdateSuccess, onError }
  );
  // handlers
  const handleSelect = (selectedBand: IItunesArtist) =>
    updateLinkMutation.mutate(selectedBand.artistId);
  const handleCreateBookmarkMutation = () => createBookmarkMutation.mutate();
  const handleDestroyBookmarkMutation = () => destroyBookmarkMutation.mutate();
  const handleMusicPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setMusicPage(value);
  const handleAlbumPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setAlbumPage(value);
  return (
    <DefaultLayout>
      <Grid container>
        <Grid xs={11}>
          <Typography variant="h5">
            <GroupIcon />
            {band.data?.name}
          </Typography>
        </Grid>
        <Grid xs={1}>
          <BookmarkButton
            bookmarked={!!band.data?.bookmark || false}
            onCreate={handleCreateBookmarkMutation}
            onDestroy={handleDestroyBookmarkMutation}
          />
        </Grid>
      </Grid>
      <Box mb={3}>
        <LinkTable
          links={{ itunes: itunesArtist.data?.artistLinkUrl }}
          renderItunes={(open, handleClose) => (
            <ItunesBandDialog
              open={open}
              onClose={handleClose}
              onSelect={handleSelect}
              showSearchBar
            />
          )}
          itunes
        />
      </Box>
      <Box mb={3}>
        <ArtistDialog musicPage={musicPage} albumPage={albumPage} />
        <ArtistsTable artists={band.data?.artists} loading={band.isLoading} />
      </Box>
      <Box mb={3}>
        <MusicsTable
          musics={band.data?.musics?.data}
          loading={band.isLoading}
          page={musicPage}
          pageCount={band.data?.musics?.pagination.totalPages}
          onPage={handleMusicPage}
        />
      </Box>
      <Box mb={3}>
        <AlbumsTable
          albums={band.data?.albums?.data}
          loading={band.isLoading}
          page={albumPage}
          pageCount={band.data?.albums?.pagination.totalPages}
          onPage={handleAlbumPage}
        />
      </Box>
    </DefaultLayout>
  );
};
export default Show;
