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
import Music from "../pages/Music/Show";
import Bands from "../pages/Band/Index";
import Band from "../pages/Band/Show";
import Users from "../pages/User/Index";
import User from "../pages/User/Show";
import Album from "../pages/Album/Show";

const Routes: React.FC = () => (
  <Switch>
    <Route exact path={routes.MUSICS} component={Musics} />
    <Route
      exact
      path={`${routes.USERS}/:userId${routes.MUSICS}/:id`}
      component={Music}
    />

    <Route exact path={routes.USERS} component={Users} />
    <Route exact path={`${routes.USERS}/:id`} component={User} />

    <Route exact path={routes.BANDS} component={Bands} />
    <Route exact path={`${routes.BANDS}/:id`} component={Band} />

    <Route exact path={routes.ARTISTS} component={Artists} />
    <Route
      exact
      path={`${routes.ARTISTS}${routes.NEW}`}
      component={NewArtist}
    />
    <Route exact path={`${routes.ARTISTS}/:id`} component={Artist} />

    <Route exact path={`${routes.ALBUMS}/:id`} component={Album} />

    <Route exact path={routes.SIGNIN} component={SignIn} />
    <Route exact path={routes.SIGNUP} component={SignUp} />

    <Route exact path={routes.ROOT} component={Root} />
  </Switch>
);

export default Routes;
