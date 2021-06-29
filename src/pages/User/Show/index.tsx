import { useMutation, useQuery, useQueryClient } from "react-query";
import React, { useState } from "react";
import {
  useLocation,
  useRouteMatch,
  Link as RouterLink,
  Route,
  Switch,
} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { AxiosResponse } from "axios";
import FollowButton from "../../../components/Button/Follow";
import RootTabPanel from "./TabPanel/Root";
import BookmarkTabPanel from "./TabPanel/Bookmark";
import SettingTabPanel from "./TabPanel/Setting";
import DefaultLayout from "../../../layout/Default";
import { IUser, IUserRelationship, IUserType } from "../../../interfaces";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import GraphQLClient from "../../../gql/client";
import { userQuery } from "../../../gql/query/user";
import queryKey from "../../../constants/queryKey.json";
import routes from "../../../constants/routes.json";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../../slices/currentUser";
import {
  deleteUserRelationship,
  postUserRelationship,
} from "../../../axios/axios";

const Show: React.FC = () => {
  const [musicPage, setMusicPage] = useState(1);
  const [bookmarkedMusicPage, setBookmarkedMusicPage] = useState(1);
  const [bookmarkedBandPage, setBookmarkedBandPage] = useState(1);
  const [bookmarkedArtistPage, setBookmarkedArtistPage] = useState(1);
  const { onError } = useQuerySnackbar();
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  // react-hook-form
  const match = useRouteMatch<{ id: string }>();
  const location = useLocation();
  const id = Number(match.params.id);
  // react-query
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery<IUser>(
    [
      queryKey.USER,
      id,
      {
        musicPage,
        bookmarkedMusicPage,
        bookmarkedBandPage,
        bookmarkedArtistPage,
      },
    ],
    () =>
      GraphQLClient.request<IUserType>(userQuery, {
        id,
        musicPage,
        currentUserId: currentUser?.id,
        bookmarkedMusicPage,
        bookmarkedBandPage,
        bookmarkedArtistPage,
      }).then((res) => res.user),
    { onError }
  );
  const handleCreateSuccess = (res: AxiosResponse<IUserRelationship>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IUser | undefined>(
      [
        queryKey.USER,
        id,
        {
          musicPage,
          bookmarkedMusicPage,
          bookmarkedBandPage,
          bookmarkedArtistPage,
        },
      ],
      (prev) => prev && { ...prev, followed: res.data }
    );
  };

  const handleDeleteSuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IUser | undefined>(
      [
        queryKey.USER,
        id,
        {
          musicPage,
          bookmarkedMusicPage,
          bookmarkedBandPage,
          bookmarkedArtistPage,
        },
      ],
      (prev) => prev && { ...prev, followed: undefined }
    );
  };
  const createMutate = useMutation(() => postUserRelationship(id, headers), {
    onSuccess: handleCreateSuccess,
    onError,
  });
  const deleteMutate = useMutation(
    () => deleteUserRelationship(id, data?.followed?.id, headers),
    {
      onSuccess: handleDeleteSuccess,
      onError,
    }
  );
  // handlers
  const handleMusicPage = (_event: React.ChangeEvent<unknown>, value: number) =>
    setMusicPage(value);
  const handleBookmarkedMusicPage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedMusicPage(value);
  const handleBookmarkedBandPage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedBandPage(value);
  const handleBookmarkedArtistPage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedArtistPage(value);
  const handleFollow = () => createMutate.mutate();
  const handleUnfollow = () => deleteMutate.mutate();
  return (
    <DefaultLayout>
      <Grid container>
        <Grid item xs={11}>
          <Typography variant="h6">{data?.nickname}</Typography>
        </Grid>
        <Grid item xs={1}>
          <FollowButton
            followed={!!data?.followed}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          >
            Follow
          </FollowButton>
        </Grid>
      </Grid>
      <Tabs
        value={
          location.pathname.includes("issues")
            ? match.url + routes.ISSUES
            : location.pathname
        }
      >
        <Tab
          label="Profile"
          value={match.url}
          component={RouterLink}
          to={match.url}
        />
        <Tab
          label="Bookmark"
          value={match.url + routes.BOOKMARKS}
          component={RouterLink}
          to={match.url + routes.BOOKMARKS}
        />
        <Tab
          label="Setting"
          value={match.url + routes.SETTING}
          component={RouterLink}
          to={match.url + routes.SETTING}
          disabled={currentUser?.id !== id}
        />
      </Tabs>
      <Switch>
        <Route
          exact
          path={match.path}
          render={() => (
            <RootTabPanel
              userLink={data?.link}
              musics={data?.musics}
              loading={isLoading}
              musicPage={musicPage}
              onPage={handleMusicPage}
              bookmarkedMusicPage={bookmarkedMusicPage}
              bookmarkedArtistPage={bookmarkedArtistPage}
              bookmarkedBandPage={bookmarkedBandPage}
            />
          )}
        />
        <Route
          exact
          path={match.path + routes.SETTING}
          component={SettingTabPanel}
        />
        <Route
          exact
          path={match.path + routes.BOOKMARKS}
          render={() => (
            <BookmarkTabPanel
              musics={data?.bookmarkedMusics}
              bands={data?.bookmarkedBands}
              artists={data?.bookmarkedArtists}
              loading={isLoading}
              musicPage={bookmarkedMusicPage}
              onMusicPage={handleBookmarkedMusicPage}
              bandPage={bookmarkedBandPage}
              onBandPage={handleBookmarkedBandPage}
              artistPage={bookmarkedArtistPage}
              onArtistPage={handleBookmarkedArtistPage}
            />
          )}
        />
      </Switch>
    </DefaultLayout>
  );
};
export default Show;
