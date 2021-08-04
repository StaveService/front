import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

interface SettingProps {
  open: boolean;
  handleClose: () => void;
}
const Setting: React.FC<SettingProps> = ({
  open,
  handleClose,
}: SettingProps) => {
  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Setting</DialogTitle>
    </Dialog>
  );
};
export default Setting;
