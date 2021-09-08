import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";

interface ReduxProps {
  children: React.ReactNode;
}
const Redux: React.FC<ReduxProps> = ({ children }: ReduxProps) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);
export default Redux;
