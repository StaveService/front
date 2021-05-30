import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { useOpen } from "../../../../../../hooks/useOpen";

const Link: React.FC = () => {
  const { open, handleOpen, handleClose } = useOpen();
  return (
    <>
      <Button onClick={handleOpen}>Edit</Button>
      <Dialog onClose={handleClose} open={open} fullWidth>
        <DialogTitle>Edit Link</DialogTitle>
      </Dialog>
    </>
  );
};
export default Link;
