import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import ControlTextField from '../components/ControlTextField';
import LoadingButton from '../components/LoadingButton';

const SignIn:React.FC = () => {
  const { errors, control, handleSubmit } = useForm();
  const onSubmit = () => {
    console.log('a');
  };
  return (
    <Container maxWidth="xs">
      <Paper>
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
      </Paper>
    </Container>
  );
};

export default SignIn;
