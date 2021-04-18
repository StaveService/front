import { useState } from "react";

type Return = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};
export const useOpen = (): Return => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return { open, handleOpen, handleClose };
};

export default undefined;
