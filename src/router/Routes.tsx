import React from "react"
import {Switch, Route} from "react-router-dom"
import routes from "./routes.json"
import Root from "../pages/Root"
import Home from "../pages/Home"

const Routes = () => {
  return (
    <Switch>
      <Route path={routes.HOME} component={Home} />
      <Route path={routes.ROOT} component={Root} />
    </Switch>
  )
}

export default Routes
