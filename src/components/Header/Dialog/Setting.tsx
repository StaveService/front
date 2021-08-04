import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import { selectLocale, setLocale } from "../../../slices/language";

interface SettingProps {
  open: boolean;
  handleClose: () => void;
}
const Setting: React.FC<SettingProps> = ({
  open,
  handleClose,
}: SettingProps) => {
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setLocale(event.target.value as string));
  };
  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Setting</DialogTitle>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={locale}
        onChange={handleChange}
      >
        <MenuItem value="ja">Japanese</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
    </Dialog>
  );
};
export default Setting;
