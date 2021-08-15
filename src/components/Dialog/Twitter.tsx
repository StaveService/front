import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "../../ui/LoadingButton";
import getIDfromURL from "../../helpers/getIDfromURL";

type TwitterProps = DialogProps & {
  defaultValue: string | undefined;
  loading: boolean;
  onPatch: (value: string) => void;
  onClose: () => void;
};
const Twitter: React.FC<TwitterProps> = ({
  loading,
  open,
  defaultValue,
  onPatch,
  onClose,
}: TwitterProps) => {
  const [value, setValue] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(getIDfromURL(e.clipboardData.getData("text")));
  };
  const handleClick = () => {
    onClose();
    onPatch(value);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Twitter</DialogTitle>
      <Box p={3}>
        <TextField
          name="twitter"
          label="https://twitter.com"
          variant="outlined"
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onPaste={handlePaste}
          fullWidth
        />
        <LoadingButton
          fullWidth
          color="primary"
          loading={loading}
          disabled={!!value}
          onClick={handleClick}
        >
          UPDATE
        </LoadingButton>
      </Box>
    </Dialog>
  );
};
export default Twitter;
