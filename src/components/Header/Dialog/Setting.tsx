import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import {
  ICountryCode,
  ILocale,
  selectCountryCode,
  selectLocale,
  setCountryCode,
  setLocale,
} from "../../../slices/language";

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
  const countryCode = useSelector(selectCountryCode);
  const handleLocaleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setLocale(event.target.value as ILocale));
  };
  const handleCountryCodeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(setCountryCode(event.target.value as ICountryCode));
  };
  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>Setting</DialogTitle>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={locale}
        onChange={handleLocaleChange}
      >
        <MenuItem value="ja">Japanese</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={countryCode}
        onChange={handleCountryCodeChange}
      >
        <MenuItem value="JP">JP</MenuItem>
        <MenuItem value="US">US</MenuItem>
      </Select>
    </Dialog>
  );
};
export default Setting;
