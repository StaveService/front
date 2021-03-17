import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITokenHeaders, IUser } from "../interfaces";
/* eslint-disable import/no-cycle */
import { RootState } from "../store";

interface ICurrentUser {
  currentUser: null | IUser;
  headers: null | { headers: ITokenHeaders };
}
const initialState: ICurrentUser = { currentUser: null, headers: null };

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
    setHeaders: (state, action: PayloadAction<ITokenHeaders>) => {
      const {
        "content-type": contentType,
        "access-token": accessToken,
        client,
        uid,
      } = action.payload;
      state.headers = {
        headers: {
          "content-type": contentType,
          "access-token": accessToken,
          client,
          uid,
        },
      };
    },
    remove: (state) => {
      state.currentUser = null;
      state.headers = null;
    },
  },
});

export const selectCurrentUser = (state: RootState): null | IUser =>
  state.currentUser.currentUser;
export const selectHeaders = (
  state: RootState
): null | { headers: ITokenHeaders } => state.currentUser.headers;
export const { setCurrentUser, setHeaders, remove } = currentUserSlice.actions;
export default currentUserSlice.reducer;
