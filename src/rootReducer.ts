/* eslint-disable import/no-cycle */
import { combineReducers } from "redux";
import currentUserReducer from "./slices/currentUser";

export default combineReducers({
  currentUser: currentUserReducer,
});
