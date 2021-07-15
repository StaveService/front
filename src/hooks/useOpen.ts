import { useCallback, useState } from "react";

const useOpen = (): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onClose = useCallback(() => setOpen(false), []);
  return [open, onOpen, onClose];
};

export default useOpen;
