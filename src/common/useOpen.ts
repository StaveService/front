import { useState } from "react";

interface UseOpenReturn {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}
export const useOpen = (): UseOpenReturn => {
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
