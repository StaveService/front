import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";
import LoadingButton from "../../../../../../components/Loading/LoadingButton";
import ControlAutocompleteTextField from "../../../../../../components/ControlAutocompleteTextField";

import routes from "../../../../../../router/routes.json";

interface EditProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}
interface IFormValue {
  composers: string;
  lyrists: string;
  band: string;
}
const Edit: React.FC<EditProps> = ({ setOpen, open }: EditProps) => {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, errors, handleSubmit } = useForm<IFormValue>();
  const handleClose = () => setOpen(false);
  const onSubmit = (data: SubmitHandler<IFormValue>) => {
    console.log(data);
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <Box m={3} width={500}>
        <DialogTitle>Edit Info</DialogTitle>
        <ControlAutocompleteTextField
          name="composers"
          defaultValue=""
          route={routes.ARTISTS}
          property="name"
          query="cont"
          control={control}
          errors={errors}
          textFieldProps={{
            label: "Composers",
            variant: "outlined",
            margin: "normal",
          }}
          autocompleteProps={{ multiple: true }}
        />
        <ControlAutocompleteTextField
          name="lyrists"
          defaultValue=""
          route={routes.ARTISTS}
          property="name"
          query="cont"
          control={control}
          errors={errors}
          textFieldProps={{
            label: "Lyrists",
            variant: "outlined",
            margin: "normal",
          }}
          autocompleteProps={{ multiple: true }}
        />
        <ControlAutocompleteTextField
          name="band"
          defaultValue=""
          route={routes.BANDS}
          property="name"
          query="cont"
          control={control}
          errors={errors}
          textFieldProps={{
            label: "Band",
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
