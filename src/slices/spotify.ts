import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/* eslint-disable import/no-cycle */
import { RootState } from "../store";

interface ISpotify {
  code: string | undefined;
}
const initialState: ISpotify = {
  code: undefined,
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    remove: (state) => {
      state.code = "";
    },
  },
});

export const selectSpotifyCode = (state: RootState): undefined | string =>
  state.spotify.code;
export const { set, remove } = spotifySlice.actions;
export default spotifySlice.reducer;
