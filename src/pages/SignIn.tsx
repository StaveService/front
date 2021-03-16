import React, { useState } from 'react';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ControlTextField from '../components/ControlTextField';
import LoadingButton from '../components/LoadingButton';
import { ISignInFormValues } from '../interfaces';
import { signInSchema } from '../schema';

const SignIn:React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { errors, control, handleSubmit } = useForm({ resolver: yupResolver(signInSchema) });
  const onSubmit = async (data:SubmitHandler<ISignInFormValues>) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/sign_in', data);
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
          <Typography variant="h4" align="center">SignIn</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ControlTextField
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              control={control}
              defaultValue=""
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
            <LoadingButton loading={loading}>
              SignIn
            </LoadingButton>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
