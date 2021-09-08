import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";

interface ThemeProps {
  children: React.ReactNode;
}
const Theme: React.FC<ThemeProps> = ({ children }: ThemeProps) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
export default Theme;
