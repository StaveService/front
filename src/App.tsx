import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Routes from "./router/Routes";
import Header from "./components/Header";

const App: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Header />
        <Routes />
      </Router>
    </PersistGate>
  </Provider>
);

export default App;
