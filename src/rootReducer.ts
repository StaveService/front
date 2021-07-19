/* eslint-disable import/no-cycle */
import { combineReducers } from "redux";
import currentUserReducer from "./slices/currentUser/currentUser";
import spotifyReducer from "./slices/spotify";
import authModalReducer from "./ui/Dialog/authModal";

export default combineReducers({
  currentUser: currentUserReducer,
  spotify: spotifyReducer,
  authModal: authModalReducer,
});
