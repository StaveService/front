import axios, { AxiosResponse } from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import GroupIcon from "@material-ui/icons/Group";
import Grid from "@material-ui/core/Grid";
import ArtistDialog from "./Dialog/Artist";
import AlbumDialog from "./Dialog/Album";
import ArtistsTable from "../../../components/Table/Artist";
import MusicsTable from "../../../components/Table/Music";
import AlbumsTable from "../../../components/Table/Album";
import BookmarkButton from "../../../components/Button/Bookmark";
import DefaultLayout from "../../../layout/Default";
import routes from "../../../router/routes.json";
import { IBand, IBandBookmark } from "../../../interfaces";
import { useQuerySnackbar } from "../../../common/useQuerySnackbar";
import { selectHeaders, setHeaders } from "../../../slices/currentUser";

const Show: React.FC = () => {
  const match = useRouteMatch<{ id: string }>();
  const { onError } = useQuerySnackbar();
  const headers = useSelector(selectHeaders);
  const dispatch = useDispatch();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IBandBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      ["bands", match.params.id],
      (prev) => prev && { ...prev, bookmark: res.data }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IBand | undefined>(
      ["bands", match.params.id],
      (prev) => prev && { ...prev, bookmark: undefined }
    );
  };
  const { isLoading, data } = useQuery<IBand>(
    ["bands", match.params.id],
    () =>
      axios.get<IBand>(match.url, headers).then((res) => {
        dispatch(setHeaders(res.headers));
        return res.data;
      }),
    { onError }
  );
  const createMutation = useMutation(
    () =>
      axios.post<IBandBookmark>(
        match.url + routes.BAND_BOOKMARKS,
        undefined,
        headers
      ),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    () =>
      axios.delete(
        `${match.url + routes.BAND_BOOKMARKS}/${
          data?.bookmark?.id || "undefined"
        }`,
        headers
      ),
    { onSuccess: handleDestroySuccess, onError }
  );
  // handlers
  const handleCreateMutation = () => createMutation.mutate();
  const handleDestroyMutation = () => destroyMutation.mutate();
  return (
    <DefaultLayout>
      <Grid container>
        <Grid xs={11}>
          <Typography variant="h5">
            <GroupIcon />
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
      <Box mb={3}>
        <ArtistDialog />
        <ArtistsTable data={data?.artists} loading={isLoading} />
      </Box>
      <Box mb={3}>
        <MusicsTable data={data?.musics} loading={isLoading} />
      </Box>
      <Box mb={3}>
        <AlbumDialog />
        <AlbumsTable albums={data?.albums || []} loading={isLoading} />
      </Box>
    </DefaultLayout>
  );
};
export default Show;
