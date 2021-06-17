/* eslint-disable import/no-cycle */
import { combineReducers } from "redux";
import currentUserReducer from "./slices/currentUser";
import spotifyReducer from "./slices/spotify";

export default combineReducers({
  currentUser: currentUserReducer,
  spotify: spotifyReducer,
});
