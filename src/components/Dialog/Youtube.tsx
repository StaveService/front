import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { ChangeEvent, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "../../ui/LoadingButton";

type YoutubeProps = DialogProps & {
  type: "v" | "channel";
  baseURL: string;
  id: string;
  loading: boolean;
  onPatch: (value: string) => void;
  onClose: () => void;
};
const Youtube: React.FC<YoutubeProps> = ({
  type,
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
    let youtubeId = value;
    if (value.includes("http")) {
      const url = new URL(value);
      if (type === "v") youtubeId = url.searchParams.get("v") || "";
      if (type === "channel") [, , youtubeId] = url.pathname.split("/");
    }
    onClose();
    onPatch(youtubeId);
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
export default Youtube;
