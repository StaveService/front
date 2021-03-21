import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes.json";
import Root from "../pages/Root";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import Artists from "../pages/Artist/Index";
import Artist from "../pages/Artist/Show";
import Musics from "../pages/Music/Index";
import Music from "../pages/Music/Show";
import Bands from "../pages/Band/Index";
import Band from "../pages/Band/Show";
import Users from "../pages/User/Index";
import User from "../pages/User/Show";
import Album from "../pages/Album/Show";

const Routes: React.FC = () => (
  <Switch>
    <Route path={routes.MUSICS} component={Musics} />
    <Route
      path={`${routes.USERS}:userId${routes.MUSICS}:id`}
      component={Music}
    />

    <Route path={routes.USERS} component={Users} />
    <Route path={`${routes.USERS}/:id`} component={User} />

    <Route path={routes.BANDS} component={Bands} />
    <Route path={`${routes.BANDS}/:id`} component={Band} />

    <Route path={routes.ARTISTS} component={Artists} />
    <Route path={`${routes.ARTISTS}/:id`} component={Artist} />

    <Route path={`${routes.ALBUMS}/:id`} component={Album} />

    <Route path={routes.SIGNIN} component={SignIn} />
    <Route path={routes.SIGNUP} component={SignUp} />
    <Route path={routes.ROOT} component={Root} />
  </Switch>
);

export default Routes;
