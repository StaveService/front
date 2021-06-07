import { useQuery } from "react-query";
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
import { useSelector } from "react-redux";
import RootTabPanel from "./TabPanel/Root";
import BookmarkTabPanel from "./TabPanel/Bookmark";
import SettingTabPanel from "./TabPanel/Setting";
import DefaultLayout from "../../../layout/Default";
import { IUserType } from "../../../interfaces";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import { graphQLClient } from "../../../gql/client";
import { userQuery } from "../../../gql/query/user";
import queryKey from "../../../constants/queryKey.json";
import routes from "../../../constants/routes.json";
import { selectCurrentUser } from "../../../slices/currentUser";

const Show: React.FC = () => {
  const [musicPage, setMusicPage] = useState(1);
  const [bookmarkedMusicPage, setBookmarkedMusicPage] = useState(1);
  const [bookmarkedBandPage, setBookmarkedBandPage] = useState(1);
  const [bookmarkedArtistPage, setBookmarkedArtistPage] = useState(1);
  const { onError } = useQuerySnackbar();
  // react-redux
  const currentUser = useSelector(selectCurrentUser);
  // react-hook-form
  const match = useRouteMatch<{ id: string }>();
  const location = useLocation();
  const id = Number(match.params.id);
  // react-query
  const { isLoading, data } = useQuery<IUserType>(
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
      graphQLClient.request(userQuery, {
        id,
        musicPage,
        bookmarkedMusicPage,
        bookmarkedBandPage,
        bookmarkedArtistPage,
      }),
    { onError }
  );
  const handleMusicPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setMusicPage(value);
  const handleBookmarkedMusicPage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedMusicPage(value);
  const handleBookmarkedBandPage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedBandPage(value);
  const handleBookmarkedArtistPage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedArtistPage(value);
  return (
    <DefaultLayout>
      <Typography variant="h6">{data?.user.nickname}</Typography>
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
              userLink={data?.user.userLink}
              musics={data?.user.musics}
              loading={isLoading}
              page={musicPage}
              onPage={handleMusicPage}
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
              musics={data?.user.bookmarkedMusics}
              bands={data?.user.bookmarkedBands}
              artists={data?.user.bookmarkedArtists}
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
