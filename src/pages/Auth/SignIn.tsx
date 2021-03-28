import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ISignInFormValues, IUserSuccessResponse } from "../../interfaces";
import { signInSchema } from "../../schema";
import { setHeaders, setCurrentUser } from "../../slices/currentUser";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/LoadingButton";

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    axios
      .post<IUserSuccessResponse>("/auth/sign_in", data)
      .then((res) => {
        dispatch(setCurrentUser(res.data.data));
        dispatch(setHeaders(res.headers));
        history.push("/");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
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
