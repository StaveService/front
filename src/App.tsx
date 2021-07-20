import React from "react";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@material-ui/core/styles";
import { store, persistor } from "./store";
import Routes from "./Routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import theme from "./theme";
import AuthDialog from "./ui/Dialog/Auth";

const queryClient = new QueryClient();
const App: React.FC = () => (
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <ReactQueryDevtools initialIsOpen />
            <Router>
              <Header />
              <Routes />
              <Footer />
              <AuthDialog />
            </Router>
          </ThemeProvider>
        </PersistGate>
      </QueryClientProvider>
    </SnackbarProvider>
  </Provider>
);

export default App;
