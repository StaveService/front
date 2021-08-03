/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ILanguage {
  language: string;
  locale: string;
  countryCode: string;
}
const { language } = navigator;
const initialState: ILanguage = {
  language,
  locale: language.split("-")[0],
  countryCode: language.split("-")[1],
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      const newLanguage = action.payload;
      const [newLocale, newCountryCode] = newLanguage.split("-");
      state.language = newLanguage;
      state.locale = newLocale;
      state.countryCode = newCountryCode;
    },
    remove: (state) => {
      state.language = "";
      state.locale = "";
      state.countryCode = "";
    },
  },
});

export const selectLanguage = (state: RootState): undefined | string =>
  state.language.language;
export const selectLocale = (state: RootState): undefined | string =>
  state.language.locale;
export const selectCountryCode = (state: RootState): undefined | string =>
  state.language.countryCode;
export const { set, remove } = spotifySlice.actions;
export default spotifySlice.reducer;