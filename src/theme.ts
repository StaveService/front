import { createMuiTheme } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface PaletteOptions {
    twitter: PaletteOptions["primary"];
    spotify: PaletteOptions["primary"];
    itunes: PaletteOptions["primary"];
  }
  interface Palette {
    twitter: Palette["primary"];
    spotify: Palette["primary"];
    itunes: Palette["primary"];
  }
}
const theme = createMuiTheme({
  palette: {
    spotify: {
      main: "#1DB954",
      light: "#a2ebbc",
    },
    twitter: {
      main: "#1da1f2",
      dark: "#158ad1",
    },
    itunes: {
      main: "#fa57c1",
      light: "#ffbfe9",
    },
  },
});
export default theme;
