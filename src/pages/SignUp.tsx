import React, { useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@material-ui/core/Grid";
import ControlTextField from "../components/ControlTextField";
import LoadingButton from "../components/LoadingButton";
import { ISignUpFormValues } from "../interfaces";
import { signUpSchema } from "../schema";

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { errors, control, handleSubmit } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const onSubmit = async (data: SubmitHandler<ISignUpFormValues>) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/sign_in", data);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
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
              autoComplete="nickname"
              label="NickName"
              variant="outlined"
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
                  autoComplete="family-name"
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
                  autoComplete="given-name"
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
              defaultValue=""
              autoComplete="new-password"
              label="Password"
              variant="outlined"
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
