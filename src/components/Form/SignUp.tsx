import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@material-ui/core/Grid";
import ControlTextField from "../TextField/ControlTextField";
import LoadingButton from "../Loading/LoadingButton";
import DefaultLayout from "../../layout/Default";
import {
  ISignErrorResponse,
  ISignSuccessResponse,
  ISignUpFormValues,
} from "../../interfaces";
import { signUpSchema } from "../../schema";
import { setHeaders, setCurrentUser } from "../../slices/currentUser";

interface SignUpProps {
  onSuccess: () => void;
}
const SignUp: React.FC<SignUpProps> = ({ onSuccess }: SignUpProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const handleSuccess = (res: AxiosResponse<ISignSuccessResponse>) => {
    dispatch(setCurrentUser(res.data.data));
    dispatch(setHeaders(res.headers));
    enqueueSnackbar("SignUp successful", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
    onSuccess();
  };
  const onError = (
    err: AxiosError<ISignErrorResponse<{ ["full_messages"]: string[] }>>
  ) => {
    if (err.response) {
      err.response.data.errors.full_messages.forEach((message) =>
        enqueueSnackbar(message, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        })
      );
    } else {
      enqueueSnackbar(String(err), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  };
  const { isLoading, mutate } = useMutation(
    (newUser: ISignUpFormValues) =>
      axios.post<ISignSuccessResponse>("/auth", newUser),
    { onSuccess: handleSuccess, onError }
  );
  const onSubmit = (data: ISignUpFormValues) => mutate(data);
  return (
    <DefaultLayout>
      <Box m={3}>
        <Typography variant="h4" align="center">
          SignUp
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ControlTextField
            name="nickname"
            defaultValue=""
            label="NickName"
            variant="outlined"
            margin="normal"
            control={control}
            errors={errors}
            disabled={isLoading}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ControlTextField
                name="familyname"
                defaultValue=""
                label="FamilyName"
                variant="outlined"
                control={control}
                errors={errors}
                disabled={isLoading}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <ControlTextField
                name="givenname"
                defaultValue=""
                label="GivenName"
                variant="outlined"
                control={control}
                errors={errors}
                disabled={isLoading}
                fullWidth
              />
            </Grid>
          </Grid>
          <ControlTextField
            type="email"
            name="email"
            defaultValue=""
            label="Email"
            variant="outlined"
            margin="normal"
            control={control}
            errors={errors}
            disabled={isLoading}
            fullWidth
          />
          <ControlTextField
            type="password"
            name="password"
            defaultValue=""
            label="Password"
            variant="outlined"
            margin="normal"
            control={control}
            errors={errors}
            disabled={isLoading}
            fullWidth
          />
          <ControlTextField
            type="password"
            name="password_confirmation"
            defaultValue=""
            label="PasswordConfirmation"
            variant="outlined"
            margin="normal"
            control={control}
            errors={errors}
            disabled={isLoading}
            fullWidth
          />
          <LoadingButton
            type="submit"
            loading={isLoading}
            color="primary"
            fullWidth
          >
            SignUp
          </LoadingButton>
        </form>
      </Box>
    </DefaultLayout>
  );
};

export default SignUp;
