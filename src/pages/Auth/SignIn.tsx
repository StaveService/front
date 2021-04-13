import axios, { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useToggle } from "react-use";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import {
  ISignErrorResponse,
  ISignInFormValues,
  ISignSuccessResponse,
} from "../../interfaces";
import { signInSchema } from "../../schema";
import { setHeaders, setCurrentUser } from "../../slices/currentUser";

const SignIn: React.FC = () => {
  const [loading, toggleLoading] = useToggle(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { errors, control, setValue, handleSubmit } = useForm({
    resolver: yupResolver(signInSchema),
  });
  if (process.env.NODE_ENV === "development") {
    useEffect(() => {
      setValue("email", "test@test.com");
      setValue("password", "password");
    }, []);
  }
  const onSubmit = (data: SubmitHandler<ISignInFormValues>) => {
    toggleLoading();
    axios
      .post<ISignSuccessResponse>("/auth/sign_in", data)
      .then((res) => {
        dispatch(setCurrentUser(res.data.data));
        dispatch(setHeaders(res.headers));
        enqueueSnackbar("SignIn successful", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        });
        history.push("/");
      })
      .catch((err: AxiosError<ISignErrorResponse<string[]>>) => {
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
      })
      .finally(toggleLoading);
  };
  return (
    <Container maxWidth="xs">
      <Paper variant="outlined">
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
              disabled={loading}
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
              disabled={loading}
              fullWidth
            />
            <LoadingButton loading={loading}>SignIn</LoadingButton>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
