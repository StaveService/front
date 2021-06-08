import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "../Loading/LoadingButton";

type TwitterProps = DialogProps & {
  loading: boolean;
  onPatch: (value: string) => void;
  onClose: () => void;
};
const Twitter: React.FC<TwitterProps> = ({
  loading,
  open,
  onPatch,
  onClose,
}: TwitterProps) => {
  const [value, setValue] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value.replace("https://twitter.com/", ""));
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
          label="https://twitter.com/"
          variant="outlined"
          value={value}
          onChange={handleChange}
          fullWidth
        />
        <LoadingButton
          fullWidth
          color="primary"
          loading={loading}
          onClick={handleClick}
        >
          UPDATE
        </LoadingButton>
      </Box>
    </Dialog>
  );
};
export default Twitter;
