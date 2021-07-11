import { AxiosResponse } from "axios";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  Link as RouterLink,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Image from "material-ui-image";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
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
import DefaultLayout from "../../../layout/Default";
import {
  selectCurrentUser,
  selectHeaders,
  setHeaders,
} from "../../../slices/currentUser";
import {
  IItunesMusic,
  IMusic,
  IMusicBookmark,
  ISpotifyTrack,
} from "../../../interfaces";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import queryKey from "../../../constants/queryKey.json";
import routes from "../../../constants/routes.json";
import { lookupItunesMusic } from "../../../axios/itunes";
import { deleteMusicBookmark, postMusicBookmark } from "../../../axios/axios";
import { getSpotifyTrack } from "../../../axios/spotify";
import { remove, selectSpotifyToken } from "../../../slices/spotify";
import { getMusic } from "../../../gql";

const Show: React.FC = () => {
  // react-hook-form
  const match = useRouteMatch<{ id: string; userId: string }>();
  const id = Number(match.params.id);
  const userId = Number(match.params.userId);
  const location = useLocation();
  // notistack
  const { onError } = useQuerySnackbar();
  // react-redux
  const currentUser = useSelector(selectCurrentUser);
  const headers = useSelector(selectHeaders);
  const spotifyToken = useSelector(selectSpotifyToken);
  const dispatch = useDispatch();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IMusicBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
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
      [queryKey.MUSIC, id],
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
  const music = useQuery([queryKey.MUSIC, id], getMusic(id, currentUser?.id), {
    onError,
  });
  const itunesMusic = useQuery<IItunesMusic>(
    [queryKey.ITUNES, queryKey.MUSIC, music.data?.link?.itunes],
    () =>
      lookupItunesMusic<number>(music.data?.link.itunes).then(
        (res) => res.results[0]
      ),
    { enabled: !!music.data?.link?.itunes, onError, retry: 2 }
  );
  const spotifyTrack = useQuery<ISpotifyTrack>(
    [queryKey.SPOTIFY, queryKey.MUSIC, music.data?.link?.spotify],
    () => getSpotifyTrack(music.data?.link.spotify, spotifyToken?.access_token),
    {
      enabled: !!music.data?.link?.spotify && !!spotifyToken,
      onError: handleError,
      retry: 2,
    }
  );
  const createMutation = useMutation(
    () => postMusicBookmark(userId, id, headers),
    { onSuccess: handleCreateSuccess, onError }
  );
  const destroyMutation = useMutation(
    () => deleteMusicBookmark(userId, id, music.data?.bookmark?.id, headers),
    { onSuccess: handleDestroySuccess, onError }
  );
  // handlers
  const handleCreateMutation = () => createMutation.mutate();
  const handleDestroyMutation = () => destroyMutation.mutate();
  const tabsValue = () => {
    if (location.pathname.includes("issues")) return match.url + routes.ISSUES;
    if (location.pathname.includes("files")) return match.url + routes.FILES;
    return location.pathname;
  };
  return (
    <>
      <DefaultLayout>
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
        </Grid>
        <Box height="100px" width="100px" m="auto">
          <Image src={itunesMusic?.data?.artworkUrl100 || "undefiend"} />
        </Box>
        <Box my={3}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to={match.url + routes.TAB}
            fullWidth
            disableElevation
          >
            Watch Tab
          </Button>
        </Box>
        <Tabs value={tabsValue()}>
          <Tab
            label="Info"
            value={match.url}
            component={RouterLink}
            to={match.url}
          />
          <Tab
            label="Files"
            value={match.url + routes.FILES}
            component={RouterLink}
            to={match.url + routes.FILES}
          />
          <Tab
            label="Lyric"
            value={match.url + routes.LYRIC}
            component={RouterLink}
            to={match.url + routes.LYRIC}
          />
          <Tab
            label="Issues"
            value={match.url + routes.ISSUES}
            component={RouterLink}
            to={match.url + routes.ISSUES}
          />
          <Tab
            label="Setting"
            value={match.url + routes.SETTING}
            component={RouterLink}
            to={match.url + routes.SETTING}
            disabled={currentUser?.id !== Number(match.params.userId)}
          />
        </Tabs>
        <Switch>
          <Route exact path={match.path} component={InfoTabPanel} />
          <Route
            exact
            path={match.path + routes.FILES}
            component={TreeTabPanel}
          />
          <Route
            exact
            path={match.path + routes.SETTING}
            component={SettingTabPanel}
          />
          <Route
            exact
            path={match.path + routes.LYRIC}
            component={LyricTabPanel}
          />
          <Route
            exact
            path={match.path + routes.FILES}
            component={TreeTabPanel}
          />
          <Route
            exact
            path={`${match.path + routes.FILES + routes.TREE}/:filename`}
            component={TreeShow}
          />
          <Route
            strict
            path={`${match.path + routes.FILES + routes.BLOB}/:filename`}
            component={BlobShow}
          />
          <Route
            exact
            path={match.path + routes.ISSUES}
            component={IssuesTabPanel}
          />
          <Route
            exact
            path={match.path + routes.ISSUES + routes.NEW}
            component={IssueNew}
          />
          <Route
            exact
            path={`${match.path}${routes.ISSUES}/:id`}
            component={Issue}
          />
        </Switch>
      </DefaultLayout>
      <Player
        src={{
          itunes: itunesMusic.data?.previewUrl,
          spotify: spotifyTrack.data?.preview_url,
        }}
      />
    </>
  );
};
export default Show;
