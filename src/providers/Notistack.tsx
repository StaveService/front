import React from "react";
import { SnackbarProvider } from "notistack";

interface NotistackProps {
  children: React.ReactNode;
}
const Notistack: React.FC<NotistackProps> = ({ children }: NotistackProps) => (
  <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
);
export default Notistack;
