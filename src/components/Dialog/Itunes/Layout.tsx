import React from "react";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

export interface LayoutProps<T> {
  open: boolean;
  loading: boolean;
  cards: T[] | undefined;
  title: string;
  children: (card: T, handleSelect: () => void) => React.ReactNode;
  onClose: () => void;
  onSelect: (selectedCard: T) => void;
}
function Layout<T>({
  open,
  loading,
  cards,
  title,
  children,
  onClose,
  onSelect,
}: LayoutProps<T>): JSX.Element {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Choose {title}</DialogTitle>
      {loading && <LinearProgress />}
      <Box p={2}>
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
export default Layout;
