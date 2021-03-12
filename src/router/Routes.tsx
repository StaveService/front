import React from "react"
import {Switch, Route} from "react-router-dom"
import routes from "./routes.json"

const Routes = () => {
  return (
    <Switch>
      <Route path={routes.HOME} />
    </Switch>
  )
}

export default Routes
