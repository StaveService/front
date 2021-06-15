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
import IssueNew from "./TabPanel/Issue/New";
import Issue from "./TabPanel/Issue/Show";
import LyricTabPanel from "./TabPanel/Lyric";
import Footer from "./Footer";
import BookmarkButton from "../../../components/Button/Bookmark";
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
  IMusicType,
} from "../../../interfaces";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import { musicQuery } from "../../../gql/query/music";
import { graphQLClient } from "../../../gql/client";
import queryKey from "../../../constants/queryKey.json";
import routes from "../../../constants/routes.json";
import { lookupItunesMusic } from "../../../axios/itunes";
import { deleteMusicBookmark, postMusicBookmark } from "../../../axios/axios";

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
  const dispatch = useDispatch();
  // react-query
  const queryClient = useQueryClient();
  const handleCreateSuccess = (res: AxiosResponse<IMusicBookmark>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) => prev && { ...prev, bookmark: res.data }
    );
  };
  const handleDestroySuccess = (res: AxiosResponse) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IMusic | undefined>(
      [queryKey.MUSIC, id],
      (prev) => prev && { ...prev, bookmark: undefined }
    );
  };
  const music = useQuery<IMusic>(
    [queryKey.MUSIC, id],
    () =>
      graphQLClient
        .request<IMusicType>(musicQuery, {
          id,
          currentUserId: currentUser?.id,
        })
        .then((res) => res.music),
    { onError }
  );
  const itunesMusic = useQuery<IItunesMusic>(
    [queryKey.ITUNES, queryKey.MUSIC, music.data?.musicLink?.itunes],
    () =>
      lookupItunesMusic(music.data?.musicLink?.itunes).then(
        (res) => res.results[0]
      ),
    { enabled: !!music.data?.musicLink?.itunes, onError }
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
            disabled={!music.data?.tab}
            fullWidth
            disableElevation
          >
            Watch Tab
          </Button>
        </Box>
        <Tabs
          value={
            location.pathname.includes("issues")
              ? match.url + routes.ISSUES
              : location.pathname
          }
        >
          <Tab
            label="Info"
            value={match.url}
            component={RouterLink}
            to={match.url}
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
      {itunesMusic?.data?.previewUrl && (
        <Footer src={itunesMusic.data.previewUrl} />
      )}
    </>
  );
};
export default Show;
