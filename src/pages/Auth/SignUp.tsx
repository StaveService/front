import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import React from "react";
import SignUpForm from "../../components/Form/SignUp";
import DefaultLayout from "../../layout/Default";

const SignUp: React.FC = () => {
  return (
    <DefaultLayout>
      <Container maxWidth="xs">
        <Paper variant="outlined">
          <SignUpForm />
        </Paper>
      </Container>
    </DefaultLayout>
  );
};

export default SignUp;
