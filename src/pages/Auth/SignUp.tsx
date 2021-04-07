import React, { useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@material-ui/core/Grid";
import ControlTextField from "../../components/ControlTextField";
import LoadingButton from "../../components/Loading/LoadingButton";
import { ISignUpFormValues } from "../../interfaces";
import { signUpSchema } from "../../schema";

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const onSubmit = (data: SubmitHandler<ISignUpFormValues>) => {
    setLoading(true);
    axios
      .post("/auth", data)
      .then((res) => console.log(res))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  };
  return (
    <Container maxWidth="xs">
      <Paper variant="outlined">
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
              disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              fullWidth
            />
            <LoadingButton loading={loading}>SignUp</LoadingButton>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
