import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes.json";
import Root from "../pages/Root";

import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";

import Artists from "../pages/Artist/Index";
import Artist from "../pages/Artist/Show";
import NewArtist from "../pages/Artist/New";

import Musics from "../pages/Music/Index";
import Music from "../pages/Music/Show/Show";
import NewMusic from "../pages/Music/New";

import Bands from "../pages/Band/Index";
import Band from "../pages/Band/Show/Show";
import NewBand from "../pages/Band/New";

import Users from "../pages/User/Index";
import User from "../pages/User/Show";

import Albums from "../pages/Album/Index";
import Album from "../pages/Album/Show/Show";
import NewAlbum from "../pages/Album/New";

const Routes: React.FC = () => (
  <Switch>
    {/* MUSIC */}
    <Route exact path={routes.MUSICS} component={Musics} />
    <Route exact path={`${routes.MUSICS}${routes.NEW}`} component={NewMusic} />
    <Route
      exact
      path={`${routes.USERS}/:userId${routes.MUSICS}/:id`}
      component={Music}
    />

    {/* USER */}
    <Route exact path={routes.USERS} component={Users} />
    <Route exact path={`${routes.USERS}/:id`} component={User} />

    {/* BAND */}
    <Route exact path={routes.BANDS} component={Bands} />
    <Route exact path={`${routes.BANDS}${routes.NEW}`} component={NewBand} />
    <Route exact path={`${routes.BANDS}/:id`} component={Band} />

    {/* ARTIST */}
    <Route exact path={routes.ARTISTS} component={Artists} />
    <Route
      exact
      path={`${routes.ARTISTS}${routes.NEW}`}
      component={NewArtist}
    />
    <Route exact path={`${routes.ARTISTS}/:id`} component={Artist} />

    {/* ALBUM */}
    <Route exact path={routes.ALBUMS} component={Albums} />
    <Route exact path={`${routes.ALBUMS}${routes.NEW}`} component={NewAlbum} />
    <Route exact path={`${routes.ALBUMS}/:id`} component={Album} />

    {/* AUTH */}
    <Route exact path={routes.SIGNIN} component={SignIn} />
    <Route exact path={routes.SIGNUP} component={SignUp} />

    {/* ROOT */}
    <Route exact path={routes.ROOT} component={Root} />
  </Switch>
);

export default Routes;
