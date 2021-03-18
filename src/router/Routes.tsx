import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes.json";
import Root from "../pages/Root";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Artists from "../pages/Artist/Index";
import Artist from "../pages/Artist/Show";
import Musics from "../pages/Music/Index";
import Music from "../pages/Music/Show";
import Bands from "../pages/Band/Index";
import Band from "../pages/Band/Show";
import Users from "../pages/User/Index";
import User from "../pages/User/Show";

const Routes: React.FC = () => (
  <Switch>
    <Route path={routes.MUSICS} component={Musics} />
    <Route path={`${routes.USER}:userId${routes.MUSIC}:id`} component={Music} />

    <Route path={routes.USERS} component={Users} />
    <Route path={`${routes.USER}:id`} component={User} />

    <Route path={routes.BANDS} component={Bands} />
    <Route path={`${routes.BAND}:id`} component={Band} />

    <Route path={routes.ARTISTS} component={Artists} />
    <Route path={`${routes.ARTIST}:id`} component={Artist} />

    <Route path={routes.SIGNIN} component={SignIn} />
    <Route path={routes.SIGNUP} component={SignUp} />
    <Route path={routes.ROOT} component={Root} />
  </Switch>
);

export default Routes;
