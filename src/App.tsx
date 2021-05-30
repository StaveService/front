import React from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";
import { store, persistor } from "./store";
import Routes from "./Routes";
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
const queryClient = new QueryClient();
const App: React.FC = () => (
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <ReactQueryDevtools initialIsOpen />
          <Router>
            <Header />
            <Routes />
          </Router>
        </PersistGate>
      </QueryClientProvider>
    </SnackbarProvider>
  </Provider>
);

export default App;
