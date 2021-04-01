import React, { useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import LoadingButton from "../../../../../../components/LoadingButton";
import ControlAutocompleteTextField from "../../../../../../components/ControlAutocompleteTextField";
import routes from "../../../../../../router/routes.json";

interface IEdit {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}
interface IFormValue {
  composers: string;
}
const Edit: React.FC<IEdit> = ({ setOpen, open }: IEdit) => {
  const [loading, setLoading] = useState(false);
  const { control, errors, handleSubmit } = useForm();
  const handleClose = () => setOpen(false);
  const onSubmit = (data: SubmitHandler<IFormValue>) => {
    console.log(data);
    setLoading(true);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <Box m={3} width={500}>
        <DialogTitle>Edit Info</DialogTitle>
        <ControlAutocompleteTextField
          name="composers"
          label="Composers"
          route={routes.ARTISTS}
          control={control}
          errors={errors}
          variant="outlined"
        />
        <LoadingButton
          type="button"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          Update
        </LoadingButton>
      </Box>
    </Dialog>
  );
};

export default Edit;
