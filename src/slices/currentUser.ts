import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITokenHeaders, IUser } from "../interfaces";
/* eslint-disable import/no-cycle */
import { RootState } from "../store";

interface ICurrentUser {
  currentUser?: IUser;
  headers?: { headers: ITokenHeaders };
}
const initialState: ICurrentUser = {
  currentUser: undefined,
  headers: undefined,
};

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
      // Batch Request
      const prevAccessToken = state.headers?.headers["access-token"] || "";
      state.headers = {
        headers: {
          "content-type": contentType,
          "access-token": accessToken || prevAccessToken,
          client,
          uid,
        },
      };
    },
    remove: (state) => {
      state.currentUser = undefined;
      state.headers = undefined;
    },
  },
});

export const selectCurrentUser = (state: RootState): undefined | IUser =>
  state.currentUser.currentUser;
export const selectHeaders = (
  state: RootState
): undefined | { headers: ITokenHeaders } => state.currentUser.headers;
export const { setCurrentUser, setHeaders, remove } = currentUserSlice.actions;
export default currentUserSlice.reducer;
