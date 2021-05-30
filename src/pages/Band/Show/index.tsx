import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouteMatch } from "react-router-dom";
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
import DefaultLayout from "../../../layout/Default";
import routes from "../../../constants/routes.json";
import {
  IBand,
  IBandBookmark,
  IBandType,
  IItunesArtist,
  IItunesResponse,
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
import { itunes } from "../../../axios/axios";

const Show: React.FC = () => {
  const [albumPage, setAlbumPage] = useState(1);
  const [musicPage, setMusicPage] = useState(1);
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
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
      itunes
        .get<IItunesResponse<IItunesArtist>>("/lookup", {
          params: { id: band.data?.bandLink?.itunes, entity: "musicArtist" },
        })
        .then((res) => res.data.results[0]),
    { enabled: !!band.data?.bandLink?.itunes, onError }
  );
  const createMutation = useMutation(
    () =>
      axios.post<IBandBookmark>(
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
          band.data?.bookmark?.id || "undefined"
        }`,
        headers
      ),
    { onSuccess: handleDestroySuccess, onError }
  );
  // handlers
  const handleCreateMutation = () => createMutation.mutate();
  const handleDestroyMutation = () => destroyMutation.mutate();
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
            onCreate={handleCreateMutation}
            onDestroy={handleDestroyMutation}
          />
        </Grid>
      </Grid>
      <Box mb={3}>
        <LinkTable
          links={{ itunes: itunesArtist.data?.artistLinkUrl }}
          itunes
        />
      </Box>
      <Box mb={3}>
        <ArtistDialog musicPage={musicPage} albumPage={albumPage} />
        <ArtistsTable data={band.data?.artists} loading={band.isLoading} />
      </Box>
      <Box mb={3}>
        <MusicsTable
          data={band.data?.musics?.data}
          loading={band.isLoading}
          page={musicPage}
          pageCount={band.data?.musics?.pagination.totalPages}
          onPage={handleMusicPage}
        />
      </Box>
      <Box mb={3}>
        <AlbumsTable
          data={band.data?.albums?.data}
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
