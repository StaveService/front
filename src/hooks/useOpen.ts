import { useState } from "react";

const useOpen = (): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return [open, handleOpen, handleClose];
};

export default useOpen;
