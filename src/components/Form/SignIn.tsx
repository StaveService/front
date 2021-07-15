import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ControlTextField from "../TextField/ControlTextField";
import LoadingButton from "../Loading/LoadingButton";
import {
  ISignErrorResponse,
  ISignInFormValues,
  ISignSuccessResponse,
} from "../../interfaces";
import { signInSchema } from "../../schema";
import { signIn } from "../../axios/axios";
import { setHeaders, setCurrentUser } from "../../slices/currentUser";

interface SignInProps {
  onSuccess: () => void;
}
const SignIn: React.FC<SignInProps> = ({ onSuccess }: SignInProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(signInSchema),
  });
  const handleSuccess = (res: AxiosResponse<ISignSuccessResponse>) => {
    dispatch(setCurrentUser(res.data.data));
    dispatch(setHeaders(res.headers));
    enqueueSnackbar("SignIn successful", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
    onSuccess();
  };
  const onError = (err: AxiosError<ISignErrorResponse<string[]>>) => {
    if (err.response) {
      enqueueSnackbar(err.response.data.errors, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
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
    (user: ISignInFormValues) => signIn(user),
    { onSuccess: handleSuccess, onError }
  );
  // TODO: ONLY DEVELOPMENT
  useEffect(() => {
    setValue("email", "test@test.com");
    setValue("password", "password");
  }, [setValue]);
  const onSubmit = (data: ISignInFormValues) => mutate(data);
  return (
    <Box m={3}>
      <Typography variant="h4" align="center">
        SignIn
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ControlTextField
          type="email"
          name="email"
          defaultValue=""
          autoComplete="on"
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
          label="Password"
          variant="outlined"
          margin="normal"
          control={control}
          defaultValue=""
          errors={errors}
          disabled={isLoading}
          fullWidth
        />
        <LoadingButton
          type="submit"
          color="primary"
          loading={isLoading}
          fullWidth
        >
          SignIn
        </LoadingButton>
      </form>
    </Box>
  );
};

export default SignIn;
