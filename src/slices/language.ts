/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type ILocale = "ja" | "en";
export type ICountryCode = "JP" | "US";

interface ILanguage {
  language: string;
  locale: ILocale;
  countryCode: ICountryCode;
}
const getLanguage = () => navigator.language;
const initialState: ILanguage = {
  language: getLanguage(),
  locale: getLanguage().split("-")[0] as ILocale,
  countryCode: getLanguage().split("-")[1] as ICountryCode,
};

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<string>) => {
      const newLanguage = action.payload;
      const [newLocale, newCountryCode] = newLanguage.split("-");
      state.language = newLanguage;
      state.locale = newLocale as ILocale;
      state.countryCode = newCountryCode as ICountryCode;
    },
    setLocale: (state, action: PayloadAction<ILocale>) => {
      state.locale = action.payload;
    },
    setCountryCode: (state, action: PayloadAction<ICountryCode>) => {
      state.countryCode = action.payload;
    },
    remove: (state) => {
      const [newLocale, newCountryCode] = getLanguage().split("-");
      state.language = newCountryCode;
      state.locale = newLocale as ILocale;
      state.countryCode = "US";
    },
  },
});

export const selectLanguage = (state: RootState): string =>
  state.language.language;
export const selectLocale = (state: RootState): ILocale =>
  state.language.locale;
export const selectCountryCode = (state: RootState): ICountryCode =>
  state.language.countryCode;
export const { set, remove, setLocale, setCountryCode } = spotifySlice.actions;
export default spotifySlice.reducer;
