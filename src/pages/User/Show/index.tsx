import { useMutation, useQueryClient } from "react-query";
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
import { FormattedMessage, useIntl } from "react-intl";
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
  setHeaders,
} from "../../../slices/currentUser/currentUser";
import {
  deleteUserRelationship,
  postUserRelationship,
} from "../../../axios/axios";
import { useUserQuery } from "../../../reactQuery/query";

const Show: React.FC = () => {
  const { onError } = useQuerySnackbar();
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  // react-hook-form
  const match = useRouteMatch<{ id: string }>();
  const location = useLocation();
  const id = Number(match.params.id);
  // react-query
  const queryClient = useQueryClient();
  // react-intl
  const intl = useIntl();
  const { isLoading, data } = useUserQuery({
    id,
    currentUserId: currentUser?.id,
  });
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
  const createMutate = useMutation(() => postUserRelationship(id), {
    onSuccess: handleCreateSuccess,
    onError,
  });
  const deleteMutate = useMutation(
    () => deleteUserRelationship(id, data?.followed?.id),
    {
      onSuccess: handleDeleteSuccess,
      onError,
    }
  );
  // helpers
  const isCurrentUser = currentUser?.id === id;
  // handlers
  const handleFollow = () => createMutate.mutate();
  const handleUnfollow = () => deleteMutate.mutate();
  return (
    <DefaultLayout>
      <Grid container>
        <Grid item xs={11}>
          <Typography variant="h6">{data?.nickname}</Typography>
        </Grid>
        <Grid item xs={1}>
          {!isCurrentUser && (
            <FollowButton
              followed={!!data?.followed}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              disabled={isLoading}
            />
          )}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item>
          <Link
            component={RouterLink}
            to={`${routes.USERS}/${id}${routes.FOLLOWERS}`}
          >
            {data?.followersCount}
            <FormattedMessage id="follower" />
          </Link>
        </Grid>
        <Grid item>
          <Link
            component={RouterLink}
            to={`${routes.USERS}/${id}${routes.FOLLOWING}`}
          >
            {data?.followingCount}
            <FormattedMessage id="following" />
          </Link>
        </Grid>
      </Grid>
      {data?.introduction}
      <Tabs
        value={
          location.pathname.includes("issues")
            ? match.url + routes.ISSUES
            : location.pathname
        }
      >
        <Tab
          label={intl.formatMessage({ id: "profile" })}
          value={match.url}
          component={RouterLink}
          to={match.url}
        />
        <Tab
          label={intl.formatMessage({ id: "musics" })}
          value={match.url + routes.MUSICS}
          component={RouterLink}
          to={match.url + routes.MUSICS}
        />
        <Tab
          label={intl.formatMessage({ id: "bookmark" })}
          value={match.url + routes.BOOKMARKS}
          component={RouterLink}
          to={match.url + routes.BOOKMARKS}
        />
        <Tab
          label={intl.formatMessage({ id: "setting" })}
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
