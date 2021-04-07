import React from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";
import Box from "@material-ui/core/Box";
import { store, persistor } from "./store";
import Routes from "./router/Routes";
import Header from "./components/Header";

switch (process.env.NODE_ENV) {
  case "development":
    axios.defaults.baseURL = "http://localhost:3000";
    break;
  case "production":
    axios.defaults.baseURL = "";
    break;
  default:
    axios.defaults.baseURL = "http://localhost:3000";
}

const App: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Header />
          <Box m={5}>
            <Routes />
          </Box>
        </Router>
      </SnackbarProvider>
    </PersistGate>
  </Provider>
);

export default App;
