import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes.json";
import Root from "../pages/Root";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

const Routes: React.FC = () => (
  <Switch>
    <Route path={routes.SIGNIN} component={SignIn} />
    <Route path={routes.SIGNUP} component={SignUp} />
    <Route path={routes.ROOT} component={Root} />
  </Switch>
);

export default Routes;
