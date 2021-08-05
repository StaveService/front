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
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload;
    },
    remove: (state) => {
      state.language = "";
      state.locale = "";
      state.countryCode = "";
    },
  },
});

export const selectLanguage = (state: RootState): string =>
  state.language.language;
export const selectLocale = (state: RootState): string => state.language.locale;
export const selectCountryCode = (state: RootState): string =>
  state.language.countryCode;
export const { set, setLocale, remove } = spotifySlice.actions;
export default spotifySlice.reducer;
