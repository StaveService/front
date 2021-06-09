import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { ChangeEvent, useState } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "../Loading/LoadingButton";

type TwitterProps = DialogProps & {
  defaultValue: string | undefined;
  loading: boolean;
  onPatch: (value: string) => void;
  onClose: () => void;
};
const TWITTER_URL = "https://twitter.com/";
const Twitter: React.FC<TwitterProps> = ({
  loading,
  open,
  defaultValue,
  onPatch,
  onClose,
}: TwitterProps) => {
  const [value, setValue] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value.replace(TWITTER_URL, ""));
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
          label={TWITTER_URL}
          variant="outlined"
          value={value}
          defaultValue={defaultValue}
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
