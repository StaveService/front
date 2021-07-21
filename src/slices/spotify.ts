/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISpotifyToken } from "../interfaces";
import { RootState } from "../store";

interface ISpotify {
  code: string | undefined;
  token: ISpotifyToken | undefined;
}
const initialState: ISpotify = {
  code: undefined,
  token: undefined,
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setToken: (state, action: PayloadAction<ISpotifyToken>) => {
      state.token = action.payload;
    },
    remove: (state) => {
      state.code = "";
      state.token = undefined;
    },
  },
});

export const selectSpotifyCode = (state: RootState): undefined | string =>
  state.spotify.code;
export const selectSpotifyToken = (
  state: RootState
): undefined | ISpotifyToken => state.spotify.token;
export const { setCode, setToken, remove } = spotifySlice.actions;
export default spotifySlice.reducer;
