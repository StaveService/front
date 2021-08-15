import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "../../ui/LoadingButton";
import getIDfromYoutubeURL from "../../helpers/getIDfromYoutubeURL";

type YoutubeProps = DialogProps & {
  baseURL: string;
  id: string;
  loading: boolean;
  onPatch: (value: string) => void;
  onClose: () => void;
};
const Youtube: React.FC<YoutubeProps> = ({
  id,
  baseURL,
  loading,
  open,
  onPatch,
  onClose,
}: YoutubeProps) => {
  const [value, setValue] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const handleClick = () => {
    onClose();
    onPatch(getIDfromYoutubeURL(value) || "");
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.clipboardData.getData("text"));
  };
  useEffect(() => {
    if (id) setValue(baseURL + id);
  }, [baseURL, id]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Youtube</DialogTitle>
      <Box p={3}>
        <TextField
          name="youtube"
          label={baseURL}
          variant="outlined"
          value={value}
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
export default Youtube;
