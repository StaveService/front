import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/* eslint-disable import/no-cycle */
import { RootState } from "../store";

interface ISpotify {
  code: string | undefined;
  token: string | undefined;
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
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    remove: (state) => {
      state.code = "";
      state.token = "";
    },
  },
});

export const selectSpotifyCode = (state: RootState): undefined | string =>
  state.spotify.code;
export const { setCode, remove } = spotifySlice.actions;
export default spotifySlice.reducer;
