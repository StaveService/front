import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";

interface IEdit {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}
const Edit: React.FC<IEdit> = ({ setOpen, open }: IEdit) => {
  const handleClose = () => setOpen(false);
  return (
    <Dialog onClose={handleClose} open={open}>
      <Box m={3} width={500}>
        <DialogTitle>Edit Info</DialogTitle>
      </Box>
    </Dialog>
  );
};

export default Edit;
