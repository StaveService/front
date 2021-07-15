import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Typography from "@material-ui/core/Typography";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@material-ui/core/Link";
import ControlTextField from "../../components/ControlTextField/ControlTextField";
import DefaultLayout from "../../layout/Default";
import { postContact } from "../../axios/axios";
import { IContact } from "../../interfaces";
import LoadingButton from "../../components/Loading/LoadingButton";
import { contactSchema } from "../../schema";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";

const Contact: React.FC = () => {
  const [successed, setSuccessed] = useState(false);
  const { onError } = useQuerySnackbar();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(contactSchema),
  });
  const handleSuccess = () => {
    setSuccessed(true);
  };
  const contactMutation = useMutation(
    (newContact: IContact) => postContact(newContact),
    {
      onSuccess: handleSuccess,
      onError,
    }
  );
  const onSubmit = (newContact: IContact) => contactMutation.mutate(newContact);
  if (successed) {
    return (
      <DefaultLayout>
        <Typography>Successed</Typography>
        <Link component={RouterLink} to="/">
          return Home
        </Link>
      </DefaultLayout>
    );
  }
  return (
    <DefaultLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography>Contact</Typography>
        <ControlTextField
          name="email"
          label="Email"
          defaultValue=""
          variant="outlined"
          margin="normal"
          control={control}
          errors={errors}
          fullWidth
        />
        <ControlTextField
          name="description"
          label="Description"
          defaultValue=""
          variant="outlined"
          margin="normal"
          control={control}
          errors={errors}
          rows={20}
          multiline
          fullWidth
        />
        <LoadingButton
          type="submit"
          color="primary"
          loading={contactMutation.isLoading}
          fullWidth
        >
          Submit
        </LoadingButton>
      </form>
    </DefaultLayout>
  );
};
export default Contact;
