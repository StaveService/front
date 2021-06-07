import React, { ChangeEvent } from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";

export interface LayoutProps<T> {
  value?: string;
  open: boolean;
  loading: boolean;
  cards: T[] | undefined;
  title: string;
  showSearchBar?: boolean;
  children: (card: T, handleClose: () => void) => React.ReactNode;
  onClose: () => void;
  onSelect: (selectedCard: T) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export type ItunesDialogProps<T> = Omit<
  LayoutProps<T>,
  "loading" | "cards" | "title" | "children"
>;

function Layout<T>({
  value,
  open,
  loading,
  cards,
  title,
  showSearchBar,
  children,
  onClose,
  onSelect,
  onChange,
}: LayoutProps<T>): JSX.Element {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Choose {title}</DialogTitle>
      <Box p={3}>
        {showSearchBar && (
          <TextField
            id=""
            label=""
            value={value}
            variant="outlined"
            onChange={onChange}
            fullWidth
          />
        )}
        {loading && <LinearProgress />}
        {cards?.map((card) => {
          const handleSelect = () => {
            onClose();
            onSelect(card);
          };
          return children(card, handleSelect);
        })}
      </Box>
    </Dialog>
  );
}
Layout.defaultProps = {
  value: "",
  showSearchBar: false,
  onChange: undefined,
};
export default Layout;
