import React from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import DefaultLayout from "../../layout/Default";
import SignInForm from "../../components/Form/SignIn";

const SignIn: React.FC = () => {
  return (
    <DefaultLayout>
      <Container maxWidth="xs">
        <Paper variant="outlined">
          <SignInForm />
        </Paper>
      </Container>
    </DefaultLayout>
  );
};

export default SignIn;
