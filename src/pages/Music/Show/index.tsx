import { AxiosResponse } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  Link as RouterLink,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Image from "material-ui-image";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import InfoTabPanel from "./TabPanel/Info";
import SettingTabPanel from "./TabPanel/Setting";
import IssuesTabPanel from "./TabPanel/Issue/Index";
import TreeTabPanel from "./TabPanel/Tree/Index";
import TreeShow from "./TabPanel/Tree/Show";
import BlobShow from "./TabPanel/Tree/Blob";
import IssueNew from "./TabPanel/Issue/New";
import Issue from "./TabPanel/Issue/Show";
import LyricTabPanel from "./TabPanel/Lyric";
import Player from "./Player";
import BookmarkButton from "../../../components/Button/Icon/Bookmark";
import TranslateDialog from "../../../components/Dialog/Translate";
import DefaultLayout from "../../../layout/Default";
import {
  selectCurrentUser,
  setHeaders,
} from "../../../slices/currentUser/currentUser";
import { IMusic, IMusicBookmark } from "../../../interfaces";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import {
  deleteMusicBookmark,
  IMusicParams,
  patchMusic,
  postMusicBookmark,
} from "../../../axios/axios";
import { remove, selectSpotifyToken } from "../../../slices/spotify";
import { selectLocale } from "../../../slices/language";
import { useMusicQuery } from "../../../reactQuery/query";
import { useLookupItunesMusic } from "../../../reactQuery/itunes";
import { useSpotifyTrackQuery } from "../../../reactQuery/spotify";

const Show: React.FC = () => {
  // react-hook-form
  const match = useRouteMatch<{ id: string; userId: string }>();
  const id = Number(match.params.id);
  const userId = Number(match.params.userId);
  const location = useLocation();
  // notistack
  const { onError } = useQuerySnackbar();
  // react-redux
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const spotifyToken = useSelector(selectSpotifyToken);
  const locale = useSelector(selectLocale);
  // react-query
  const queryClient = useQueryClient();
  const queryKey = ["music", id, locale];
  // react-intl
  const intl = useIntl();
  const handleCreateSuccess = (res: AxiosResponse<IMusicBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      queryKey,
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
    queryClient.setQueryData<IMusic | undefined>(
      queryKey,
      (prev) =>
        prev && {
          ...prev,
          bookmark: undefined,
          bookmarksCount: prev.bookmarksCount - 1,
        }
    );
  };
  const handleError = (err: unknown) => {
    dispatch(remove());
    onError(err);
  };
  const music = useMusicQuery({ id, locale, currentUserId: currentUser?.id });
  const itunesMusics = useLookupItunesMusic({ id: music.data?.link?.itunes });
  const spotifyTrack = useSpotifyTrackQuery(
    { options: { onError: handleError } },
    music.data?.link.spotify,
    spotifyToken?.access_token
  );
  const createMutation = useMutation(() => postMusicBookmark(userId, id), {
    onSuccess: handleCreateSuccess,
    onError,
  });
  const destroyMutation = useMutation(
    () => deleteMusicBookmark(userId, id, music.data?.bookmark?.id),
    { onSuccess: handleDestroySuccess, onError }
  );
  // handlers
  const handleCreateMutation = () => createMutation.mutate();
  const handleDestroyMutation = () => destroyMutation.mutate();
  const tabsValue = () => {
    if (location.pathname.includes("issues")) return `${match.url}/issues`;
    if (location.pathname.includes("files")) return `${match.url}/files`;
    return location.pathname;
  };
  return (
    <>
      <DefaultLayout>
        {music.data?.localed && (
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
          <Grid item xs={11}>
            <Typography variant="h5">
              <MusicNoteIcon />
              {music.data?.title}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <BookmarkButton
              count={music.data?.bookmarksCount}
              bookmarked={!!music.data?.bookmark || false}
              onCreate={handleCreateMutation}
              onDestroy={handleDestroyMutation}
            />
          </Grid>
          <Grid item xs={1}>
            <TranslateDialog<IMusic, IMusicParams>
              queryKey="music"
              name="title"
              inputLabel={intl.formatMessage({ id: "title" })}
              buttonLabel={intl.formatMessage({ id: "translateTitle" })}
              patchFn={patchMusic(userId)}
            />
          </Grid>
        </Grid>
        <Box height="100px" width="100px" m="auto">
          {itunesMusics.data && itunesMusics.data[0] && (
            <Image src={itunesMusics.data[0].artworkUrl100} />
          )}
        </Box>
        <Box my={3}>
          <Button
            variant="contained"
            color="primary"
            disabled={music.data ? !music.data.scoreExist : false}
            component={RouterLink}
            to={`${match.url}/tab`}
            fullWidth
            disableElevation
          >
            <FormattedMessage id="watchScore" />
          </Button>
        </Box>
        <Tabs value={tabsValue()}>
          <Tab
            label={intl.formatMessage({ id: "info" })}
            value={match.url}
            component={RouterLink}
            to={match.url}
          />
          <Tab
            label={intl.formatMessage({ id: "file" })}
            value={`${match.url}/files`}
            component={RouterLink}
            to={`${match.url}/files`}
          />
          <Tab
            label={intl.formatMessage({ id: "lyric" })}
            value={`${match.url}/lyric`}
            component={RouterLink}
            to={`${match.url}/lyric`}
            disabled
          />
          <Tab
            label={intl.formatMessage({ id: "issues" })}
            value={`${match.url}/issues`}
            component={RouterLink}
            to={`${match.url}/issues`}
          />
          <Tab
            label={intl.formatMessage({ id: "setting" })}
            value={`${match.url}/setting`}
            component={RouterLink}
            to={`${match.url}/setting`}
            disabled={currentUser?.id !== Number(match.params.userId)}
          />
        </Tabs>
        <Switch>
          <Route
            exact
            path={match.path}
            render={() => <InfoTabPanel queryKey={queryKey} />}
          />
          <Route
            exact
            path={`${match.path}/files`}
            render={() => <TreeTabPanel queryKey={queryKey} />}
          />
          <Route
            exact
            path={`${match.path}/setting`}
            render={() => <SettingTabPanel queryKey={queryKey} />}
          />
          <Route
            exact
            path={`${match.path}/lyric`}
            render={() => <LyricTabPanel queryKey={queryKey} />}
          />
          <Route exact path={`${match.path}/files`} component={TreeTabPanel} />
          <Route
            exact
            path={`${match.path}/files/tree/:filename`}
            component={TreeShow}
          />
          <Route
            strict
            path={`${match.path}/files/blob/:filename`}
            component={BlobShow}
          />
          <Route
            exact
            path={`${match.path}/issues`}
            component={IssuesTabPanel}
          />
          <Route exact path={`${match.path}/issues/new`} component={IssueNew} />
          <Route exact path={`${match.path}/issues/:id`} component={Issue} />
        </Switch>
      </DefaultLayout>
      <Player
        src={{
          itunes:
            itunesMusics.data && itunesMusics.data[0]
              ? itunesMusics.data[0].previewUrl
              : undefined,
          spotify: spotifyTrack.data?.preview_url,
        }}
      />
    </>
  );
};
export default Show;
