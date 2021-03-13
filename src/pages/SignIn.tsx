import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import ControlTextField from '../components/ControlTextField';

const SignIn:React.FC = () => {
  const { errors, control } = useForm();
  return (
    <Container maxWidth="xs">
      <Paper>
        <Typography variant="h4">SignIn</Typography>
        <form>
          <ControlTextField
            type="email"
            name="email"
            label="Email"
            control={control}
            defaultValue=""
            disabled
            errors={errors}
            fullWidth
          />
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
