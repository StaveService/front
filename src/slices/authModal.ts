import { createSlice } from "@reduxjs/toolkit";
/* eslint-disable import/no-cycle */
import { RootState } from "../store";

interface IAuthModal {
  opened: boolean;
}
const initialState: IAuthModal = {
  opened: false,
};

const authModal = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    close: (state) => {
      state.opened = false;
    },
    open: (state) => {
      state.opened = true;
    },
  },
});

export const selectOpened = (state: RootState): boolean =>
  state.authModal.opened;
export const { close, open } = authModal.actions;
export default authModal.reducer;
