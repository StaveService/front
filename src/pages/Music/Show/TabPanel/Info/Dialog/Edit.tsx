import React, { useState } from "react";
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
  lyrists: string;
  band: string;
}
const Edit: React.FC<IEdit> = ({ setOpen, open }: IEdit) => {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, errors, watch, handleSubmit } = useForm<IFormValue>();
  const handleClose = () => setOpen(false);
  const onSubmit = (data: SubmitHandler<IFormValue>) => {
    console.log(data);
    setLoading(true);
  };
  const { composers, lyrists, band } = watch();
  return (
    <Dialog onClose={handleClose} open={open}>
      <Box m={3} width={500}>
        <DialogTitle>Edit Info</DialogTitle>
        <ControlAutocompleteTextField
          route={routes.ARTISTS}
          query="name_cont"
          inputValue={composers}
          controlTextFieldProps={{
            name: "composers",
            label: "Composers",
            defaultValue: "",
            control,
            errors,
            variant: "outlined",
            margin: "normal",
          }}
          autocompleteProps={{ multiple: true }}
        />
        <ControlAutocompleteTextField
          route={routes.ARTISTS}
          query="name_cont"
          inputValue={lyrists}
          controlTextFieldProps={{
            name: "lyrists",
            label: "Lyrists",
            defaultValue: "",
            control,
            errors,
            variant: "outlined",
            margin: "normal",
          }}
          autocompleteProps={{ multiple: true }}
        />
        <ControlAutocompleteTextField
          route={routes.BANDS}
          query="name_cont"
          inputValue={band}
          controlTextFieldProps={{
            name: "band",
            label: "band",
            defaultValue: "",
            control,
            errors,
            variant: "outlined",
            margin: "normal",
          }}
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
