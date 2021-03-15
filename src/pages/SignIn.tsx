import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { SubmitHandler, useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import ControlTextField from '../components/ControlTextField';
import LoadingButton from '../components/LoadingButton';
import { ISignInFormValues } from '../interfaces';

const SignIn:React.FC = () => {
  const { errors, control, handleSubmit } = useForm();
  const onSubmit = (data:SubmitHandler<ISignInFormValues>) => {
    console.log(data);
  };
  return (
    <Container maxWidth="xs">
      <Paper variant="outlined">
        <Box m={3}>
          <Typography variant="h4">SignIn</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ControlTextField
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              control={control}
              defaultValue=""
              errors={errors}
              disabled={false}
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
              disabled={false}
              fullWidth
            />
            <LoadingButton loading={false}>
              SignIn
            </LoadingButton>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
