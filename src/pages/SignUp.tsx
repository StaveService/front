import React from 'react';
import { useForm } from 'react-hook-form';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ControlTextField from '../components/ControlTextField';
import LoadingButton from '../components/LoadingButton';

const SignUp:React.FC = () => {
  const { errors, control, handleSubmit } = useForm();
  const onSubmit = () => {
    console.log('a');
  };
  return (
    <Container maxWidth="xs">
      <Paper>
        <Typography variant="h4">SignUp</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ControlTextField
            type="nickname"
            name="nickname"
            label="NickName"
            variant="outlined"
            control={control}
            defaultValue=""
            errors={errors}
            disabled={false}
            fullWidth
          />
          <ControlTextField
            type="firstname"
            name="firstname"
            label="FirstName"
            variant="outlined"
            control={control}
            defaultValue=""
            errors={errors}
            disabled={false}
            fullWidth
          />
          <ControlTextField
            type="lastname"
            name="lastname"
            label="LastName"
            variant="outlined"
            control={control}
            defaultValue=""
            errors={errors}
            disabled={false}
            fullWidth
          />
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
          <ControlTextField
            type="password_confirmation"
            name="password_confirmation"
            label="Password_confirmation"
            variant="outlined"
            control={control}
            defaultValue=""
            errors={errors}
            disabled={false}
            fullWidth
          />
          <LoadingButton loading={false}>
            SignUp
          </LoadingButton>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
