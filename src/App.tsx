import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import ThemeProvider from "./providers/Theme";
import ReduxProvider from "./providers/Redux";
import ReactQueryProvider from "./providers/ReactQuery";
import NotistackProvider from "./providers/Notistack";
import IntlProvider from "./providers/Intl";
import Routes from "./Routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthDialog from "./ui/Dialog/Auth";

const App: React.FC = () => (
  <ReduxProvider>
    <NotistackProvider>
      <ThemeProvider>
        <ReactQueryProvider>
          <IntlProvider>
            <ReactQueryDevtools initialIsOpen />
            <Router>
              <Header />
              <Routes />
              <Footer />
              <AuthDialog />
            </Router>
          </IntlProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </NotistackProvider>
  </ReduxProvider>
);

export default App;
