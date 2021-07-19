import { useMutation, useQuery, useQueryClient } from "react-query";
import React from "react";
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
import Link from "@material-ui/core/Link";
import FollowButton from "../../../components/Button/Follow";
import MusicsTabPanel from "./TabPanel/Musics";
import ProfileTabPanel from "./TabPanel/Profile";
import BookmarkTabPanel from "./TabPanel/Bookmark";
import SettingTabPanel from "./TabPanel/Setting";
import DefaultLayout from "../../../layout/Default";
import { IUser, IUserRelationship } from "../../../interfaces";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import queryKey from "../../../constants/queryKey.json";
import routes from "../../../constants/routes.json";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../../slices/currentUser/currentUser";
import {
  deleteUserRelationship,
  postUserRelationship,
} from "../../../axios/axios";
import { getUser } from "../../../gql";

const Show: React.FC = () => {
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
  const { isLoading, data } = useQuery(
    [queryKey.USER, id],
    getUser(id, currentUser?.id),
    { onError }
  );
  const handleCreateSuccess = (res: AxiosResponse<IUserRelationship>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IUser | undefined>(
      [queryKey.USER, id],
      (prev) => prev && { ...prev, followed: res.data }
    );
  };
  const handleDeleteSuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IUser | undefined>(
      [queryKey.USER, id],
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
  // helpers
  const isCurrentUser = currentUser?.id === id;
  const user = isCurrentUser ? currentUser : data;
  // handlers
  const handleFollow = () => createMutate.mutate();
  const handleUnfollow = () => deleteMutate.mutate();
  return (
    <DefaultLayout>
      <Grid container>
        <Grid item xs={11}>
          <Typography variant="h6">{user?.nickname}</Typography>
        </Grid>
        <Grid item xs={1}>
          {isCurrentUser && (
            <FollowButton
              followed={!!user?.followed}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              disabled={isLoading}
            >
              Follow
            </FollowButton>
          )}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <Link
            component={RouterLink}
            to={`${routes.USERS}/${id}${routes.FOLLOWERS}`}
          >
            {user?.followersCount}Followers
          </Link>
        </Grid>
        <Grid item>
          <Link
            component={RouterLink}
            to={`${routes.USERS}/${id}${routes.FOLLOWING}`}
          >
            {user?.followingCount}Following
          </Link>
        </Grid>
      </Grid>
      {user?.introduction}
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
          label="Musics"
          value={match.url + routes.MUSICS}
          component={RouterLink}
          to={match.url + routes.MUSICS}
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
          disabled={!isCurrentUser}
        />
      </Tabs>
      <Switch>
        <Route exact path={match.path} component={ProfileTabPanel} />
        <Route
          exact
          path={match.path + routes.MUSICS}
          component={MusicsTabPanel}
        />
        <Route
          exact
          path={match.path + routes.SETTING}
          component={SettingTabPanel}
        />
        <Route
          exact
          path={match.path + routes.BOOKMARKS}
          component={BookmarkTabPanel}
        />
        <Route
          exact
          path={match.path + routes.BOOKMARKS}
          component={BookmarkTabPanel}
        />
      </Switch>
    </DefaultLayout>
  );
};
export default Show;
