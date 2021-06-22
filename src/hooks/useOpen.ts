import { useState } from "react";

const useOpen = (): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return [open, onOpen, onClose];
};

export default useOpen;
