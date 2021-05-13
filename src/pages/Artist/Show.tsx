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
import BookmarkButton from "../../components/Button/Bookmark";
import DefaultLayout from "../../layout/Default";
import { IArtist, IArtistBookmark, IArtistType } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../slices/currentUser";
import routes from "../../router/routes.json";
import { graphQLClient } from "../../gql/client";
import { artistQuery } from "../../gql/query/artist";
import queryKey from "../../gql/queryKey.json";

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
  const { isLoading, data } = useQuery<IArtist>(
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
  const createMutation = useMutation(
    () =>
      axios.post<IArtistBookmark>(
        match.url + routes.ARTIST_BOOKMARKS,
        undefined,
        headers
      ),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    () =>
      axios.delete(
        `${match.url + routes.ARTIST_BOOKMARKS}/${
          data?.bookmark?.id || "undefined"
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
            <AccessibilityNewIcon />
            {data?.name}
          </Typography>
        </Grid>
        <Grid xs={1}>
          <BookmarkButton
            bookmarked={!!data?.bookmark || false}
            onCreate={handleCreateMutation}
            onDestroy={handleDestroyMutation}
          />
        </Grid>
      </Grid>
      <BandsTable data={data?.bands} loading={isLoading} />
      <Box pb={3} />
      <AlbumsTable
        data={data?.albums?.data}
        loading={isLoading}
        page={albumPage}
        pageCount={data?.albums?.pagination.totalPages}
        onPage={handleAlbumPage}
      />
      <Box pb={3} />
      <MusicsTable
        data={data?.musics?.data}
        loading={isLoading}
        page={musicPage}
        pageCount={data?.musics?.pagination.totalPages}
        onPage={handleMusicPage}
      />
    </DefaultLayout>
  );
};

export default Show;
